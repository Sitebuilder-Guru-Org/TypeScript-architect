import {ElementRef, Injectable} from '@angular/core';
import {ConnectedPosition} from '@angular/cdk/overlay';
import {LinkEditorComponent} from './link-editor.component';
import {OverlayPanel} from '@common/core/ui/overlay-panel/overlay-panel.service';
import {OverlayPanelRef} from '@common/core/ui/overlay-panel/overlay-panel-ref';
import {BreakpointsService} from '@common/core/ui/breakpoints.service';
import {BuilderStateService} from '../../builder-state.service';

@Injectable({
    providedIn: 'root',
})
export class LinkEditor {
    public overlayRef: OverlayPanelRef<LinkEditorComponent>;

    constructor(
        private overlayPanel: OverlayPanel,
        private breakpoints: BreakpointsService,
        private state: BuilderStateService
    ) {}

    open(
        origin: HTMLElement,
        link?: HTMLLinkElement
    ): OverlayPanelRef<LinkEditorComponent> {
        // on mobile sidebar is overlaid, so no offset is needed
        const offsetX =
            origin.ownerDocument !== this.state.previewDoc ||
            this.breakpoints.isMobile$.value
                ? 0
                : 380;
        const position = [
            {
                originX: 'center',
                originY: 'bottom',
                overlayX: 'center',
                overlayY: 'top',
                offsetY: 25,
                offsetX,
            }, // bottom
            {
                originX: 'end',
                originY: 'bottom',
                overlayX: 'end',
                overlayY: 'top',
                offsetY: 25,
                offsetX,
            }, // bottom
            {
                originX: 'start',
                originY: 'bottom',
                overlayX: 'start',
                overlayY: 'top',
                offsetY: 25,
                offsetX,
            }, // bottom
            {
                originX: 'center',
                originY: 'top',
                overlayX: 'center',
                overlayY: 'bottom',
                offsetY: -25,
                offsetX,
            }, // top
        ] as ConnectedPosition[];

        return (this.overlayRef = this.overlayPanel.open(LinkEditorComponent, {
            position,
            panelClass: 'be-modal',
            data: {link},
            origin: new ElementRef(origin),
        }));
    }

    close() {
        this.overlayRef?.close();
    }
}
