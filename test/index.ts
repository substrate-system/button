import { test } from '@bicycle-codes/tapzero'
import { waitFor } from '@bicycle-codes/dom'
import '../src/index.js'

test('example test', async t => {
    document.body.innerHTML += `
        <substrate-button class="test">
        </substrate-button>
    `

    const el = await waitFor('substrate-button')

    t.ok(el, 'should find an element')
})
