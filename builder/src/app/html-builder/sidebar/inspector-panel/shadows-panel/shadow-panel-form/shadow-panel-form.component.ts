import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import {BuilderDocumentActions} from '../../../../builder-document-actions.service';
import {MutationsService} from '../../../../mutations/mutations.service';
import {SetTextShadow} from '../../../../mutations/style/shadow/set-text-shadow';
import {SetBoxShadow} from '../../../../mutations/style/shadow/set-box-shadow';
import {ColorpickerPanelComponent} from '@common/core/ui/color-picker/colorpicker-panel.component';
import {FormBuilder, FormControl} from '@angular/forms';
import {startWith} from 'rxjs/operators';
import {objectsAreEqual} from '@common/core/utils/objects-are-equal';
import {BuilderOverlayService} from '../../../../overlays/builder-overlay.service';
import {BuilderStateService} from '../../../../builder-state.service';

const DEFAULT_PROPS: ShadowProps = {
    inset: false,
    angle: '0',
    distance: '0',
    blur: '0',
    color: 'transparent',
    spread: '0',
};

interface ShadowProps {
    inset?: boolean;
    angle?: string;
    distance?: string;
    blur?: string;
    color?: string;
    spread?: string;
}

@Component({
    selector: 'shadow-panel-form',
    templateUrl: './shadow-panel-form.component.html',
    styleUrls: ['./shadow-panel-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShadowPanelFormComponent implements OnInit {
    @ViewChild('colorButton') colorButton: ElementRef;
    @Input() type: 'box' | 'text';

    sliderControls = ['angle', 'distance', 'blur', 'spread'];
    form = this.fb.group(DEFAULT_PROPS);
    activeColor$ = this.form.get('color').valueChanges.pipe(startWith('#fff'));

    enabled = new FormControl(false);

    constructor(
        private state: BuilderStateService,
        private overlay: BuilderOverlayService,
        private builderActions: BuilderDocumentActions,
        private mutations: MutationsService,
        private fb: FormBuilder
    ) {}

    ngOnInit() {
        this.enabled.valueChanges.subscribe(enabled => {
            enabled
                ? this.form.enable({emitEvent: false})
                : this.form.disable({emitEvent: false});
        });

        this.form.valueChanges.subscribe(() => {
            this.applyStyle();
        });

        this.state.selected$.subscribe(() => {
            const props = this.getSelectedElShadowProps();
            if (props) {
                this.enabled.setValue(true);
                this.form.setValue(props, {emitEvent: false});
            } else {
                this.enabled.setValue(false);
                this.form.setValue(DEFAULT_PROPS, {emitEvent: false});
            }
        });
    }

    applyStyle() {
        const shadowValue = this.formValueAsShadowString();
        const mutation =
            this.type === 'text'
                ? new SetTextShadow(shadowValue, this.state.selected.node)
                : new SetBoxShadow(shadowValue, this.state.selected.node);
        this.mutations.execute(mutation);
    }

    openColorPicker() {
        this.overlay
            .open(
                ColorpickerPanelComponent,
                {color: this.form.value.color},
                this.colorButton.nativeElement
            )
            .valueChanged()
            .subscribe(color => {
                if (color) {
                    this.form.patchValue({color});
                }
            });
    }

    private formValueAsShadowString(): string {
        const props = this.form.value;
        const blur = Math.round(props.blur);
        const spread = Math.round(props.spread);
        const angle = parseInt(props.angle) * (Math.PI / 180);
        const x = Math.round(props.distance * Math.cos(angle));
        const y = Math.round(props.distance * Math.sin(angle));
        const inset = props.inset && this.type === 'box' ? 'inset ' : '';
        const color =
            props.color === DEFAULT_PROPS.color
                ? 'rgba(0,0,0,0.5)'
                : props.color;

        if (objectsAreEqual(props, DEFAULT_PROPS)) {
            return 'none';
        }

        let css = inset + x + 'px ' + y + 'px ' + blur + 'px ';

        // text shadows have no spread property
        if (this.type === 'box') {
            css += spread + 'px ';
        }

        return css + color;
    }

    private getSelectedElShadowProps(): ShadowProps | null {
        const shadowString = this.state.getSelectedStyle(
            this.type === 'box' ? 'boxShadow' : 'textShadow'
        );

        if (!shadowString || shadowString === 'none') {
            return null;
        }

        const array = shadowString
            .replace(/, /g, ',')
            .split(' ')
            .map(val => {
                return val.indexOf('px') > -1 ? val.replace('px', '') : val;
            });

        const props: ShadowProps = {};

        // text shadow
        if (array.length === 4) {
            props.color = array[0];
            props.angle = array[1];
            props.distance = array[2];
            props.blur = array[3];
            props.inset = false;
            props.spread = '0px';
            // box shadow
        } else if (array.length === 5 || array.length === 6) {
            props.color = array[0];
            props.angle = array[1];
            props.distance = array[2];
            props.blur = array[3];
            props.spread = array[4];
            props.inset = false;
        } else {
            return null;
        }

        return props;
    }
}
