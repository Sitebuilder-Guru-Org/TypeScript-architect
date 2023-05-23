import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    ViewChild,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {
    customPresetValidator,
    presetStringToToArray,
} from './custom-preset-validator';

@Component({
    selector: 'column-presets',
    templateUrl: './column-presets.component.html',
    styleUrls: ['./column-presets.component.scss'],
})
export class ColumnPresetsComponent implements OnChanges {
    @Input() preset: number[];
    @Output() selected = new EventEmitter<number[]>();
    @ViewChild('customInput') customInput: ElementRef<HTMLInputElement>;

    customPanelOpen = false;
    customPresetIsValid = true;

    customPresetControl = new FormControl('', customPresetValidator());

    ngOnChanges() {
        this.customPresetControl.reset(this.preset.join(' + '));
    }

    selectPreset(preset: number[]) {
        this.preset = preset;
        this.selected.emit(preset);
    }

    presetIsActive(preset: number[]) {
        return (
            this.preset.length === preset.length &&
            this.preset.every((element, index) => {
                return element === preset[index];
            })
        );
    }

    toggleCustomPanel() {
        if (this.customPanelOpen) {
            this.customPanelOpen = false;
        } else {
            this.customPanelOpen = true;
            setTimeout(() => {
                this.customInput.nativeElement.focus();
            });
        }
    }

    applyCustomPreset() {
        if (this.customPresetControl.valid) {
            this.selectPreset(
                presetStringToToArray(this.customPresetControl.value)
            );
            this.customPanelOpen = false;
        }
    }
}
