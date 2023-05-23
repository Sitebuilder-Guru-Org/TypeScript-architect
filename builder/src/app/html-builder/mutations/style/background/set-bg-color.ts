import {SetStyle} from '../set-style';

export class SetBgColor extends SetStyle {
    static historyName = 'Changed background color';
    constructor(private backgroundColor: string, el: HTMLElement) {
        super({backgroundColor}, el);
    }
}
