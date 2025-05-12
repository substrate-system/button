import '../src/index.css'
import { SubstrateButton } from '../src/index.js'

SubstrateButton.define()

document.body.innerHTML += `
    <p>Resolve for 3 seconds:</p>
    <substrate-button>hello</substrate-button>

    <p>Disabled:</p>
    <substrate-button id="disabled" disabled>disabled</substrate-button>
`

const el = document.querySelector('substrate-button')

if (el) {
    el.addEventListener('click', () => {
        el.spinning = true
        setTimeout(() => {
            el.spinning = false
        }, 3000)
    })
}

// @ts-expect-error dev
window.setAttribute = function () {
    el?.setAttribute('spinning', '')
}

// @ts-expect-error dev
window.rmAttribute = function () {
    el?.removeAttribute('spinning')
}
