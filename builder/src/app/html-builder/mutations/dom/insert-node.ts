import {BaseMutation} from '../base-mutation';
import {getNodeId} from '../../utils/get-node-id';
import {insertNodeAtIndex} from '../../utils/insert-node-at-index';
import {nodeOrParentEditable} from '../../utils/node-or-parent-editable';
import {addIdToNode} from '../../utils/add-id-to-node';

export class InsertNode extends BaseMutation {
    constructor(
        protected el: HTMLElement,
        protected newIndex: number,
        protected newParent: string
    ) {
        super(el);
    }

    static canInsertInto(el: HTMLElement) {
        return el && !nodeOrParentEditable(el) && el.nodeName !== 'HTML';
    }

    getNodeId(): string {
        return this.nodeId;
    }

    protected onInit() {
        if (!this.nodeId) {
            addIdToNode(this.el, true);
        }
        this.nodeId = getNodeId(this.el);
    }

    protected executeMutation(doc: Document): boolean {
        const parentEl = this.findEl(doc, this.newParent);
        if (!InsertNode.canInsertInto(parentEl)) {
            return false;
        }
        insertNodeAtIndex(this.el, parentEl, this.newIndex, true);
        return true;
    }

    protected undoMutation(doc: Document): boolean {
        const insertedEl = this.findEl(doc);
        if (insertedEl) {
            insertedEl.remove();
            return true;
        }
    }
}
