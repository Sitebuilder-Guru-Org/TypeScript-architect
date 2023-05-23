import {BaseMutation} from '../base-mutation';
import {insertNodeAtIndex} from '../../utils/insert-node-at-index';
import {nodeOrParentEditable} from '../../utils/node-or-parent-editable';

export class MoveNode extends BaseMutation {
    changes: {
        new: {index: number; parentId: string};
        old: {index: number; parentId: string};
    };
    constructor(
        protected el: HTMLElement, // node being moved
        oldIndex: number,
        oldParentId: string,
        newIndex: number,
        newParentId: string
    ) {
        super(el);
        this.changes.new = {index: newIndex, parentId: newParentId};
        this.changes.old = {index: oldIndex, parentId: oldParentId};
    }

    static canMoveNodeInto(el: HTMLElement) {
        return el && !nodeOrParentEditable(el) && el.nodeName !== 'HTML';
    }

    protected executeMutation(doc: Document): boolean {
        const parentEl = this.findEl(doc, this.changes.new.parentId);
        const el = this.findEl(doc);
        if (!MoveNode.canMoveNodeInto(parentEl)) {
            return false;
        }
        insertNodeAtIndex(el, parentEl, this.changes.new.index, false);
        return true;
    }

    protected undoMutation(doc: Document): boolean {
        const parentEl = this.findEl(doc, this.changes.old.parentId);
        const el = this.findEl(doc);
        if (!MoveNode.canMoveNodeInto(parentEl)) {
            return false;
        }
        insertNodeAtIndex(el, parentEl, this.changes.old.index, false);
        return true;
    }
}
