import {Injectable} from '@angular/core';
import {Elements} from './elements/elements.service';
import {ContextBoxes} from './live-preview/context-box/context-boxes.service';
import {MutationsService} from './mutations/mutations.service';
import {DeleteNode} from './mutations/dom/delete-node';
import {CloneNode} from './mutations/dom/clone-node';
import {getNodeId} from './utils/get-node-id';
import {InsertNode} from './mutations/dom/insert-node';
import {getNodeIndex} from './utils/get-node-index';
import {MoveNode} from './mutations/dom/move-node';
import {BuilderStateService} from './builder-state.service';
import {ContextType} from './live-preview/context-box/builder-context';

@Injectable({
    providedIn: 'root',
})
export class BuilderDocumentActions {
    copiedNode: HTMLElement;

    constructor(
        private state: BuilderStateService,
        private elements: Elements,
        private contextBoxes: ContextBoxes,
        private mutations: MutationsService
    ) {}

    cloneNode(node: HTMLElement): string {
        const mutation = new CloneNode(node);
        this.mutations.execute(mutation);
        return mutation.getCloneId();
    }

    removeNode(node: HTMLElement) {
        if (this.mutations.execute(new DeleteNode(node))) {
            if (this.state.selected?.node === node) {
                this.state.selected$.next(null);
            }
            this.contextBoxes.hideBoxes();
        }
    }

    copyNode(node: HTMLElement) {
        if (node && node.nodeName !== 'BODY') {
            this.copiedNode = node.cloneNode(true) as HTMLElement;
        }
    }

    pasteNode(ref: HTMLElement) {
        if (ref && this.copiedNode) {
            let parent: string;
            let index: number;
            // make sure we don't paste refs after body
            if (ref.nodeName === 'BODY') {
                parent = getNodeId(ref);
                index = 0;
            } else {
                parent = getNodeId(ref.parentElement);
                index = getNodeIndex(ref) + 1;
            }
            this.mutations.execute(
                new InsertNode(this.copiedNode, index, parent)
            );
            this.copiedNode = null;
            this.contextBoxes.hideBox(ContextType.Selected);
        }
    }

    cutNode(node: HTMLElement) {
        if (node && node.nodeName !== 'BODY') {
            this.copyNode(node);
            this.removeNode(node);
        }
    }

    moveSelected(dir: 'up' | 'down') {
        if (!this.state.selected.node) return;

        const oldIndex = getNodeIndex(this.state.selected.node);
        const oldParentId = getNodeId(this.state.selected.node.parentElement);
        let newIndex: number;
        let newParentId: string;

        if (dir === 'down') {
            const next = this.state.selected.node
                .nextElementSibling as HTMLElement;
            if (next) {
                if (this.elements.canInsert(next, this.state.selected.el)) {
                    // into next node
                    newIndex = 0;
                    newParentId = getNodeId(next);
                } else {
                    // after next node
                    newIndex = getNodeIndex(next);
                    newParentId = getNodeId(next.parentElement);
                }
            } else {
                const parentParent = this.state.selected.node.parentElement
                    .parentElement as HTMLElement;
                if (
                    this.elements.canInsert(
                        parentParent,
                        this.state.selected.el
                    )
                ) {
                    // after parent
                    newIndex =
                        getNodeIndex(this.state.selected.node.parentElement) +
                        1;
                    newParentId = getNodeId(parentParent);
                }
            }
        } else if (dir === 'up') {
            const prev = this.state.selected.node
                .previousElementSibling as HTMLElement;
            if (prev) {
                // into previous
                if (this.elements.canInsert(prev, this.state.selected.el)) {
                    newIndex = prev.childElementCount;
                    newParentId = getNodeId(prev);
                } else {
                    // before previous
                    newIndex = getNodeIndex(prev);
                    newParentId = getNodeId(prev.parentElement);
                }
            } else {
                const parentParent =
                    this.state.selected.node.parentElement.parentElement;
                if (
                    this.elements.canInsert(
                        parentParent,
                        this.state.selected.el
                    )
                ) {
                    // before parent
                    newIndex = getNodeIndex(
                        this.state.selected.node.parentElement
                    );
                    newParentId = getNodeId(parentParent);
                }
            }
        }

        if (newParentId) {
            this.mutations.execute(
                new MoveNode(
                    this.state.selected.node,
                    oldIndex,
                    oldParentId,
                    newIndex,
                    newParentId
                )
            );
        }
    }
}
