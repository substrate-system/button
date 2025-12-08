import '../src/index.css'
import { SubstrateButton } from '../src/index.js'
// import { SubstrateButton as BtnLight } from '../src/client.js'
import Debug from '@substrate-system/debug'
const debug = Debug(import.meta.env.DEV)

if (import.meta.env.DEV) {
    localStorage.setItem('DEBUG', 'button')
} else {
    localStorage.removeItem('DEBUG')
}

SubstrateButton.define()

const el = document.querySelector('#basic') as SubstrateButton
const labeledBtn = document.querySelector('#labeled') as SubstrateButton
const motionBtn = document.querySelector('#motion') as SubstrateButton

if (el) {
    debug('the element...', el)
    el.addEventListener('click', () => {
        el.spinning = true
        setTimeout(() => { el.spinning = false }, 3000)
    })
}

if (labeledBtn) {
    labeledBtn.addEventListener('click', () => {
        labeledBtn.spinning = true
        setTimeout(() => {
            labeledBtn.spinning = false
            alert('Changes saved!')
        }, 2000)
    })
}

if (motionBtn) {
    motionBtn.addEventListener('click', () => {
        motionBtn.spinning = true
        setTimeout(() => {
            motionBtn.spinning = false
        }, 3000)
    })
}

// @ts-expect-error dev
window.setSpinning = function () {
    el?.setAttribute('spinning', '')
}

// @ts-expect-error dev
window.rmSpinning = function () {
    el?.removeAttribute('spinning')
}
