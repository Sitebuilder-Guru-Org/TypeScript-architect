import {SetStyle} from '../set-style';
import {DEFAULT_CSS_VALUES} from '../default-css-values';

export class SetBorder extends SetStyle {
    protected onInit() {
        if (
            !this.changes.new.borderStyle &&
            getComputedStyle(this.el).borderStyle ===
                DEFAULT_CSS_VALUES.borderStyle
        ) {
            this.changes.new.borderStyle = 'solid';
        }
        super.onInit();
    }
}
