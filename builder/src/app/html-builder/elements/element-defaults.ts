import {EditableProp} from './architect-element';
import {BuilderSidebarPanel} from '../sidebar/builder-sidebar-panel';

export const ELEMENT_DEFAULTS = {
    name: 'Generic',
    canEdit: [
        EditableProp.Padding,
        EditableProp.Margin,
        EditableProp.Border,
        EditableProp.Text,
        EditableProp.Attributes,
        EditableProp.Shadow,
        EditableProp.Background,
    ],
    specificity: 0,
    canDrag: true,
    controls: [],
    resizable: true,
    contextMenu: true,
    contentCategories: ['flow'],
    allowedContent: ['flow'],
    allowedEls: [],
    hiddenClasses: [],
    defaultInspectorPanel: BuilderSidebarPanel.Inspector,
};
