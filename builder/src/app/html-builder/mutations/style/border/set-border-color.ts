import {SetBorder} from './set-border';

export class SetBorderColor extends SetBorder {
    static historyName = 'Changed border color';
    constructor(private borderColor: string, el: HTMLElement) {
        super({borderColor}, el);
    }
}
