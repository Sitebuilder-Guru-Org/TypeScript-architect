import {SetBorder} from './set-border';

export class SetBorderWidth extends SetBorder {
    static historyName = 'Changed border width';
    constructor(private borderWidth: string, el: HTMLElement) {
        super({borderWidth}, el);
    }
}
