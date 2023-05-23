import {BaseMutation} from '../base-mutation';
import {randomString} from '@common/core/utils/random-string';
import {nodeOrParentEditable} from '../../utils/node-or-parent-editable';

export class CloneNode extends BaseMutation {
    protected cloneId: string;

    constructor(protected el: HTMLElement) {
        super(el);
        this.cloneId = randomString(10);
    }

    static canClone(el: HTMLElement) {
        return (
            !nodeOrParentEditable(el) &&
            !(el.nodeName === 'BODY' || el.nodeName === 'HTML')
        );
    }

    getCloneId(): string {
        return this.cloneId;
    }

    protected executeMutation(doc: Document): boolean {
        const el = this.findEl(doc);
        if (!CloneNode.canClone(el)) {
            return false;
        }
        const clone = el.cloneNode(true) as HTMLElement;
        clone.dataset.arId = this.cloneId;
        el.after(clone);
        return true;
    }

    protected undoMutation(doc: Document): boolean {
        const cloneEl = this.findEl(doc, this.cloneId);
        if (cloneEl) {
            cloneEl.remove();
            return true;
        }
    }
}
