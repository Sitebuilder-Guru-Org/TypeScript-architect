import {SetBorder} from './set-border';

export class SetBorderRadius extends SetBorder {
    static historyName = 'Changed border radius';
    constructor(private borderRadius: string, el: HTMLElement) {
        super({borderRadius}, el);
    }
}
