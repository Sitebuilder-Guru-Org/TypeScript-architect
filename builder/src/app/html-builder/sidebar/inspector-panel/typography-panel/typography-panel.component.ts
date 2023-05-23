import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BuilderDocumentActions} from '../../../builder-document-actions.service';
import {ColorpickerPanelComponent} from '@common/core/ui/color-picker/colorpicker-panel.component';
import {BuilderStateService} from '../../../builder-state.service';
import {BuilderOverlayService} from '../../../overlays/builder-overlay.service';
import {MutationsService} from '../../../mutations/mutations.service';
import {FormBuilder} from '@angular/forms';
import {
    SetTextStyle,
    TypographyStyles,
} from '../../../mutations/style/text/set-text-style';
import {
    CssKey,
    DEFAULT_CSS_VALUES,
} from '../../../mutations/style/default-css-values';
import {FontSelectorOverlayComponent} from '../../../overlays/font-selector-overlay/font-selector-overlay.component';
import {GoogleFontSelectorValue} from '@common/shared/form-controls/google-font-selector/google-font-selector.component';

@Component({
    selector: 'typography-panel',
    templateUrl: './typography-panel.component.html',
    styleUrls: ['./typography-panel.component.scss'],
})
export class TypographyPanelComponent implements OnInit {
    @ViewChild('googleFontsOrigin', {static: true})
    googleFontsOrigin: ElementRef;

    public styles: any = {};
    public baseFonts: {name: string; css: string}[] = [];
    public fontWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];

    form = this.fb.group({
        color: '',
        fontSize: this.fb.control('', {updateOn: 'submit'}),
        textAlign: '',
        fontStyle: '',
        fontFamily: '',
        lineHeight: '',
        fontWeight: '',
        backgroundColor: '',
        textDecorationLine: '',
    });

    constructor(
        private state: BuilderStateService,
        private builderActions: BuilderDocumentActions,
        private overlay: BuilderOverlayService,
        private mutations: MutationsService,
        private fb: FormBuilder
    ) {}

    ngOnInit() {
        this.mutations.executed$.subscribe(() => {
            this.setSelectedElementTextStyles();
        });
        this.state.selected$.subscribe(() => {
            this.setSelectedElementTextStyles();
        });
        this.form.valueChanges.subscribe(() => {
            this.executeMutation();
        });
    }

    executeMutation() {
        const values = {
            ...this.form.value,
            fontSize: this.form.value.fontSize + 'px',
        };
        this.mutations.execute(
            new SetTextStyle(values, this.state.selected.node)
        );
    }

    currentValue(prop: keyof TypographyStyles) {
        const values = this.form.value as TypographyStyles;
        return values[prop];
    }

    isDefaultValue(prop: keyof TypographyStyles): boolean {
        return DEFAULT_CSS_VALUES[prop] === this.form.value[prop];
    }

    toggleTextStyle(prop: keyof TypographyStyles, value: string) {
        this.form.patchValue({
            [prop]: this.form.value[prop] === value ? null : value,
        });
    }

    openColorPicker(prop: 'color' | 'backgroundColor') {
        const currentColor = this.form.value[prop];
        this.overlay
            .open(ColorpickerPanelComponent, {color: currentColor})
            .valueChanged()
            .subscribe(color => {
                this.form.patchValue({
                    [prop]: color,
                });
            });
    }

    openFontPicker() {
        const panelRef = this.overlay.open(FontSelectorOverlayComponent);
        panelRef.valueChanged().subscribe((value: GoogleFontSelectorValue) => {
            panelRef.close();
            this.form.patchValue({
                fontFamily: value.family,
            });
        });
    }


    onFontSizeBlur(e: FocusEvent) {
        this.form.patchValue({
            fontSize: (e.target as HTMLSelectElement).value,
        });
    }

    private setSelectedElementTextStyles() {
        const values: TypographyStyles = {};
        Object.keys(this.form.value).forEach(prop => {
            const val = this.state.getSelectedStyle(prop as CssKey);
            values[prop] = prop === 'fontSize' ? parseInt(val) : val;
        });
        this.form.patchValue(values, {emitEvent: false});
    }
}
