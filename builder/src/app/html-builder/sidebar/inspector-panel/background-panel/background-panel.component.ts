import {AfterViewInit, Component, ViewEncapsulation} from '@angular/core';
import {ColorpickerPanelComponent} from '@common/core/ui/color-picker/colorpicker-panel.component';
import {RIGHT_POSITION} from '@common/core/ui/overlay-panel/positions/right-position';
import {SetBgColor} from '../../../mutations/style/background/set-bg-color';
import {MutationsService} from '../../../mutations/mutations.service';
import {SetBgImage} from '../../../mutations/style/background/set-bg-image';
import {BackgroundUrlPipe} from '@common/core/ui/format-pipes/background-url.pipe';
import {ResetBg} from '../../../mutations/style/background/reset-bg';
import {
    BackgroundOverlayComponent,
    BackgroundOverlayData,
} from '@common/shared/form-controls/background-selector/background-overlay/background-overlay.component';
import {BehaviorSubject} from 'rxjs';
import {BACKGROUND_PROPS} from './background-props';
import {BuilderOverlayService} from '../../../overlays/builder-overlay.service';
import {BuilderStateService} from '../../../builder-state.service';
import {CssKey} from '../../../mutations/style/default-css-values';

@Component({
    selector: 'background-panel',
    templateUrl: './background-panel.component.html',
    styleUrls: ['./background-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BackgroundPanelComponent implements AfterViewInit {
    previewBgColor$ = new BehaviorSubject(null);
    previewBgImg$ = new BehaviorSubject(null);

    constructor(
        private state: BuilderStateService,
        private panel: BuilderOverlayService,
        private mutations: MutationsService,
        private bgUrl: BackgroundUrlPipe
    ) {}

    ngAfterViewInit() {
        setTimeout(() => {
            this.state.selected$.subscribe(() => {
                this.updatePreviewColorAndImg();
            });
        });
    }

    openColorpickerPanel() {
        const currentColor = this.state.getSelectedStyle('backgroundColor');
        this.panel
            .open(ColorpickerPanelComponent, {
                position: RIGHT_POSITION,
                data: {color: currentColor},
            })
            .valueChanged()
            .subscribe((color: string) => {
                this.mutations.execute(
                    new SetBgColor(color, this.state.selected.node)
                );
                this.updatePreviewColorAndImg();
            });
    }

    openBackgroundPanel() {
        const initialValues = {};
        BACKGROUND_PROPS.forEach(prop => {
            initialValues[prop] = this.state.getSelectedStyle(prop as CssKey);
        });

        this.panel
            .open(BackgroundOverlayComponent, {
                initialValues,
            } as BackgroundOverlayData)
            .valueChanged()
            .subscribe(value => {
                if (value.backgroundImage) {
                    value.backgroundImage = this.bgUrl.transform(
                        value.backgroundImage
                    );
                }
                this.mutations.execute(
                    new SetBgImage(value, this.state.selected.node)
                );
                this.updatePreviewColorAndImg();
            });
    }

    private updatePreviewColorAndImg() {
        this.previewBgColor$.next(this.state.getSelectedStyle('backgroundColor'));
        const bgImage = this.state.getSelectedStyle('backgroundImage');
        this.previewBgImg$.next(bgImage === 'none' ? null : bgImage);
    }

    resetBackground() {
        this.mutations.execute(new ResetBg(this.state.selected.node));
    }
}
