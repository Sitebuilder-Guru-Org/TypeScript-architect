import {SetStyle} from '../set-style';

export class SetBoxShadow extends SetStyle {
    static historyName = 'Changed box shadow';
    constructor(private shadow: string, el: HTMLElement) {
        super({boxShadow: shadow}, el);
    }
}
