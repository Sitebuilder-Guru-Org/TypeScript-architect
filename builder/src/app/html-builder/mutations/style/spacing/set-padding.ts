import {SetStyle} from '../set-style';

export class SetPadding extends SetStyle {
    static historyName = 'Changed padding';
    constructor(private padding: string, el: HTMLElement) {
        super({padding}, el);
    }
}
