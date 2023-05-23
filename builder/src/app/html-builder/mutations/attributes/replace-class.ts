import {BaseMutation} from '../base-mutation';

export class ReplaceClass extends BaseMutation {
    static historyName = 'Replaced class';
    changes: {new: string; old: string};
    constructor(
        protected el: HTMLElement,
        newClassName: string,
        oldClassName: string
    ) {
        super(el);
        this.changes.new = newClassName;
        this.changes.old = oldClassName;
    }

    protected onInit() {
        //
    }

    protected executeMutation(doc: Document): boolean {
        return this.replaceClass(doc, this.changes.new, this.changes.old);
    }

    protected undoMutation(doc: Document): boolean {
        return this.replaceClass(doc, this.changes.old, this.changes.new);
    }

    protected replaceClass(doc: Document, newClass: string, oldClass: string) {
        const el = this.findEl(doc);
        if (!el.classList.contains(newClass)) {
            el.classList.remove(oldClass);
            el.classList.add(newClass);
            return true;
        }
    }
}
