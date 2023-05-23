import {SetStyle} from '../set-style';

export interface TypographyStyles {
    color?: string;
    backgroundColor?: string;
    fontSize?: string;
    textAlign?: string;
    fontStyle?: 'italic' | 'initial';
    fontFamily?: string;
    lineHeight?: string;
    fontWeight?: string;
    textDecorationLine?: string;
}

export class SetTextStyle extends SetStyle {
    static historyName = 'Changed Text Style';
    constructor(
        protected newProps: Partial<TypographyStyles> = {},
        el: HTMLElement
    ) {
        super(newProps, el);
    }
}
