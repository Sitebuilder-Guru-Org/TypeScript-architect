import {ElementRef, Injectable} from '@angular/core';
import {ComponentType} from '@angular/cdk/portal';
import {OverlayPanel} from '@common/core/ui/overlay-panel/overlay-panel.service';
import {OverlayPanelRef} from '@common/core/ui/overlay-panel/overlay-panel-ref';
import {BuilderStateService} from '../builder-state.service';

@Injectable({
    providedIn: 'root',
})
export class BuilderOverlayService {
    overlayRef: OverlayPanelRef<any>;

    constructor(
        private overlayPanel: OverlayPanel,
        private state: BuilderStateService,
    ) {}

    open<T>(
        component: ComponentType<T>,
        data?: object,
        originNode?: HTMLElement
    ): OverlayPanelRef<T> {
        this.close();

        const origin = originNode
            ? new ElementRef(originNode)
            : new ElementRef(this.state.inspectorEl);

        const positionStrategy = this.overlayPanel.overlay
            .position()
            .flexibleConnectedTo(origin)
            .withPositions([
                {
                    originX: 'end',
                    originY: 'center',
                    overlayX: 'start',
                    overlayY: 'center',
                    offsetX: 5,
                },
                {
                    originX: 'start',
                    originY: 'center',
                    overlayX: 'end',
                    overlayY: 'center',
                    offsetX: 5,
                },
            ]);

        this.overlayRef = this.overlayPanel.open(component, {
            origin,
            positionStrategy,
            hasBackdrop: true,
            data,
        });

        return this.overlayRef;
    }

    close() {
        if (!this.overlayRef) return;
        this.overlayRef.close();
    }
}
