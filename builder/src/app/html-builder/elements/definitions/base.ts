import {
    ArchitectElControl,
    ArchitectElement,
    ArchitectTextEl,
    EditableProp,
    ElControlType,
} from '../architect-element';
import {IconSelectorOverlayComponent} from '../../overlays/icon-selector-overlay/icon-selector-overlay.component';
import {MutationsService} from '../../mutations/mutations.service';
import {ModifyAttributes} from '../../mutations/attributes/modify-attributes';
import {BuilderOverlayService} from '../../overlays/builder-overlay.service';
import {RenameNode} from '../../mutations/dom/rename-node';
import {getNodeId} from '../../utils/get-node-id';
import {ContextBoxes} from '../../live-preview/context-box/context-boxes.service';
import {ReplaceClass} from '../../mutations/attributes/replace-class';
import {LivePreview} from '../../live-preview.service';
import {BuilderStateService} from '../../builder-state.service';
import {ContextType} from '../../live-preview/context-box/builder-context';

export class ParagraphEl extends ArchitectTextEl {
    name = 'paragraph';
    html = `<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`;
    contentCategories = ['flow'];
    allowedContent = ['phrasing'];
    category = 'typography';
    icon = 'short-text';
    matcher(node: HTMLElement) {
        return node.nodeName === 'P';
    }
}
export class DividerEl extends ArchitectElement {
    name = 'divider';
    html = '<hr>';
    contentCategories = ['flow'];
    allowedContent = [];
    category = 'layout';
    icon = 'remove';
    matcher(node: HTMLElement) {
        return node.nodeName === 'HR';
    }
}
export class MarkedTextEl extends ArchitectTextEl {
    name = 'marked text';
    html = '<mark>Marked Text</mark>';
    contentCategories = ['flow', 'phrasing'];
    allowedContent = ['phrasing'];
    category = 'typography';
    icon = 'info';
    matcher(node: HTMLElement) {
        return node.nodeName === 'MARK';
    }
}

export class DefinitionListEl extends ArchitectElement {
    name = 'definition list';
    html = `<dl class="dl-horizontal"><dt>Description lists</dt><dd>A description list is perfect for defining terms.</dd><dt>Euismod</dt><dd>Vestibulum id ligula porta felis euismod semper eget lacinia odio sem nec elit.</dd><dd>Donec id elit non mi porta gravida at eget metus.</dd><dt>Malesuada porta</dt><dd>Etiam porta sem malesuada magna mollis euismod.</dd><dt>Felis euismod semper eget lacinia</dt><dd>Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</dd></dl>`;
    contentCategories = ['flow', 'sectioning root'];
    allowedContent = ['dt', 'dd'];
    category = 'typography';
    icon = 'view-list';
    matcher(node: HTMLElement) {
        return node.nodeName === 'DL';
    }
}

export class BlockquoteEl extends ArchitectTextEl {
    name = 'blockquote';
    html = `<blockquote><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p><footer>Someone famous in <cite title="Source Title">Source Title</cite></footer></blockquote>`;
    contentCategories = ['flow', 'sectioning root'];
    allowedContent = ['flow'];
    category = 'typography';
    icon = 'format-quote';
    matcher(node: HTMLElement) {
        return node.nodeName === 'BLOCKQUOTE';
    }
}

export class ListItemEl extends ArchitectTextEl {
    name = 'list item';
    html = '<li>A basic list item</li>';
    contentCategories = ['li'];
    allowedContent = ['flow'];
    matcher(node: HTMLElement) {
        return node.nodeName === 'LI';
    }
}

export class UnorderedListEl extends ArchitectElement {
    name = 'unordered list';
    html =
        '<ul><li>List item #1</li><li>List item #2</li><li>List item #3</li><ul>';
    contentCategories = ['flow'];
    allowedContent = ['li'];
    category = 'typography';
    icon = 'format-list-bulleted';
    matcher(node: HTMLElement) {
        return node.nodeName === 'UL';
    }
}

export class BodyEl extends ArchitectElement {
    name = 'body';
    contentCategories = ['flow'];
    allowedContent = ['flow'];
    contextMenu = false;
    matcher(node: HTMLElement) {
        if (node.nodeName === 'HTML') {
            return node.querySelector('body');
        }
        return node.nodeName === 'BODY';
    }
}

export class ButtonEl extends ArchitectTextEl {
    name = 'button';
    html = '<a class="btn btn-success">Click Me</a>';
    contentCategories = [
        'flow',
        'phrasing',
        'interactive',
        'listed',
        'labelable',
        'submittable',
        'reassociateable',
        'form-associated',
    ];
    allowedContent = ['phrasing'];
    category = 'buttons';
    icon = 'button-custom';
    matcher(node: HTMLElement) {
        return node.nodeName === 'BUTTON' || node.classList.contains('btn');
    }
}

