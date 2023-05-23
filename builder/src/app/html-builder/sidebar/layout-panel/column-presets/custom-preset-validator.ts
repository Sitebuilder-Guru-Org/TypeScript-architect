import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function customPresetValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const spans = presetStringToToArray(control.value);
        if (!presetIsValid(spans)) {
            return {customPreset: {preset: control.value}};
        } else {
            return null;
        }
    };
}

export function presetStringToToArray(preset: string): number[] {
    const customSpan = preset.split('+');
    return customSpan.map(span => parseInt(span.trim()));
}

function presetIsValid(preset: number[]): boolean {
    const validSpans = preset.filter(span => span > 0 && span <= 12);
    return validSpans.length && validSpans.reduce((sum, x) => sum + x) === 12;
}
