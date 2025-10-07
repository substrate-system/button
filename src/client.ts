// for docuement.querySelector
declare global {
    interface HTMLElementTagNameMap {
        'substrate-button': SubstrateButton
    }
}

/**
 * This is the lightweight version for browsers + server-side rendering.
 */
export class SubstrateButton extends HTMLElement {
    // for `attributeChangedCallback`
    static observedAttributes = ['autofocus', 'disabled', 'spinning']
    static TAG = 'substrate-button'
    _isSpinning:boolean

    constructor () {
        super()
        const disabled = this.getAttribute('disabled')
        if (disabled !== null) {
            setTimeout(() => {
                // need to wait for it to render
                this.disabled = true
            }, 0)
        }
        this.autofocus = (this.getAttribute('autofocus') !== null)
        this._isSpinning = (this.getAttribute('spinning') !== null)
    }

    get form ():HTMLFormElement|undefined|null {
        return this.button?.form
    }

    get disabled ():boolean {
        return !!(this.button?.hasAttribute('disabled'))
    }

    set disabled (disabledValue:boolean) {
        if (!disabledValue) {
            this._removeAttribute('disabled')
            this.button?.setAttribute('aria-disabled', 'false')
        } else {
            this.button?.setAttribute('disabled', '')
            this.button?.setAttribute('aria-disabled', 'true')
        }
    }

    get type ():string|null|undefined {
        return this.button?.getAttribute('type')
    }

    get tabindex ():number {
        const i = this.button?.getAttribute('tabindex')
        if (!i) return 0
        return parseInt(i)
    }

    get spinning ():boolean {
        return this._isSpinning
    }

    set spinning (value:boolean) {
        if (value) this.setAttribute('spinning', '')
        else this.removeAttribute('spinning')
    }

    set type (value:string) {
        this._setAttribute('type', value)
    }

    get autofocus ():boolean {
        return !!(this.button?.hasAttribute('autofocus'))
    }

    set autofocus (value:boolean) {
        if (value) {
            this._setAttribute('autofocus', value)
        } else {
            this._removeAttribute('autofocus')
        }
    }

    /**
     * Set attributes on the internal button element.
     */
    _setAttribute (name:string, value:boolean|string|null):void {
        if (value === false) {
            // false means remove the attribute
            this._removeAttribute(name)
            this.button?.removeAttribute(name)
        } else {
            if (value === true) {
                // true means set the attribute with no value
                return this.button?.setAttribute(name, '')
            }

            if (value === null) {
                // null means remove
                return this._removeAttribute(name)
            }

            // else, set value to a string
            this.button?.setAttribute(name, value)
        }
    }

    /**
     * Remove from `this` and also button child.
     */
    _removeAttribute (name:string) {
        this.removeAttribute(name)
        this.button?.removeAttribute(name)
    }

    get button ():HTMLButtonElement|null {
        return this.querySelector('button')
    }

    /**
     * Handle 'autofocus' attribute changes
     * @see {@link https://gomakethings.com/how-to-detect-when-attributes-change-on-a-web-component/#organizing-your-code Go Make Things article}
     *
     * @param  {string} oldValue The old attribute value
     * @param  {string} newValue The new attribute value
     */
    handleChange_autofocus (_oldValue:string, newValue:string) {
        this._setAttribute('autofocus', newValue)
    }

    handleChange_disabled (_old, newValue:boolean|string) {
        this.disabled = (newValue !== null)
        if (newValue === null) this.button?.removeAttribute('disabled')
        else this.button?.setAttribute('disabled', '' + newValue)
    }

    handleChange_spinning (_, newValue:boolean) {
        if (newValue !== null) {
            this.classList.add('substrate-loading')
        } else {
            this.classList.remove('substrate-loading')
        }
    }

    /**
     * Runs when the value of an attribute is changed.
     *
     * Should add methods to this class like `handleChange_class`, to
     * listen for changes to `class` attribute.
     *
     * @param  {string} name     The attribute name
     * @param  {string} oldValue The old attribute value
     * @param  {string} newValue The new attribute value
     */
    attributeChangedCallback (name:string, oldValue:string, newValue:string) {
        const handler = this[`handleChange_${name}`];
        (handler && handler.call(this, oldValue, newValue))
    }

    connectedCallback () {
        // connect event listeners
        this.render()
    }

    static define ():void {
        return define(SubstrateButton.TAG, SubstrateButton)
    }

    render () {
        // noop
    }
}

export function isRegistered (elName:string):boolean {
    return document.createElement(elName).constructor !== window.HTMLElement
}

export function define (name:string, element:CustomElementConstructor):void {
    if (!window) return
    if (!('customElements' in window)) return

    if (!isRegistered(name)) {
        window.customElements.define(name, element)
    }
}
