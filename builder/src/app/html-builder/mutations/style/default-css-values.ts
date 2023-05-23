import {CssStyle} from './css-style';

export type CssKey = keyof CssStyle;
export type CssValue = string;

export const DEFAULT_CSS_VALUES: Partial<Record<CssKey, CssValue>> = {
    backgroundRepeat: 'repeat',
    backgroundPosition: '0% 0%',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    backgroundAttachment: 'scroll',
    backgroundSize: 'auto',
    backgroundImage: 'none',
    color: null,

    // text styles
    fontStyle: 'normal',
    textAlign: 'start',
    textDecoration: 'none solid rgba(0, 0, 0, 0.87)',
    textDecorationLine: 'none',

    // shadow
    boxShadow: 'none',
    textShadow: 'none',

    // border
    borderColor: 'rgba(0, 0, 0, 0.87)',
    borderStyle: 'none',
    borderRadius: '0px',
    borderWidth: '0px',
};
