import { test } from '@substrate-system/tapzero'
import { waitFor } from '@bicycle-codes/dom'
import { SubstrateButton } from '../src/index.js'

test('create a button', async t => {
    document.body.innerHTML += `
        <${SubstrateButton.tag} class="test">
        </${SubstrateButton.tag}>
    `

    const el = await waitFor('substrate-button')

    t.ok(el, 'Can use the static method to create the element')
})
