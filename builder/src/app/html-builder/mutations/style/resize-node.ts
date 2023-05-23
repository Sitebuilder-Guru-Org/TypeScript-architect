import {SetStyle} from './set-style';

interface ResizeProps {
    width: string;
    height: string;
    maxWidth?: string;
    maxHeight?: string;
    [index: number]: string;
}

export class ResizeNode extends SetStyle {
    static historyName = 'Resized';
    constructor(protected newProps: ResizeProps, el: HTMLElement) {
        super(newProps, el);
    }

    protected onInit() {
        this.newProps.maxHeight = 'none';
        this.newProps.maxWidth = 'none';
        super.onInit();
    }
}
