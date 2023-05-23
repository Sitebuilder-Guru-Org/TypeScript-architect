import {
    ArchitectElControl,
    ArchitectElement,
    EditableProp,
    ElControlType,
} from '../architect-element';
import {hasClass} from '../../utils/has-class';
import {LayoutPanel} from '../../sidebar/layout-panel/layout-panel.service';
import {BuilderStateService} from '../../builder-state.service';
import {BuilderSidebarPanel} from '../../sidebar/builder-sidebar-panel';
import {MutationsService} from '../../mutations/mutations.service';
import {ReplaceClass} from '../../mutations/attributes/replace-class';

export abstract class LayoutEl extends ArchitectElement {
    defaultInspectorPanel = BuilderSidebarPanel.Layout;
    specificity = 3;

    editActions = [{
        name: 'Edit Layout',
        onClick: (node: HTMLElement) => {
            this.get(LayoutPanel).selectActiveRowAndContainer();
            this.get(BuilderStateService).inspectorPanel$.next(
                BuilderSidebarPanel.Layout
            );
        }
    }];
}

export class ContainerEl extends LayoutEl {
    name = 'container';
    html = '<div class="container"></div>';
    contentCategories = ['flow'];
    allowedContent = ['flow'];
    category = 'layout';
    icon = 'crop-square';
    controls = [
        new ArchitectElControl(this.injector, {
            label: 'Type',
            type: ElControlType.Select,
            options: [
                {key: 'Default', value: 'container'},
                {key: 'Wide', value: 'container-fluid'},
            ],
            defaultValue(node: HTMLElement) {
                const val = this.options.find(o =>
                    node.classList.contains(o.value)
                );
                return (val || this.options[0]).value;
            },
            onChange(node: HTMLElement, value: string) {
                const currentSize = this.options.find(o =>
                    node.classList.contains(o.value)
                )?.value;
                this.get(MutationsService).execute(
                    new ReplaceClass(node, value, currentSize)
                );
            },
        }),
    ];

    matcher(node: HTMLElement) {
        return hasClass(node, 'container');
    }
}

export class RowEl extends LayoutEl {
    name = 'row';
    html =
        '<section class="row"><div class="col-md-4"></div><div class="col-md-3"></div><div class="col-md-5"></div></section>';
    contentCategories = ['flow'];
    allowedEls = [ColumnEl];
    category = 'layout';
    icon = 'view-stream';
    matcher(node: HTMLElement) {
        return hasClass(node, 'row');
    }
}

export class ColumnEl extends LayoutEl {
    name = 'column';
    html = '<div class="col-sm-6"></div>';
    contentCategories = ['flow'];
    allowedContent = ['flow'];
    canEdit = [
        EditableProp.Text,
        EditableProp.Border,
        EditableProp.Margin,
        EditableProp.Padding,
        EditableProp.Attributes,
    ];
    matcher(node: HTMLElement) {
        for (let i = 0; i < node.classList.length; i++) {
            if (node.classList.item(i).match(/col-.*/)) {
                return true;
            }
        }
        return false;
    }
}
