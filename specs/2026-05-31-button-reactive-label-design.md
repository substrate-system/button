# substrate-button: reactive label content

Date: 2026-05-31

## Problem

`<substrate-button>` renders its label once and never updates it. When a
consumer changes the label after the initial render, the change is not
reflected in the DOM. This is most visible with a framework such as
Preact:

```jsx
<substrate-button>{label}</substrate-button>
```

When `label` changes, the button keeps showing the old text.

## Root cause

In `src/index.ts`, `render()` reads the label once and replaces the
host's content via `innerHTML`:

```ts
const text = this.innerHTML
this.innerHTML = html(btnProps, text)
```

Assigning `this.innerHTML` parses a brand-new DOM subtree and discards
the previous child nodes. Preact created the original text node and
holds a reference to it for future updates. After the `innerHTML`
assignment that node is detached and destroyed. When `label` changes,
Preact writes the new value to its now-orphaned node, which is no longer
in the document, so nothing visible updates.

A `MutationObserver` cannot fix this: Preact mutates a node that is
outside the host's subtree, so no observer on the host would ever fire.

## Constraints

These are hard requirements that shaped the approach:

1. No Shadow DOM, ever.
2. The component takes children like a regular button:
   `<substrate-button>{label}</substrate-button>`.
3. Compatible with the Preact renderer (label updates must show).
4. Native HTML form submission must keep working (`type="submit"`,
   `formaction`, etc.).

## Approach: move child nodes into the button (preserve node identity)

Instead of destroying the host's children with `innerHTML`, `render()`
creates a real light-DOM `<button>` and **moves** the host's existing
child nodes into it. Moving preserves node identity, so Preact's
reference stays valid and its in-place `.data` updates remain visible.

### Why this is safe with Preact (verified, not assumed)

Preact 10.29.0 `src/diff/children.js` only relocates a DOM node when the
node's vnode carries the `INSERT_VNODE` flag (`shouldPlace`):

```js
let shouldPlace = !!(childVNode._flags & INSERT_VNODE);
if (shouldPlace || oldVNode._children === childVNode._children) {
    oldDom = insert(childVNode, oldDom, parentDom, shouldPlace);
}
```

`insert()` only calls `parentDom.insertBefore(...)` when `shouldPlace`
is true. A stable text child whose value changes is *matched*, not
flagged for insertion, so `shouldPlace` is false. Preact updates
`node.data` in place and does not move the node. That means moving the
text node into our button does not get undone on the next render.

## Implementation

Single change, in `src/index.ts` `render()`. Attribute reading and
`btnProps` construction stay as they are today. The label handling
changes:

```ts
render () {
    if (this.querySelector('button')) return   // already rendered (SSR/idempotent)

    // ...read attributes exactly as today, build btnProps...
    // (the `const text = this.innerHTML` line is removed)

    // Snapshot the host's current children (the label) before we touch
    // the DOM. These are the nodes Preact owns and mutates in place.
    const labelNodes = Array.from(this.childNodes)

    // Reuse html() for all attribute logic, but render an EMPTY button
    // shell so we can move the real nodes in (preserving identity).
    const tmp = document.createElement('template')
    tmp.innerHTML = html(btnProps, '')
    const btn = tmp.content.querySelector('button')!
    const content = btn.querySelector('.btn-content') as HTMLElement

    for (const node of labelNodes) content.appendChild(node)  // moves, not clones
    this.appendChild(btn)
}
```

Notes:

- `content.appendChild(node)` moves each node (same object identity);
  it does not clone.
- Snapshotting into `labelNodes` first prevents the loop from moving the
  freshly-appended `btn` into its own span.
- `html(btnProps, '')` produces the same button markup as today with
  empty content; we then fill `.btn-content` with the real nodes.

## What deliberately does not change

- `src/html.ts` — untouched. The SSR (node) path is identical. The
  client path is reused with empty content.
- Native form submission — still a real light-DOM `<button>`, so
  `type="submit"`, `formaction`, `formmethod`, etc. work natively.
- `src/index.css`, `src/client.ts`, `observedAttributes`, and all
  getters/setters (`disabled`, `spinning`, `type`, `button`) — unchanged.
  `el.button` still resolves and `_setupKeyboardHandlers()` still runs
  after `render()` because the button exists.
- The SSR early-return (`if (this.querySelector('button')) return`) is
  kept so server-rendered markup is not clobbered on hydration.

## Known limitation

This makes a label that **changes value** reactive (text, or a stable
element child). It does not support a consumer **dynamically
adding/removing element children** after mount: Preact reconciles the
host's child list, so brand-new nodes would be inserted into the host,
outside the button. This is an edge case for a button label and is
documented rather than engineered around.

## Testing

Per project rules, no brittle text-content assertions. The reactivity
test asserts node identity is preserved across a re-render, which is the
actual contract of the fix:

1. Render `<substrate-button>{label}</substrate-button>` via Preact with
   `label = 'one'`.
2. Capture the text node inside `.btn-content`.
3. Re-render with `label = 'two'`.
4. Assert the captured text node is the same instance, still
   `isConnected`, and its `.data` is now `'two'`.

If the old detaching behavior regressed, the visible node would be a
different object, so this catches the regression without asserting any
HTML structure.

Existing tests (static markup and the Preact disabled tests) must
continue to pass.

## Out of scope

- Imperative wholesale replacement via `el.textContent = '...'` (which
  would destroy the button). A guarded childList-only `MutationObserver`
  could support it later, but it is not needed for the Preact use case.
- SSR + Preact hydration of dynamic labels.
