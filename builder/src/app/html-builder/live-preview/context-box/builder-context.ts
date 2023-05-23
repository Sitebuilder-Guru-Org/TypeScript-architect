import {ArchitectElement} from '../../elements/architect-element';

export enum ContextType {
    Selected = 'selected',
    Hover = 'hover',
}

export interface HoverContext {
    el: ArchitectElement;
    node: HTMLElement;
}

export interface SelectedContext extends HoverContext {
    path: {node: HTMLElement; name: string}[];
}
