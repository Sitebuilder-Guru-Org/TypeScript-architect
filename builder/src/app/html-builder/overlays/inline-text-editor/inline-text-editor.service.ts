import {ElementRef, Injectable} from '@angular/core';
import {InlineTextEditorComponent} from './inline-text-editor.component';
import {OverlayPanel} from '@common/core/ui/overlay-panel/overlay-panel.service';
import {OverlayPanelRef} from '@common/core/ui/overlay-panel/overlay-panel-ref';
import {BuilderStateService} from '../../builder-state.service';

@Injectable({
    providedIn: 'root',
})
export class InlineTextEditor {
    public overlayRef: OverlayPanelRef<InlineTextEditorComponent>;

    constructor(
        private overlayPanel: OverlayPanel,
        private state: BuilderStateService
    ) {}

    open(node: HTMLElement) {
        if (this.state.editableNode === node) {
            return;
        }
        this.state.editableNode = node;
        this.close();
        this.overlayRef = this.overlayPanel.open(InlineTextEditorComponent, {
            origin: new ElementRef(node),
            hasBackdrop: false,
            position: [
                {
                    originX: 'center',
                    originY: 'top',
                    overlayX: 'center',
                    overlayY: 'bottom',
                    offsetX: 380,
                    offsetY: -10,
                },
                {
                    originX: 'center',
                    originY: 'bottom',
                    overlayX: 'center',
                    overlayY: 'top',
                    offsetX: 380,
                    offsetY: 10,
                },
            ],
        });

        node.setAttribute('contenteditable', 'true');
        node.focus();
    }

    close() {
        this.overlayRef?.close();
        this.overlayRef = null;
    }
}