export class DivContainerEl extends ArchitectTextEl {
    name = 'div container';
    html = '<div></div>';
    contentCategories = ['flow'];
    allowedContent = ['flow'];
    category = 'layout';
    icon = 'crop-landscape';
    matcher(node: HTMLElement) {
        return node.nodeName === 'DIV';
    }
}

export class SectionEl extends ArchitectElement {
    name = 'section';
    html = '<section></section>';
    contentCategories = ['flow'];
    allowedContent = ['flow'];
    matcher(node: HTMLElement) {
        return node.nodeName === 'SECTION';
    }
}

export class FooterEl extends ArchitectElement {
    name = 'footer';
    html = '<footer></footer>';
    contentCategories = ['flow'];
    allowedContent = ['flow'];
    matcher(node: HTMLElement) {
        return node.nodeName === 'FOOTER';
    }
}

export class HeaderEl extends ArchitectElement {
    name = 'header';
    html = '<header>Header Text</header>';
    contentCategories = ['flow'];
    allowedContent = ['flow'];
    matcher(node: HTMLElement) {
        return node.nodeName === 'HEADER';
    }
}

export class HeadingEl extends ArchitectTextEl {
    name = 'heading';
    html = '<h2>Heading</h2>';
    contentCategories = ['heading', 'flow'];
    allowedContent = ['phrasing'];
    category = 'typography';
    icon = 'format-size';
    controls = [
        new ArchitectElControl(this.injector, {
            label: 'Type',
            type: ElControlType.Select,
            options: [
                {key: 'h1', value: 'h1'},
                {key: 'h2', value: 'h2'},
                {key: 'h3', value: 'h3'},
                {key: 'h4', value: 'h4'},
                {key: 'h5', value: 'h5'},
                {key: 'h6', value: 'h6'},
            ],
            defaultValue: (node: HTMLElement) => {
                return node.nodeName.toLowerCase() || 'h1';
            },
            onChange: (node: HTMLElement, value: string) => {
                const nodeId = getNodeId(node);
                const executed = this.get(MutationsService).execute(
                    new RenameNode(node, value)
                );
                if (executed) {
                    this.get(LivePreview).setSelectedContext(nodeId);
                    this.get(ContextBoxes).repositionBox(
                        ContextType.Selected,
                        this.get(BuilderStateService).selected.node
                    );
                }
            },
        }),
    ];
    matcher(node: HTMLElement) {
        return ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(node.nodeName);
    }
}

export class IconEl extends ArchitectElement {
    name = 'icon';
    contentCategories = ['flow', 'phrasing'];
    allowedContent = [];
    canDrag = true;
    canEdit = [EditableProp.Attributes];
    controls = [
        new ArchitectElControl(this.injector, {
            label: 'Size',
            type: ElControlType.Select,
            options: [
                {key: 'Default', value: 'default'},
                {key: 'Large', value: 'fa-lg'},
                {key: '2x', value: 'fa-2x'},
                {key: '3x', value: 'fa-3x'},
                {key: '4x', value: 'fa-4x'},
                {key: '5x', value: 'fa-5x'},
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

    editActions = [{
        name: 'Change Icon',
        onClick: (node: HTMLElement) => {
            this.get(BuilderOverlayService)
                .open(IconSelectorOverlayComponent, null, node)
                .afterClosed()
                .subscribe(icon => {
                    if (icon) {
                        let className = node.getAttribute('class');
                        className = className
                            .replace(/fa fa.+?($| )/, icon + ' ')
                            .replace(/glyphicon glyphicon.+?($| )/, icon + ' ')
                            .replace(/icon-.+? /, icon + ' ');
                        this.get(MutationsService).execute(
                            new ModifyAttributes(node, {
                                class: className,
                            })
                        );
                    }
                });
        }
    }];
    matcher(node: HTMLElement) {
        return (
            node.nodeName === 'I' ||
            node.className.includes('icon-') ||
            node.classList.contains('svg-inline--fa')
        );
    }
}

export class GenericEl extends ArchitectTextEl {
    name = 'generic';
    contentCategories = ['flow', 'phrasing'];
    allowedContent = [];
    canDrag = false;
    canEdit = [EditableProp.Text, EditableProp.Attributes];
    matcher(node: HTMLElement) {
        return ['EM', 'STRONG', 'U', 'S', 'SMALL'].includes(node.nodeName);
    }
}

export class LabelEl extends ArchitectTextEl {
    name = 'label';
    contentCategories = ['fow', 'phrasing'];
    allowedContent = [];
    canDrag = false;
    canEdit = [EditableProp.Text, EditableProp.Attributes];
    matcher(node: HTMLElement) {
        return node.nodeName === 'LABEL';
    }
}

export class SvgEl extends ArchitectElement {
    name = 'svg';
    matcher(node: HTMLElement) {
        return node.closest('svg') as unknown as HTMLElement;
    }
}
