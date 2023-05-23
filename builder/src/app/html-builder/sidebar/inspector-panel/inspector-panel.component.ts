import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {LivePreview} from '../../live-preview.service';
import {SpacingType} from './spacing-panel/spacing-type';
import {EditableProp} from '../../elements/architect-element';
import {ContextBoxes} from '../../live-preview/context-box/context-boxes.service';
import {BuilderStateService} from '../../builder-state.service';
import {ContextType} from '../../live-preview/context-box/builder-context';

@Component({
    selector: 'inspector-panel',
    templateUrl: './inspector-panel.component.html',
    styleUrls: ['./inspector-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class InspectorPanelComponent implements OnInit {
    spacingType = SpacingType;
    editableProp = EditableProp;
    contextType = ContextType;
    path: {node: HTMLElement; name: string}[] = [];

    constructor(
        public livePreview: LivePreview,
        public contextBoxes: ContextBoxes,
        public state: BuilderStateService
    ) {}

    ngOnInit() {
        this.state.selected$.subscribe(context => {
            this.path = context?.path.slice() || [];
        });
    }

    canEdit(property: EditableProp): boolean {
        if (!this.state.selected?.el) return false;
        return this.state.selected.el.canEdit.includes(property);
    }
}
