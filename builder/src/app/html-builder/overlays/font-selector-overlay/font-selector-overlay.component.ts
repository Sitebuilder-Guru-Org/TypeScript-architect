import {Component, Inject, OnInit, Optional} from '@angular/core';
import {FormControl} from '@angular/forms';
import {OverlayPanelRef} from '@common/core/ui/overlay-panel/overlay-panel-ref';

@Component({
    selector: 'font-selector-overlay',
    templateUrl: './font-selector-overlay.component.html',
    styleUrls: ['./font-selector-overlay.component.scss'],
    host: {class: 'builder-overlay'},
})
export class FontSelectorOverlayComponent implements OnInit {
    formControl = new FormControl();

    constructor(
        @Inject(OverlayPanelRef) @Optional() public overlayRef: OverlayPanelRef
    ) {}

    ngOnInit() {
        this.formControl.valueChanges.subscribe(value => {
            this.overlayRef.emitValue(value);
        });
    }
}
