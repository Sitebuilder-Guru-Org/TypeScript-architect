import {ElementRef, Injectable} from '@angular/core';
import {nodeOrParentEditable} from '../../utils/node-or-parent-editable';
import {ContextType} from './builder-context';

@Injectable({
    providedIn: 'root',
})
export class ContextBoxes {
    private previewRect: ClientRect;
    hoverBox: HTMLElement;
    selectedBox: HTMLElement;

    repositionBox(name: ContextType, node: HTMLElement) {
        if (
            !node ||
            node.nodeType !== Node.ELEMENT_NODE ||
            this.nodeIsHtmlOrBody(node) ||
            nodeOrParentEditable(node)
        ) {
            return this.hideBox(name);
        }

        const rect = node.getBoundingClientRect();

        if (!rect.width || !rect.height) {
            this.hideBox(name);
        } else {
            this.getBox(name).style.top = rect.top + 'px';
            this.getBox(name).style.left = rect.left + 'px';
            this.getBox(name).style.height = rect.height + 'px';
            this.getBox(name).style.width = rect.width + 'px';
            this.showBox(name);
        }

        // active compact mode if node is not wide enough to fit all buttons
        if (rect.width < 85) {
            this.getBox(name).classList.add('compact-mode');
        } else {
            this.getBox(name).classList.remove('compact-mode');
        }

        // place context box toolbar on the bottom, if there's not enough space top
        if (parseInt(this.getBox(name).style.top) < 20) {
            this.getBox(name).classList.add('toolbar-bottom');
        } else {
            this.getBox(name).classList.remove('toolbar-bottom');
        }
    }

    hideBox(name: ContextType) {
        const box = this.getBox(name);
        box?.classList.add('hidden');
    }

    hideBoxes() {
        this.hideBox(ContextType.Selected);
        this.hideBox(ContextType.Hover);
    }

    showBox(name: ContextType) {
        this.getBox(name).classList.remove('hidden');
    }

    public set(hover: HTMLElement, selected: HTMLElement, iframe: ElementRef) {
        this.hoverBox = hover;
        this.selectedBox = selected;
        this.previewRect = iframe.nativeElement.getBoundingClientRect();
    }

    public getBox(name: ContextType): HTMLElement {
        return name === ContextType.Hover ? this.hoverBox : this.selectedBox;
    }

    private nodeIsHtmlOrBody(node: HTMLElement) {
        if (!node) return false;
        return node.nodeName === 'BODY' || node.nodeName === 'HTML';
    }
}
