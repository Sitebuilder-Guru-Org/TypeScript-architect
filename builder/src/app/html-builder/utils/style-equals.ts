import {CssKey, CssValue} from '../mutations/style/default-css-values';

export function styleEquals(node: HTMLElement, key: CssKey, value: CssValue) {
    return window.getComputedStyle(node)[key] === value;
}
