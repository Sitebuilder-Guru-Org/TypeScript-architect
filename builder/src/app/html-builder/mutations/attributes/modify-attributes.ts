import {BaseMutation} from '../base-mutation';

export type NodeAttributes = Record<string, string>;

export class ModifyAttributes extends BaseMutation {
    static historyName = 'Changed Attributes';
    changes: {new: NodeAttributes; old: NodeAttributes};
    constructor(protected el: HTMLElement, newProps: NodeAttributes) {
        super(el);
        this.changes.new = newProps;
    }

    protected onInit() {
        const el = this.findEl(this.pageDoc);
        this.changes.old = {};
        Object.keys(this.changes.new).forEach(prop => {
            this.changes.old[prop] = el.getAttribute(prop);
        });
    }

    protected executeMutation(doc: Document): boolean {
        return this.setLinkAttributes(doc, this.changes.new);
    }

    protected undoMutation(doc: Document): boolean {
        return this.setLinkAttributes(doc, this.changes.old);
    }

    protected setLinkAttributes(doc: Document, props: NodeAttributes) {
        const el = this.findEl(doc);
        return Object.entries(props)
            .map(([prop, value]) => {
                if (value !== el.getAttribute(prop)) {
                    el.setAttribute(prop, value);
                    return true;
                }
            })
            .some(changed => changed);
    }
}
