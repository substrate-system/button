# Reactive Button Label Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps
> use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `<substrate-button>`'s label update when a framework
(Preact) changes it, without Shadow DOM and without breaking native form
submission.

**Architecture:** In `render()`, stop replacing the host's content with
`this.innerHTML = html(...)` (which destroys the framework-owned label
nodes). Instead build an empty `<button>` shell from `html()` and *move*
the host's existing child nodes into its `.btn-content` span. Preserving
node identity keeps Preact's `_dom` reference valid, so its in-place
`.data` updates remain visible.

**Tech Stack:** TypeScript, `@substrate-system/web-component`, Preact
(consumer/test), `htm/preact`, tapzero + tapout (browser test runner),
esbuild.

**Spec:** `specs/2026-05-31-button-reactive-label-design.md`

---

### Task 1: Move label nodes into the button so Preact updates stay live

**Files:**
- Modify: `src/index.ts` (the `render()` method, currently lines 23-63)
- Test: `test/index.ts` (append a new test)

Background for the engineer:
- `src/index.ts` exports the full `SubstrateButton`, which knows how to
  render itself. `render()` runs from `connectedCallback`.
- `html()` (from `src/html.js`, already imported in `index.ts`) returns
  the `<button>` markup string. In the browser it returns
  `<button ...><span class="btn-content">CONTENT</span></button>`.
- `FORWARDED_ATTRS` is already imported in `index.ts`.
- Tests run in a real browser: `npm test` builds, bundles
  `test/index.ts` with esbuild, and pipes to `tapout`. esbuild resolves
  the `../src/index.js` import to `src/index.ts`, so source edits are
  picked up. There is no single-test filter; `npm test` runs the whole
  file.
- The custom element is defined at import time (`SubstrateButton.define()`
  at the top of the test file), so `connectedCallback` runs
  synchronously when the element is connected to an already-connected
  container. No `waitFor` is needed after `render()`.

- [ ] **Step 1: Write the failing test**

Append this test to the end of `test/index.ts`. It uses `html` (from
`htm/preact`) and `render` (from `preact`), both already imported at the
top of the file. The strings `'one'` and `'two'` are arbitrary test
fixtures, not product copy — we assert the reactivity *mechanism* (the
same live node is updated), not rendered product text.

```ts
test('preact: label content updates reactively', t => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    // Initial render with label "one".
    render(html`<${SubstrateButton.TAG}>one<//>`, container)
    const el = container.querySelector(
        SubstrateButton.TAG
    ) as SubstrateButton

    // connectedCallback rendered synchronously; the shell exists now.
    const content = el.querySelector('.btn-content') as HTMLElement
    t.ok(content, 'has a .btn-content element')

    // The live text node Preact created and render() moved into place.
    const textNode = content.firstChild as Text
    t.ok(textNode, 'label text node exists inside .btn-content')

    // Re-render with a new label value (simulates a signal/prop change).
    render(html`<${SubstrateButton.TAG}>two<//>`, container)

    // The same node instance is reused, still connected, now updated:
    // this only holds if render() moved the node instead of replacing
    // innerHTML (which would detach Preact's node).
    t.equal(content.firstChild, textNode,
        'the same text node instance is reused (not detached)')
    t.ok(textNode.isConnected, 'the text node is still in the document')
    t.equal(textNode.data, 'two',
        'Preact updated the live node in place')

    container.remove()
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: the new test `preact: label content updates reactively`
FAILS on the assertion `Preact updated the live node in place`
(`textNode.data` is still `'one'`, because the current code replaces
`innerHTML`, detaching Preact's node and leaving a stale parsed node in
`.btn-content`). All other existing tests still pass.

- [ ] **Step 3: Replace `render()` to move nodes instead of stringifying**

In `src/index.ts`, replace the entire `render()` method (currently lines
23-63) with the following. The attribute-reading and `btnProps`
construction are unchanged; only the label handling at the end changes
(no more `const text = this.innerHTML`, no more
`this.innerHTML = html(...)`).

```ts
    render () {
        if (this.querySelector('button')) return
        // Read directly from host attributes: the inner button does not
        // exist yet when render() first runs, so the getters (which
        // read from the inner button) would return false.
        const type = this.getAttribute('type')
        const tabindexAttr = this.getAttribute('tabindex')
        const tabindex = tabindexAttr ? parseInt(tabindexAttr) : 0
        const disabled = this.hasAttribute('disabled')
        const autofocus = this.hasAttribute('autofocus')
        const name = this.getAttribute('name')
        const ariaLabel = this.getAttribute('aria-label')

        const spinning = this.getAttribute('spinning') !== null

        const classes:(string|null)[] = [
            'substrate-button',
            this.getAttribute('class'),
            spinning ? 'spinning' : null
        ]

        const extraAttrs:Record<string, string> = {}
        for (const attr of FORWARDED_ATTRS) {
            const v = this.getAttribute(attr)
            if (v !== null) extraAttrs[attr] = v
        }

        const btnProps = {
            classes: classes.filter(Boolean),
            disabled,
            autofocus,
            tabindex,
            type,
            name,
            ariaLabel,
            extraAttrs,
        }

        // Move the host's existing child nodes (the label) into the
        // button instead of stringifying them. Preserving node identity
        // keeps framework reconcilers (e.g. Preact) able to update the
        // label in place after the initial render.
        const labelNodes = Array.from(this.childNodes)

        const tmp = document.createElement('template')
        tmp.innerHTML = html(btnProps, '')
        const btn = tmp.content.querySelector('button')!
        const content = btn.querySelector('.btn-content') as HTMLElement

        // appendChild moves each node (same instance), it does not clone.
        // Snapshotting labelNodes first prevents moving the freshly
        // appended btn into its own span.
        for (const node of labelNodes) content.appendChild(node)
        this.appendChild(btn)
    }
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: `preact: label content updates reactively` PASSES, and every
pre-existing test still PASSES.

- [ ] **Step 5: Lint**

Run: `npm run lint`
Expected: no errors. (Watch the 80-column limit; the code above is
already within it.)

- [ ] **Step 6: Commit**

```bash
git add src/index.ts test/index.ts
git commit -m "fix: keep button label reactive by moving child nodes

render() moved the label into the button by reassigning innerHTML, which
detached the text node Preact holds a reference to, so later label
changes never showed. Move the existing child nodes into .btn-content
instead, preserving node identity so Preact updates them in place. Keeps
a real light-DOM button (native form submission intact) and uses no
Shadow DOM.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**
- Approach (move nodes, reuse `html()` with empty content, snapshot
  children) — Task 1, Step 3. Covered.
- "What deliberately does not change" (`html.ts`, forms, CSS, client.ts,
  observedAttributes, SSR early-return) — the plan only edits `render()`
  and the early-return is preserved in Step 3. Covered.
- Testing (node-identity reactivity test, non-brittle) — Task 1, Step 1.
  Covered.
- Known limitation / out-of-scope (dynamic structural children,
  imperative `textContent`, SSR+Preact hydration) — intentionally not
  implemented; nothing to do. Covered by omission.

**Placeholder scan:** No TBD/TODO; full test code and full `render()`
body are included.

**Type consistency:** `render()` signature unchanged. `btnProps` shape
matches `html()`'s `Partial<Attrs>` parameter (same keys used today).
`SubstrateButton.TAG`, `el.button`, and `.btn-content` all already exist
in the codebase. Test uses `html`/`render` already imported in
`test/index.ts`.
