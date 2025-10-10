import { html } from './html.js'
import { SubstrateButton as SubstrateButtonLight } from './client.js'

/**
 * This is the full-version -- knows how to render itself in the browser.
 */
export class SubstrateButton extends SubstrateButtonLight {
    static define () {
        if (!('customElements' in window)) return

        return customElements.define(
            SubstrateButton.TAG || 'substrate-button',
            SubstrateButton
        )
    }

    connectedCallback ():void {
        this.render()
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

        const classes:(string|null)[] = [
            'substrate-button',
            this.getAttribute('class')
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
