import { html } from './html.js'
import { define } from '@substrate-system/web-component'
import { SubstrateButton as SubstrateButtonLight } from './client.js'
// import Debug from '@substrate-system/debug'
// const debug = Debug('button')

/**
 * This is the full-version -- knows how to render itself in the browser.
 */
export class SubstrateButton extends SubstrateButtonLight {
    static define () {
        define(SubstrateButton.TAG, SubstrateButton)
    }

    connectedCallback ():void {
        this.render()
        this._setupKeyboardHandlers()
    }

    render () {
        const {
            type,
            autofocus,
            tabindex,
            disabled,
        } = this
        const name = this.getAttribute('name')
        const ariaLabel = this.getAttribute('aria-label')

        const spinning = this.getAttribute('spinning') !== null

        const classes:(string|null)[] = [
            'substrate-button',
            this.getAttribute('class'),
            spinning ? 'spinning' : null
        ]
        const text = this.innerHTML

        const btnProps = {
            classes: classes.filter(Boolean),
            disabled,
            autofocus,
            tabindex,
            type,
            name,
            ariaLabel,
        }

        this.innerHTML = html(btnProps, text)
    }
}

define('substrate-button', SubstrateButton)
