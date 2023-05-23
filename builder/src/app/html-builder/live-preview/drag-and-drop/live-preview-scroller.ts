import {Injectable} from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';
import {BuilderStateService} from '../../builder-state.service';
import {skip} from 'rxjs/operators';
import {getScrollTop} from '../../utils/get-scroll-top';

@Injectable({
    providedIn: 'root',
})
export class LivePreviewScroller {
    private scrollDownTimeout;
    private scrollUpTimeout;
    private previewHeight: number;
    private wheelSub: Subscription;

    constructor(private state: BuilderStateService) {
        this.state.dragging$.pipe(skip(1)).subscribe(isDragging => {
            if (isDragging) {
                this.bindMouseWheel();
            } else {
                this.unbindMouseWheel();
                this.stopScrolling();
            }
        });
    }

    scroll(y: number) {
        const scrollTop = getScrollTop(this.state.previewDoc);
        const pointY = y + scrollTop;

        if (!this.previewHeight) {
            this.previewHeight = this.state.previewContainer.offsetHeight;
        }

        if (pointY - scrollTop <= 80) {
            this.scrollFrameUp();
        } else if (pointY > scrollTop + this.previewHeight - 80) {
            this.scrollFrameDown();
        } else {
            this.stopScrolling();
        }
    }

    stopScrolling() {
        clearInterval(this.scrollDownTimeout);
        return clearInterval(this.scrollUpTimeout);
    }

    bindMouseWheel() {
        if (this.wheelSub) return;
        this.wheelSub = fromEvent(window, 'wheel').subscribe(
            (e: WheelEvent) => {
                this.state.previewDoc.documentElement.scrollTop += e.deltaY;
            }
        );
    }

    unbindMouseWheel() {
        this.wheelSub?.unsubscribe();
        this.wheelSub = null;
    }

    private scrollFrameDown() {
        clearInterval(this.scrollDownTimeout);
        return (this.scrollDownTimeout = setInterval(() => {
            return this.setScrollTop(getScrollTop(this.state.previewDoc) + 40);
        }, 40));
    }

    private scrollFrameUp() {
        clearInterval(this.scrollUpTimeout);
        return (this.scrollUpTimeout = setInterval(() => {
            return this.setScrollTop(getScrollTop(this.state.previewDoc) - 40);
        }, 40));
    }

    private setScrollTop(newScrollTop: number) {
        newScrollTop = Math.max(0, newScrollTop);
        this.state.previewDoc.body.scrollTop = newScrollTop;
    }
}
