import {SetStyle} from '../set-style';

export class SetTextShadow extends SetStyle {
    static historyName = 'Changed text shadow';
    constructor(private shadow: string, el: HTMLElement) {
        super({textShadow: shadow}, el);
    }
}
