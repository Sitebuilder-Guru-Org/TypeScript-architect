import {BaseMutation} from '../../base-mutation';
import {BACKGROUND_PROPS} from '../../../sidebar/inspector-panel/background-panel/background-props';

export class ResetBg extends BaseMutation {
    static historyName = 'Reset background';

    protected oldProps;

    constructor(el: HTMLElement) {
        super(el);
        this.oldProps = {};
        BACKGROUND_PROPS.forEach(prop => {
            this.oldProps[prop] = el.style[prop];
        });
    }

    protected onInit() {
        //
    }

    protected executeMutation(doc: Document) {
        const el = this.findEl(doc);
        if (el) {
            return BACKGROUND_PROPS.some(prop => {
                if (el.style[prop]) {
                    el.style[prop] = null;
                    return true;
                }
            });
        }
    }

    protected undoMutation(doc: Document) {
        const el = this.findEl(doc);
        if (el) {
            return Object.entries(this.oldProps).some(([prop, value]) => {
                if (el.style[prop] !== value) {
                    el.style[prop] = value;
                    return true;
                }
            });
        }
    }
}
