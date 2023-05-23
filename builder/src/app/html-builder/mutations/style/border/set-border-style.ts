import {SetBorder} from './set-border';

export class SetBorderStyle extends SetBorder {
    static historyName = 'Changed border style';
    constructor(private borderStyle: string, el: HTMLElement) {
        super({borderStyle}, el);
    }
}
