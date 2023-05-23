import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {BuilderStateService} from '../../../builder-state.service';
import {skip} from 'rxjs/operators';

@Component({
    selector: 'drag-visual-helper',
    templateUrl: './drag-visual-helper.component.html',
    styleUrls: ['./drag-visual-helper.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DragVisualHelperComponent implements OnInit {
    @HostBinding('class.hidden') hidden = true;

    constructor(
        public el: ElementRef,
        public state: BuilderStateService,
        private cd: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.state.dragging$.pipe(skip(1)).subscribe(isDragging => {
            this.hidden = !isDragging;
            this.cd.markForCheck();
        });
    }

    reposition(y: number, x: number) {
        // offset drag helper a bit, so it's in top right corner of cursor
        this.el.nativeElement.style.top = y - 20 + 'px';
        this.el.nativeElement.style.left = x + 21 + 'px';
    }
}
