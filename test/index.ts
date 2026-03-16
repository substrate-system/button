import { test } from '@substrate-system/tapzero'
import { waitFor } from '@substrate-system/dom'
import { SubstrateButton } from '../src/index.js'
import { html } from 'htm/preact'
import { render } from 'preact'

SubstrateButton.define()

test('create a button', async t => {
    document.body.innerHTML += `
        <${SubstrateButton.TAG} class="test">
            button
        </${SubstrateButton.TAG}>
    `

    const el = await waitFor('substrate-button') as SubstrateButton

    t.ok(el instanceof SubstrateButton,
        'Can use the static method to get the tag name')
    t.equal(el.disabled, false, 'should not be disabled')

    el.setAttribute('disabled', '')
    t.equal(el.disabled, true, 'Should be disabled via `setAttribute`')
    t.ok(el.button instanceof HTMLButtonElement, 'should contain a button')
})

test('disabled property reflects to host attribute', async t => {
    document.body.innerHTML += `
        <substrate-button id="reflect-test">
            click me
        </substrate-button>
    `
    const el = await waitFor(
        '#reflect-test'
    ) as SubstrateButton

    t.equal(el.hasAttribute('disabled'), false,
        'should not have disabled attribute initially')

    el.disabled = true
    t.equal(el.hasAttribute('disabled'), true,
        'setting .disabled=true reflects to host attribute')

    el.disabled = false
    t.equal(el.hasAttribute('disabled'), false,
        'setting .disabled=false removes host attribute')
})

test('autofocus property reflects to host attribute', async t => {
    document.body.innerHTML += `
        <substrate-button id="autofocus-test">
            click me
        </substrate-button>
    `
    const el = await waitFor(
        '#autofocus-test'
    ) as SubstrateButton

    el.autofocus = true
    t.equal(el.hasAttribute('autofocus'), true,
        'setting .autofocus=true reflects to host attribute')

    el.autofocus = false
    t.equal(el.hasAttribute('autofocus'), false,
        'setting .autofocus=false removes host attribute')
})

test('setAttribute disabled still works (no loop)', async t => {
    document.body.innerHTML += `
        <substrate-button id="attr-test">
            click me
        </substrate-button>
    `
    const el = await waitFor('#attr-test') as SubstrateButton

    el.setAttribute('disabled', '')
    t.equal(el.disabled, true,
        'setAttribute disabled sets .disabled property')
    t.ok(el.button?.hasAttribute('disabled'),
        'inner button gets disabled attribute')

    el.removeAttribute('disabled')
    t.equal(el.disabled, false,
        'removeAttribute disabled clears .disabled property')
    t.ok(!el.button?.hasAttribute('disabled'),
        'inner button loses disabled attribute')
})

test('preact: render button with disabled attribute', t => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    render(
        html`<substrate-button disabled>click me</substrate-button>`,
        container
    )

    const el = container.querySelector('substrate-button') as SubstrateButton

    // render() and connectedCallback are synchronous; no async wait needed
    t.equal(el.disabled, true,
        'el.disabled is true when rendered via preact with disabled attr'
    )
    t.ok(el.button?.hasAttribute('disabled'),
        'inner button has disabled attribute')

    const container2 = document.createElement('div')
    document.body.appendChild(container2)
    render(html`<${SubstrateButton.TAG} disabled=${true}>click<//>`, container2)
    const attr = container2
        .querySelector('substrate-button button')?.hasAttribute('disabled')

    t.ok(attr, 'can pass a boolean attribute to disable the button')
})

test('preact: render button without disabled attribute', t => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    render(
        html`<substrate-button>click me</substrate-button>`,
        container
    )

    const el = container.querySelector(
        'substrate-button'
    ) as SubstrateButton

    t.equal(
        el.disabled,
        false,
        'el.disabled is false when rendered via preact without disabled attr'
    )
    t.ok(
        !el.button?.hasAttribute('disabled'),
        'inner button has no disabled attribute'
    )
})

test('all done', () => {
    // @ts-expect-error tests
    window.testsFinished = true
})
