import {AfterContentInit, Directive, ElementRef, NgZone} from '@angular/core';
import {LivePreview} from '../../live-preview.service';
import {Elements} from '../../elements/elements.service';
import {LivePreviewScroller} from './live-preview-scroller';
import {MutationsService} from '../../mutations/mutations.service';
import {getNodeIndex} from '../../utils/get-node-index';
import {getNodeId} from '../../utils/get-node-id';
import {ActiveProject} from '../../projects/active-project';
import {ContextBoxes} from '../context-box/context-boxes.service';
import {BuilderStateService} from '../../builder-state.service';
import {coordsAboveNode} from '../../utils/coords-above-node';

export const DRAG_EL_CLASS = 'ar-drag-el';
export const BUILDER_DRAG_HANDLE_CLASS = 'builder-drag-handle';

@Directive()
export abstract class BaseDragAndDrop implements AfterContentInit {
    protected previewOffset: number;
    protected draggingCol = false;

    protected oldIndex: number;
    protected oldParent: string;
    protected newIndex: number;
    protected newParent: string;

    constructor(
        protected livePreview: LivePreview,
        protected mutations: MutationsService,
        protected elements: Elements,
        protected zone: NgZone,
        protected directiveHost: ElementRef<HTMLElement>,
        protected activeProject: ActiveProject,
        protected contextBoxes: ContextBoxes,
        protected scroller: LivePreviewScroller,
        protected state: BuilderStateService,
        protected el: ElementRef<HTMLElement>
    ) {}

    ngAfterContentInit() {
        this.zone.runOutsideAngular(() => {
            this.initHammer();
        });
    }

    protected sortColumns?(node: HTMLElement, e: HammerInput);
    protected abstract setDragElement(e: HammerInput);
    protected abstract executeMutation();
    protected abstract getHammerElement(): HTMLElement;

    protected initHammer() {
        const hammer = new Hammer.Manager(this.getHammerElement());
        const pan = new Hammer.Pan({
            direction: Hammer.DIRECTION_ALL,
            threshold: 0,
        });
        hammer.add([pan]);
        hammer.on('panstart', e => this.onDragStart(e));
        hammer.on('panmove', e => this.onDrag(e));
        hammer.on('panend', e => this.onDragEnd(e));
    }

    protected onDragStart(e: HammerInput) {
        if (
            !this.state.previewDoc.body ||
            !e.target.closest('.' + BUILDER_DRAG_HANDLE_CLASS)
        ) {
            return;
        }

        this.previewOffset =
            this.state.previewContainer.getBoundingClientRect().x;

        this.contextBoxes.hideBoxes();
        this.setDragElement(e);
        this.draggingCol = this.state.dragData.el.name === 'column';

        this.oldIndex = getNodeIndex(this.state.dragData.node);
        this.oldParent = getNodeId(this.state.dragData.node?.parentElement);

        this.zone.run(() => this.state.dragging$.next(true));

        if (!this.draggingCol) {
            this.state.dragData.node.classList.add(DRAG_EL_CLASS);
        }
    }

    protected onDrag(e: HammerInput) {
        if (!this.state.dragging$.value) return;
        const x = e.center.x;
        const y = e.center.y;

        this.state.dragHelper.reposition(y, x);

        // if we're not dragging over live preview yet, bail
        if (x <= this.previewOffset) return;

        const under = this.state.previewDoc.elementFromPoint(
            x - this.previewOffset,
            y
        ) as HTMLElement;

        this.scroller.scroll(y);

        if (this.draggingCol) {
            return this?.sortColumns(under, e);
        } else {
            return this.repositionDropHelper(under, x - this.previewOffset, y);
        }
    }

    protected onDragEnd(e: HammerInput) {
        if (!this.state.dragging$.value) return;
        this.zone.run(() => this.state.dragging$.next(false));

        // make sure node was actually dragged into builder from inspector
        const shouldMutate: boolean =
            this.newIndex > -1 &&
            this.newIndex !== this.oldIndex &&
            !!this.newParent;

        if (this.state.dragData && !this.draggingCol) {
            this.state.dragData.node.classList.remove(DRAG_EL_CLASS);
            if (shouldMutate) {
                this.executeMutation();
            }
        }

        this.zone.run(() => {
            this.livePreview.setSelectedContext(
                getNodeId(this.state.dragData.node)
            );
        });
    }

    protected repositionDropHelper(node: HTMLElement, x: number, y: number) {
        if (!node) return;

        // If cursor is above any of the specified node's children
        // and we can insert element as specified node's child,
        // insert element before child that cursor is currently above
        for (let i = 0, len = node.children.length; i < len; i++) {
            const child = node.children[i] as HTMLElement;
            if (
                coordsAboveNode(child, x, y) &&
                this.elements.canInsert(node, this.state.dragData.el)
            ) {
                this.newParent = getNodeId(node);
                this.moveDropHelper(child, 'above');
                return;
            }
        }

        const rect = node.getBoundingClientRect();
        const relativeY = y - rect.top;
        // if y is within element - 5px at top and bottom
        const cursorInCenter = relativeY > 5 && relativeY < rect.height - 5;

        // insert into the node, if it's empty
        if (
            node.childElementCount === 0 &&
            cursorInCenter &&
            this.elements.canInsert(node, this.state.dragData.el)
        ) {
            this.newParent = getNodeId(node);
            this.moveDropHelper(node, 'inside');
            return;
        }

        // insert above or below the node
        if (
            this.elements.canInsert(node.parentElement, this.state.dragData.el)
        ) {
            this.newParent = getNodeId(node.parentElement);
            const cursorInTopHalfOfNode = relativeY < rect.height / 2;
            if (cursorInTopHalfOfNode) {
                this.moveDropHelper(node, 'above');
            } else {
                this.moveDropHelper(node, 'below');
            }
        }
    }

    protected moveDropHelper(
        node: HTMLElement,
        position: 'below' | 'above' | 'inside'
    ) {
        const box = node.getBoundingClientRect();
        const helper = this.state.dropHelper;
        const parent = node.parentElement;
        helper.style.left = box.left + 'px';
        helper.style.width = box.width + 'px';

        if (position === 'inside') {
            helper.style.top = box.top + box.height / 2 + 'px';
            helper.classList.add('arrow-top');
            helper.classList.add('arrow-bottom');
            this.newIndex = 0;
        } else if (position === 'above') {
            helper.style.top = box.top + 'px';
            helper.classList.add('arrow-top');
            helper.classList.remove('arrow-bottom');
            this.newIndex = getNodeIndex(node);
        } else {
            helper.style.top = box.top + box.height + 'px';
            helper.classList.add('arrow-bottom');
            helper.classList.remove('arrow-top');
            this.newIndex = getNodeIndex(node) + 1;
        }

        // check if we're not trying to drop a node inside its child or itself
        const dragNode = this.state.dragData.node;
        if (
            dragNode === node ||
            dragNode === parent ||
            dragNode.contains(parent)
        ) {
            this.newIndex = null;
            this.newParent = null;
        }
    }
}
