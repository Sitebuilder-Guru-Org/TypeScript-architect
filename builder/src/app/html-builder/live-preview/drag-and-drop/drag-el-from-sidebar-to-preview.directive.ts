import {ContentChildren, Directive, ElementRef, QueryList} from '@angular/core';
import {BaseDragAndDrop} from './base-drag-and-drop';
import {nodeFromString} from '../../utils/fragment-from-string';
import {InsertNode} from '../../mutations/dom/insert-node';
import {reloadAsset} from '../../utils/reload-asset';

@Directive({
    selector: '[dragElFromSidebarToPreview]',
})
export class DragElFromSidebarToPreviewDirective extends BaseDragAndDrop {
    @ContentChildren('dragElement') dragElements: QueryList<ElementRef>;

    protected setDragElement(e: HammerInput) {
        const name = (e.target.closest('.element') as HTMLElement).dataset.name;
        const element = this.elements.elements.find(el => el.name === name);
        const node = nodeFromString(element.html);
        this.state.dragData = {node, el: element};
    }

    protected getHammerElement() {
        return this.el.nativeElement;
    }

    protected executeMutation() {
        this.mutations.execute(
            new InsertNode(
                this.state.dragData.node,
                this.newIndex,
                this.newParent
            )
        );

        if (this.state.dragData.el.css) {
            this.activeProject
                .save(false, {custom_element_css: this.state.dragData.el.css})
                .then(() => {
                    reloadAsset('#custom-elements-css', this.state.previewDoc);
                });
        }
    }
}
