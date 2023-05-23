import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {
    ArchitectElControlConfig,
    ElControlType,
} from '../../../../elements/architect-element';
import {skip, takeUntil} from 'rxjs/operators';
import {BuilderStateService} from '../../../../builder-state.service';

@Component({
    selector: 'element-controls',
    templateUrl: './element-controls.component.html',
    styleUrls: ['./element-controls.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementControlsComponent implements OnInit {
    form = this.fb.group({});
    controls: ArchitectElControlConfig[];
    controlType = ElControlType;

    constructor(
        private fb: FormBuilder,
        private cd: ChangeDetectorRef,
        private state: BuilderStateService
    ) {}

    ngOnInit() {
        this.state.selected$.subscribe(context => {
            this.form = this.fb.group({});
            if (context) {
                this.controls = context.el.controls;
                this.controls.forEach(control => {
                    this.createControl(control);
                });
            }
            this.cd.markForCheck();
        });
    }

    private createControl(config: ArchitectElControlConfig) {
        const defaultValue =
            typeof config.defaultValue === 'function'
                ? config.defaultValue(this.state.selected.node)
                : config.defaultValue;
        const control = this.fb.control(defaultValue);
        this.form.addControl(config.label, control);
        control.valueChanges
            .pipe(takeUntil(this.state.selected$.pipe(skip(1))))
            .subscribe(value => {
                config.onChange(this.state.selected.node, value);
            });
    }
}
