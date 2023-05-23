import {BaseMutation} from '../base-mutation';
import {getNodeId} from '../../utils/get-node-id';
import {nodeOrParentEditable} from '../../utils/node-or-parent-editable';
import {getNodeIndex} from '../../utils/get-node-index';

export class DeleteNode extends BaseMutation {
    protected parentId: string;
    protected nodeIndex: number;
    protected deletedEl: HTMLElement;

    constructor(protected el: HTMLElement) {
        super(el);
    }

    static canDelete(el: HTMLElement) {
        return (
            el &&
            !nodeOrParentEditable(el) &&
            !(el.nodeName === 'BODY' || el.nodeName === 'HTML')
        );
    }

    protected onInit() {
        const el = this.findEl(this.pageDoc);
        if (el) {
            this.deletedEl = el.cloneNode(true) as HTMLElement;
            this.parentId = getNodeId(el.parentElement);
            this.nodeIndex = getNodeIndex(el);
        }
    }

    protected executeMutation(doc: Document): boolean {
        const el = this.findEl(doc);
        if (!DeleteNode.canDelete(el)) {
            return false;
        }
        el.remove();
        return true;
    }

    protected undoMutation(doc: Document): boolean {
        const parentEl = this.findEl(doc, this.parentId);
        if (parentEl) {
            const i = this.nodeIndex > 0 ? this.nodeIndex - 1 : 0;
            // clone node again so we are not inserting the same one into both documents
            parentEl.children.item(i).after(this.deletedEl.cloneNode(true));
            return true;
        }
    }
}
