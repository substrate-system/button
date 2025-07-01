import { test } from '@substrate-system/tapzero'
import { waitFor } from '@substrate-system/dom'
import { SubstrateButton } from '../src/index.js'

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
