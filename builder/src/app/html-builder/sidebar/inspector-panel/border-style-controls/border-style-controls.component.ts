import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ColorpickerPanelComponent} from '@common/core/ui/color-picker/colorpicker-panel.component';
import {MutationsService} from '../../../mutations/mutations.service';
import {SetBorderColor} from '../../../mutations/style/border/set-border-color';
import {BuilderOverlayService} from '../../../overlays/builder-overlay.service';
import {SetBorderStyle} from '../../../mutations/style/border/set-border-style';
import {BuilderStateService} from '../../../builder-state.service';

@Component({
    selector: 'border-style-controls',
    templateUrl: './border-style-controls.component.html',
    styleUrls: ['./border-style-controls.component.scss'],
})
export class BorderStyleControlsComponent implements OnInit {
    @ViewChild('colorButton', {static: true}) colorButton: ElementRef;

    borderStyle = 'none';
    borderColor = '#eee';

    constructor(
        private state: BuilderStateService,
        private builderOverlay: BuilderOverlayService,
        private mutations: MutationsService
    ) {}

    ngOnInit() {
        this.state.selected$.subscribe(() => {
            this.setInitialBorderStyles();
        });
        this.mutations.executed$.subscribe(() => {
            this.setInitialBorderStyles();
        });
    }

    applyBorderStyle() {
        this.mutations.execute(
            new SetBorderStyle(this.borderStyle, this.state.selected.node)
        );
    }

    openColorPicker() {
        this.builderOverlay
            .open(ColorpickerPanelComponent, {
                color: this.borderColor,
            })
            .valueChanged()
            .subscribe(color => {
                this.borderColor = color;
                this.mutations.execute(
                    new SetBorderColor(color, this.state.selected.node)
                );
            });
    }

    private setInitialBorderStyles() {
        this.borderStyle = this.state.getSelectedStyle('borderStyle');
        this.borderColor = this.state.getSelectedStyle('borderColor');
    }
}
