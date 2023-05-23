import {Component, Input, OnInit} from '@angular/core';
import {ucFirst} from '@common/core/utils/uc-first';
import {MutationsService} from '../../../mutations/mutations.service';
import {SetPadding} from '../../../mutations/style/spacing/set-padding';
import {SpacingType} from './spacing-type';
import {SetMargin} from '../../../mutations/style/spacing/set-margin';
import {SetBorderRadius} from '../../../mutations/style/border/set-border-radius';
import {BehaviorSubject} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {MatSliderChange} from '@angular/material/slider';
import {SetBorderWidth} from '../../../mutations/style/border/set-border-width';
import {CssKey} from '../../../mutations/style/default-css-values';
import {BuilderStateService} from '../../../builder-state.service';

@Component({
    selector: 'spacing-panel',
    templateUrl: './spacing-panel.component.html',
    styleUrls: ['./spacing-panel.component.scss'],
})
export class SpacingPanelComponent implements OnInit {
    @Input() sliderMax = 100;
    @Input() type: SpacingType = SpacingType.Padding;
    get typeIsBorderRadius() {
        return this.type === SpacingType.BorderRadius;
    }

    private readonly availableSides = ['top', 'right', 'bottom', 'left'];

    sliderValue = 0;
    enabledSides: string[] = ['top', 'right', 'bottom', 'left'];
    spacing = {top: 0, left: 0, right: 0, bottom: 0};
    unit = 'px';
    cornersConnected$ = new BehaviorSubject(true);

    sidesForm = this.fb.group(
        {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        },
        {updateOn: 'blur'}
    );

    constructor(
        private state: BuilderStateService,
        private mutations: MutationsService,
        private fb: FormBuilder
    ) {}

    ngOnInit() {
        // update all sides control when one of them changes, if they are connected.
        this.availableSides.forEach(side => {
            this.sidesForm.get(side).valueChanges.subscribe(sideValue => {
                const numeric = sideValue.replace(/^\D+/g, '').trim();
                if (numeric !== sideValue) {
                    if (numeric && numeric > -1) {
                        this.sidesForm
                            .get(side)
                            .setValue(numeric, {emitEvent: false});
                        if (this.cornersConnected$.value) {
                            this.sidesForm.setValue(
                                {
                                    top: numeric,
                                    right: numeric,
                                    left: numeric,
                                    bottom: numeric,
                                },
                                {emitEvent: false}
                            );
                        }
                    } else {
                        this.setSelectedElementSpacingValues();
                    }
                }
            });
        });

        // apply spacing when either of the side control value changes
        this.sidesForm.valueChanges.subscribe(() => {
            this.applySpacing();
        });

        // on undo/redo get current el spacing
        this.mutations.executed$.subscribe(() => {
            this.setSelectedElementSpacingValues();
        });

        // on selected element change get new el spacing
        this.state.selected$.subscribe(() => {
            this.setSelectedElementSpacingValues();
        });
    }

    toggleCornersConnected() {
        this.cornersConnected$.next(!this.cornersConnected$.value);
    }

    applySpacing() {
        const u = this.unit;
        const v = this.sidesForm.value;
        const top = this.sideEnabled('top') ? v.top : 0;
        const right = this.sideEnabled('right') ? v.right : 0;
        const bottom = this.sideEnabled('bottom') ? v.bottom : 0;
        const left = this.sideEnabled('left') ? v.left : 0;
        const spacing =
            this.type === SpacingType.BorderRadius
                ? `${top}${u} ${left}${u} ${bottom}${u} ${right}${u}`
                : `${top}${u} ${right}${u} ${bottom}${u} ${left}${u}`;
        this.mutations.execute(this.getSpacingMutation(this.type, spacing));
    }

    toggleSide(name: string) {
        if (name === 'all') {
            this.enabledSides =
                this.enabledSides.length > 0 ? [] : [...this.availableSides];
        } else {
            if (this.sideEnabled(name)) {
                this.enabledSides.splice(this.enabledSides.indexOf(name), 1);
            } else {
                this.enabledSides.push(name);
            }
        }
        this.applySpacing();
    }

    sideEnabled(name: string) {
        if (name === 'all') return this.enabledSides.length === 4;
        return this.enabledSides.indexOf(name) > -1;
    }

    onSliderInput(e: MatSliderChange) {
        this.enabledSides.forEach(side => {
            this.sidesForm.get(side).setValue(e.value, {emitEvent: false});
        });
        this.applySpacing();
    }

    onFormSubmit() {
        (document.activeElement as HTMLElement).blur();
        // form will change and spacing get applied on blur
    }

    private getSpacingMutation(type: SpacingType, spacing: string) {
        const el = this.state.selected.node;
        switch (type) {
            case SpacingType.Padding:
                return new SetPadding(spacing, el);
            case SpacingType.Margin:
                return new SetMargin(spacing, el);
            case SpacingType.BorderRadius:
                return new SetBorderRadius(spacing, el);
            case SpacingType.BorderWidth:
                return new SetBorderWidth(spacing, el);
        }
    }

    private setSelectedElementSpacingValues() {
        this.availableSides.forEach(side => {
            const value = this.state.getSelectedStyle(
                this.generateCssRuleName(side) as CssKey
            )?.replace('px', '');
            this.sidesForm.get(side).setValue(value, {emitEvent: false});
        });
        this.cornersConnected$.next(this.allSpacingValuesEqual());
        if (this.cornersConnected$.value) {
            this.sliderValue = this.sidesForm.get('top').value;
        }
    }

    private allSpacingValuesEqual() {
        return (
            this.availableSides.filter(side => {
                return this.spacing[side] === this.spacing.top;
            }).length === 4
        );
    }

    private generateCssRuleName(side: string): CssKey {
        side = ucFirst(side);
        if (this.type === SpacingType.BorderWidth) {
            return `border${side}Width` as CssKey;
        } else if (this.type === SpacingType.BorderRadius) {
            return this.generateBorderRadiusRuleName(side);
        } else {
            return (this.type + side) as CssKey;
        }
    }

    private generateBorderRadiusRuleName(side: string) {
        side = side.toLowerCase();
        switch (side) {
            case 'top':
                return 'borderTopLeftRadius';
            case 'left':
                return 'borderTopRightRadius';
            case 'bottom':
                return 'borderBottomLeftRadius';
            case 'right':
                return 'borderBottomRightRadius';
        }
    }
}
