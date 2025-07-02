import { html } from './html.js'
import { SubstrateButton as SubstrateButtonLight } from './client.js'

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
        }

        this.innerHTML = html(btnProps, text)
    }
}
