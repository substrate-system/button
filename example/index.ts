import '../src/index.css'
import { SubstrateButton } from '../src/index.js'

SubstrateButton.define()

document.body.innerHTML += `
    <substrate-button>hello</substrate-button>
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
