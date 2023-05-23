import {BaseMutation} from '../base-mutation';
import {CssKey, CssValue, DEFAULT_CSS_VALUES} from './default-css-values';
import {CssStyle} from './css-style';
import {styleEquals} from '../../utils/style-equals';

export abstract class SetStyle extends BaseMutation {
    changes: {new: CssStyle; old: CssStyle};
    constructor(newProps: CssStyle = {}, protected el: HTMLElement) {
        super(el);
        this.changes.new = newProps;
    }

    protected onInit() {
        const el = this.findEl(this.pageDoc);
        this.changes.old = {};
        Object.keys(this.changes.new).forEach(prop => {
            this.changes.old[prop] = el.style[prop];
        });
    }

    protected executeMutation(doc: Document) {
        return this.setStyleProps(doc, this.changes.new);
    }

    protected undoMutation(doc: Document) {
        return this.setStyleProps(doc, this.changes.old);
    }

    protected setStyleProps(doc: Document, props: CssStyle) {
        const el = this.findEl(doc);
        if (el) {
            return Object.keys(props)
                .map(prop => {
                    const value = props[prop];
                    if (this.isTheSameValue(el, prop as CssKey, value)) {
                        return false;
                    }
                    el.style[prop] = this.isDefaultValue(prop as CssKey, value)
                        ? null
                        : value;
                    return true;
                })
                .some(changed => changed);
        }
    }

    private isDefaultValue(prop: CssKey, value: CssValue): boolean {
        return DEFAULT_CSS_VALUES[prop] === value;
    }

    private isTheSameValue(el: HTMLElement, prop: CssKey, value: CssValue) {
        return styleEquals(el, prop, value);
    }
}
