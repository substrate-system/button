export type Attrs = {
    type:string|null;
    autofocus:boolean;
    tabindex:string|number;
    disabled:boolean;
    name:string|null;
    classes:string[]|Set<string>;
    ariaLabel:string|null;
}

export function html (attrs:Partial<Attrs>, textContent:string) {
    const {
        type,
        autofocus,
        tabindex,
        disabled,
        classes,
        name,
        ariaLabel
    } = attrs

    const _classes = new Set(classes)
    _classes.add('substrate-button')
    const arr = Array.from(_classes)

    const btnProps = ([
        arr.length ? `class="${arr.filter(Boolean).join(' ')}"` : '',
        disabled ? 'disabled' : '',
        autofocus ? 'autofocus' : '',
        type ? `type="${type}"` : '',
        name ? `name=${name}` : '',
        tabindex ? `tabindex="${tabindex}"` : 'tabindex="0"',
        'role="button"',
        ariaLabel ? `aria-label="${ariaLabel}"` : '',
        'aria-live="polite"'
    ]).filter(Boolean).join(' ')

    // rendering in node?
    return typeof window === 'undefined' ?
        `<substrate-button${disabled ? ' disabled' : ''}>
            <button ${btnProps}>${textContent}</button>
        </substrate-button>` :
        `<button ${btnProps}>
            ${textContent}
        </button>`
}
