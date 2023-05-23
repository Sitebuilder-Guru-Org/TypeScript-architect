import {
    AfterViewInit,
    Directive,
    ElementRef,
    Input,
    NgZone,
} from '@angular/core';
import {BuilderStateService} from '../../builder-state.service';
import {ImageEl} from '../../elements/definitions/bootstrap';
import {LivePreview} from '../../live-preview.service';
import {MutationsService} from '../../mutations/mutations.service';
import {ResizeNode} from '../../mutations/style/resize-node';
import {ContextType} from '../context-box/builder-context';
import {take} from 'rxjs/operators';

@Directive({
    selector: '[elementResizer]',
})
export class ElementResizerDirective implements AfterViewInit {
    @Input() contextType: ContextType;
    private node: HTMLElement;
    private aspectRatio: number;
    private previewWidth: number;
    private previewHeight: number;
    private previewOffset: number;

    constructor(
        private zone: NgZone,
        private el: ElementRef<HTMLElement>,
        private state: BuilderStateService,
        private livePreview: LivePreview,
        private mutations: MutationsService
    ) {}

    ngAfterViewInit(): void {
        // account for scrollbar
        this.state.previewDocReloaded$.pipe(take(1)).subscribe(() => {
            const iframeBody = this.state.iframe.contentDocument.body;
            this.previewWidth = iframeBody.clientWidth - 20;
            this.previewHeight = iframeBody.scrollHeight - 20;

            this.zone.runOutsideAngular(() => {
                const hammer = new Hammer.Manager(this.el.nativeElement);
                const pan = new Hammer.Pan({
                    direction: Hammer.DIRECTION_ALL,
                    threshold: 0,
                });
                hammer.add([pan]);

                hammer.on('panstart', e => this.onDragStart(e));
                hammer.on('panmove', e => this.onDrag(e));
                hammer.on('panend', e => this.onDragEnd(e));
            });
        });
    }

    private onDragStart(e: HammerInput) {
        this.previewOffset =
            this.state.previewContainer.getBoundingClientRect().x;
        this.node = this.state.getContext(this.contextType).node;
        const rect = this.node.getBoundingClientRect();
        this.aspectRatio = rect.width / rect.height;
        this.zone.run(() => this.state.resizing$.next(true));
    }

    private onDrag(e: HammerInput) {
        const rect = this.node.getBoundingClientRect();
        const clientX = e.center.x - this.previewOffset;
        const minWidth = 10;
        const minHeight = 10;

        // trying to scroll (and resize) element beyond preview width or height
        if (this.previewWidth <= clientX || this.previewHeight <= e.center.y) {
            return;
        }

        // calc new width
        const newWidth = clientX - rect.left;
        let finalWidth = newWidth < minWidth ? minWidth : newWidth;

        // calc new height
        const newHeight = e.center.y - rect.top;
        let finalHeight = newHeight < minHeight ? minHeight : newHeight;

        // adjust aspect ratio
        if (this.state.getContext(this.contextType).el instanceof ImageEl) {
            ({finalWidth, finalHeight} = this.resizeAndPreserveAspectRatio(
                finalWidth,
                finalHeight
            ));
        }

        // if image was scaled lower then min width or min height, bail
        if (finalWidth < minWidth || finalHeight < minHeight) {
            return;
        }

        this.mutations.execute(
            new ResizeNode(
                {
                    width: `${finalWidth}px`,
                    height: `${finalHeight}px`,
                },
                this.node
            )
        );
        this.livePreview.repositionBox(this.contextType);
    }

    private onDragEnd(e: HammerInput) {
        this.zone.run(() => this.state.resizing$.next(false));
    }

    private resizeAndPreserveAspectRatio(oldWidth: number, oldHeight: number) {
        let newWidth = oldWidth;
        let newHeight = oldHeight;

        if (oldHeight * this.aspectRatio > oldWidth) {
            newHeight = oldWidth / this.aspectRatio;
        } else {
            newWidth = oldHeight * this.aspectRatio;
        }

        return {finalWidth: newWidth, finalHeight: newHeight};
    }
}
