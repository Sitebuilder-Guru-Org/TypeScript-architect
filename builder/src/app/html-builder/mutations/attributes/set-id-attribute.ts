import {BaseMutation} from '../base-mutation';

export class SetIdAttribute extends BaseMutation {
    static historyName = 'Change ID';
    changes: {new: string; old: string};
    constructor(protected el: HTMLElement, newId: string) {
        super(el);
        this.changes.new = newId;
    }

    protected onInit() {
        this.changes.old = this.el.id;
    }

    protected executeMutation(doc: Document): boolean {
        return this.setId(doc, this.changes.new);
    }

    protected undoMutation(doc: Document): boolean {
        return this.setId(doc, this.changes.old);
    }

    protected setId(doc: Document, newId: string) {
        const el = this.findEl(doc);
        if (el.id !== newId) {
            el.id = newId;
            return true;
        }
    }
}
