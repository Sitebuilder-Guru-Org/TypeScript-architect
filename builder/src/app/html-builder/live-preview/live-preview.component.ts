import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {ContextBoxes} from './context-box/context-boxes.service';
import {ContextBoxComponent} from './context-box/context-box.component';
import {BuilderStateService} from '../builder-state.service';

@Component({
    selector: 'live-preview',
    templateUrl: './live-preview.component.html',
    styleUrls: ['./live-preview.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LivePreviewComponent implements OnInit {
    @ViewChild('iframe', {static: true}) iframe: ElementRef;
    @ViewChild('hoverBox', {static: true}) hoverBox: ContextBoxComponent;
    @ViewChild('selectedBox', {static: true}) selectedBox: ContextBoxComponent;
    @ViewChild('dragOverlay', {static: true}) dragOverlay: ElementRef<HTMLElement>;
    @ViewChild('dropHelper', {static: true}) dropHelper: ElementRef<HTMLElement>;

    constructor(
        public state: BuilderStateService,
        private contextBoxes: ContextBoxes,
        private el: ElementRef<HTMLElement>
    ) {}

    ngOnInit() {
        this.contextBoxes.set(
            this.hoverBox.el.nativeElement,
            this.selectedBox.el.nativeElement,
            this.iframe
        );
        this.state.iframe = this.iframe.nativeElement;
        this.state.dragOverlay = this.dragOverlay.nativeElement;
        this.state.dropHelper = this.dropHelper.nativeElement;
        this.state.previewContainer = this.el.nativeElement;
    }
}
