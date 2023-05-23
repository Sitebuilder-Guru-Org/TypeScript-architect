import {Injector, ProviderToken} from '@angular/core';
import {InlineTextEditor} from '../overlays/inline-text-editor/inline-text-editor.service';
import {BuilderSidebarPanel} from '../sidebar/builder-sidebar-panel';

export enum EditableProp {
    Padding = 'padding',
    Margin = 'margin',
    Border = 'border',
    Text = 'text',
    Attributes = 'attributes',
    Shadow = 'shadow',
    Background = 'background',
}

export interface ArchitectElControlConfig {
    label: string;
    type: ElControlType;
    defaultValue: string | ((node: HTMLElement) => string);
    inputType?: 'text' | 'number';
    options?: {key: string; value: string}[];
    onChange?: (node: HTMLElement, value: string) => void;
}

export class ArchitectElControl implements Partial<ArchitectElControlConfig> {
    label: string;

    protected get<T>(token: ProviderToken<T>): T {
        return this.injector.get(token);
    }

    constructor(
        protected injector: Injector,
        config: ArchitectElControlConfig
    ) {
        Object.entries(config).forEach(([key, value]) => {
            this[key] = value;
        });
    }
}

export enum ElControlType {
    Select = 'select',
    Input = 'input',
}

export abstract class ArchitectElement {
    abstract name: string;
    icon?: string;
    category?: string;
    html?: string;
    css?: string;
    hiddenClasses?: string[] = [];
    specificity = 0;

    editActions: {
        name: string,
        onClick: (node: HTMLElement) => void,
    }[] = [];

    canEdit: EditableProp[] = [
        EditableProp.Padding,
        EditableProp.Margin,
        EditableProp.Border,
        EditableProp.Attributes,
        EditableProp.Shadow,
        EditableProp.Background,
    ];
    defaultInspectorPanel = BuilderSidebarPanel.Inspector;
    canDrag = true;
    controls: any[] = [];
    resizable = true;
    contextMenu = true;
    contentCategories = ['flow'];
    allowedContent: string[] = ['flow'];
    allowedEls: typeof ArchitectElement[] = [];

    abstract matcher(node: HTMLElement): boolean | HTMLElement;

    protected get<T>(token: ProviderToken<T>): T {
        return this.injector.get(token);
    }

    constructor(protected injector: Injector) {}
}

export abstract class ArchitectTextEl extends ArchitectElement {
    canEdit: EditableProp[] = [
        EditableProp.Padding,
        EditableProp.Margin,
        EditableProp.Border,
        EditableProp.Attributes,
        EditableProp.Shadow,
        EditableProp.Background,
        EditableProp.Text,
    ];
    editActions = [{
        name: 'Edit Text',
        onClick: (node: HTMLElement) => {
            this.get(InlineTextEditor).open(node);
        }
    }];

    constructor(protected injector: Injector) {
        super(injector);
    }
}
