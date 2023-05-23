import {BaseMutation} from '../base-mutation';

export class ChangeVisibility extends BaseMutation {
    static historyName = 'Replaced class';
    constructor(
        protected el: HTMLElement,
        protected visibility: Record<string, boolean>
    ) {
        super(el);
    }

    protected executeMutation(doc: Document): boolean {
        const el = this.findEl(doc);

        // sm will have a different class on bootstrap, need to set it separately
        if (!this.visibility.sm) {
            el.classList.add('d-none');
        } else {
            el.classList.remove('d-none');
        }

        const allVisible = Object.values(this.visibility).every(v => v);
        const allHidden = Object.values(this.visibility).every(v => !v);

        Object.keys(this.visibility)
            .filter(key => key !== 'sm')
            .forEach(key => {
                // remove all visibility related classes (except "d-none")
                if (allVisible || allHidden) {
                    el.classList.remove(`d-${key}-block`);
                    el.classList.remove(`d-${key}-none`);
                } else {
                    // set classes for each breakpoint separately
                    if (this.visibility[key]) {
                        el.classList.add(`d-${key}-block`);
                        el.classList.remove(`d-${key}-none`);
                    } else {
                        el.classList.add(`d-${key}-none`);
                        el.classList.remove(`d-${key}-block`);
                    }
                }
            });

        return true;
    }

    protected undoMutation(doc: Document): boolean {
        return false;
    }
}
