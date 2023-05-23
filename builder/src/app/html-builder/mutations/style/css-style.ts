export type CssStyle = Partial<
    Omit<
        CSSStyleDeclaration,
        | 'getPropertyPriority'
        | 'getPropertyValue'
        | 'item'
        | 'removeProperty'
        | 'setProperty'
        | 'length'
        | 'parentRule'
    >
>;
