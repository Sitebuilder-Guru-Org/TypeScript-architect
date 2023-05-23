import {SetStyle} from '../set-style';

export class SetMargin extends SetStyle {
    static historyName = 'Changed margin';
    constructor(private margin: string, el: HTMLElement) {
        super({margin}, el);
    }
}
