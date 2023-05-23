import {Directive, Input} from '@angular/core';
import {BaseDragAndDrop} from './base-drag-and-drop';
import {MoveNode} from '../../mutations/dom/move-node';
import {getNodeIndex} from '../../utils/get-node-index';
import {getNodeId} from '../../utils/get-node-id';
import {ContextType} from '../context-box/builder-context';

@Directive({
    selector: '[previewDragAndDrop]',
})
export class PreviewDragAndDropDirective extends BaseDragAndDrop {
    @Input() contextType: ContextType;

    protected executeMutation() {
        const el = this.state.dragData.node;
        this.mutations.execute(
            new MoveNode(
                el,
                this.oldIndex,
                this.oldParent,
                this.newIndex,
                this.newParent
            )
        );
    }

    protected getHammerElement(): HTMLElement {
        return this.el.nativeElement;
    }

    protected setDragElement(e: HammerInput) {
        const context = this.state.getContext(this.contextType);
        this.state.dragData = {el: context.el, node: context.node};
    }

    protected sortColumns(nodeUnderCursor: HTMLElement, e: HammerInput) {
        if (!nodeUnderCursor.parentElement) return;

        const className = nodeUnderCursor.parentElement.className;

        if (
            nodeUnderCursor === this.state.dragData.node ||
            nodeUnderCursor.parentElement !==
                this.state.dragData.node.parentElement
        )
            return;

        // constrain column ordering withing row
        if (className?.match('row')) {
            const parentId = getNodeId(nodeUnderCursor.parentElement);
            this.mutations.execute(
                new MoveNode(
                    this.state.hover.node,
                    getNodeIndex(this.state.hover.node),
                    parentId,
                    getNodeIndex(nodeUnderCursor),
                    parentId
                )
            );
        }
    }
}
