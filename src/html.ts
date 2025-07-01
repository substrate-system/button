export type Attrs = {
    type:string|null;
    autofocus:boolean;
    tabindex:string|number;
    disabled:boolean;
    classes:string[]|Set<string>;
}
export function html (attrs:Partial<Attrs>, textContent:string) {
    const {
        type,
        autofocus,
        tabindex,
        disabled,
        classes
    } = attrs

    const _classes = new Set(classes)
    _classes.add('substrate-button')
    const arr = Array.from(_classes)

    const btnProps = ([
        arr.length ? `class="${arr.filter(Boolean).join(' ')}"` : '',
        disabled ? 'disabled' : '',
        autofocus ? 'autofocus' : '',
        type ? `type="${type}"` : '',
        tabindex ? `tabindex="${tabindex}"` : 'tabindex="0"',
        'role="button"'
    ]).filter(Boolean).join(' ')

    return `<button ${btnProps}>
        ${textContent}
    </button>`
}
