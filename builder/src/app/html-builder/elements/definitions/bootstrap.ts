import {
    ArchitectElControl,
    ArchitectElement,
    ArchitectTextEl,
    EditableProp,
    ElControlType,
} from '../architect-element';
import {hasClass} from '../../utils/has-class';
import {openUploadWindow} from '@common/uploads/utils/open-upload-window';
import {UploadInputTypes} from '@common/uploads/upload-input-config';
import {ActiveProject} from '../../projects/active-project';
import {UploadQueueService} from '@common/uploads/upload-queue/upload-queue.service';
import {ContextBoxes} from '../../live-preview/context-box/context-boxes.service';
import {MutationsService} from '../../mutations/mutations.service';
import {
    ModifyAttributes,
    NodeAttributes,
} from '../../mutations/attributes/modify-attributes';
import {LinkEditor} from '../../overlays/link-editor/link-editor.service';
import {ReplaceClass} from '../../mutations/attributes/replace-class';
import {ContextType} from '../../live-preview/context-box/builder-context';
import {FileEntry} from '@common/uploads/types/file-entry';
import {isAbsoluteUrl} from '@common/core/utils/is-absolute-url';
import {InlineTextEditor} from '../../overlays/inline-text-editor/inline-text-editor.service';

export class PageHeaderEl extends ArchitectElement {
    name = 'page header';
    html = `<div class="page-header"><h1>Example page header <small>Header subtext</small></h1></div>`;
    contentCategories = ['flow'];
    allowedContent = ['flow'];
    category = 'typography';
    icon = 'header-custom';
    specificity = 1;
    matcher(node: HTMLElement) {
        return hasClass(node, 'page-header');
    }
}

export class ProgressBarEl extends ArchitectElement {
    name = 'progress bar';
    html = `<div class="progress">
<div class="progress-bar" role="progressbar" style="width: 50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
</div>`;
    contentCategories = ['flow'];
    allowedContent = ['flow'];
    category = 'components';
    icon = 'show-chart';
    specificity = 1;
    matcher(node: HTMLElement) {
        if (hasClass(node, 'progress')) {
            return node;
        } else if (hasClass(node.parentElement, 'progress')) {
            return node.parentElement;
        }
    }
}

export class ListGroupEl extends ArchitectElement {
    name = 'list group';
    html = `<ul class="list-group">
<li class="list-group-item">Cras justo odio</li>
<li class="list-group-item">Dapibus ac facilisis in</li>
<li class="list-group-item">Morbi leo risus</li>
<li class="list-group-item">Porta ac consectetur ac</li>
<li class="list-group-item">Vestibulum at eros</li>
</ul>`;
    contentCategories = ['flow'];
    allowedContent = ['flow'];
    category = 'components';
    icon = 'view-list';
    specificity = 1;
    matcher(node: HTMLElement) {
        return hasClass(node, 'list-group');
    }
}

export class CardEl extends ArchitectElement {
    name = 'card';
    html = `<div class="card" style="width: 18rem;">
<img src="https://via.placeholder.com/286x160?text=Placeholder%20Image" class="card-img-top" alt="">
<div class="card-body">
<h5 class="card-title">Card title</h5>
<p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
<a href="#" class="btn btn-primary">Go somewhere</a>
</div>
</div>`;
    contentCategories = ['flow'];
    allowedContent = ['flow'];
    category = 'components';
    icon = 'crop-portrait';
    specificity = 1;
    matcher(node: HTMLElement) {
        return hasClass(node, 'card');
    }
}

export class AlertEl extends ArchitectTextEl {
    name = 'alert';
    html = `<div class="alert alert-primary" role="alert">
A simple primary alert—check it out!
</div>`;
    contentCategories = ['flow'];
    allowedContent = ['flow'];
    category = 'layout';
    icon = 'label';
    specificity = 1;
    matcher(node: HTMLElement) {
        return hasClass(node, 'well');
    }
}

export class BadgeEl extends ArchitectTextEl {
    name = 'Badge';
    html = '<span class="label label-success">Success</span>';
    contentCategories = ['flow', 'phrasing'];
    allowedContent = ['phrasing'];
    category = 'typography';
    hiddenClasses = ['label'];
    icon = 'label';
    specificity = 1;
    matcher(node: HTMLElement) {
        return hasClass(node, 'label');
    }
}

export class ButtonGroupEl extends ArchitectElement {
    name = 'button group';
    html = `<div class="btn-group" role="group" aria-label="Basic example">
  <button type="button" class="btn btn-secondary">Left</button>
  <button type="button" class="btn btn-secondary">Middle</button>
  <button type="button" class="btn btn-secondary">Right</button>
</div>`;
    contentCategories = ['flow'];
    allowedContent = ['button'];
    category = 'buttons';
    icon = 'view-column';
    specificity = 1;
    matcher(node: HTMLElement) {
        return hasClass(node, 'btn-group');
    }
}

export class ButtonToolbarEl extends ArchitectElement {
    name = 'button toolbar';
    html = `<div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
  <div class="btn-group mr-2" role="group" aria-label="First group">
    <button type="button" class="btn btn-secondary">1</button>
    <button type="button" class="btn btn-secondary">2</button>
    <button type="button" class="btn btn-secondary">3</button>
    <button type="button" class="btn btn-secondary">4</button>
  </div>
  <div class="btn-group mr-2" role="group" aria-label="Second group">
    <button type="button" class="btn btn-secondary">5</button>
    <button type="button" class="btn btn-secondary">6</button>
    <button type="button" class="btn btn-secondary">7</button>
  </div>
  <div class="btn-group" role="group" aria-label="Third group">
    <button type="button" class="btn btn-secondary">8</button>
  </div>
</div>`;
    contentCategories = ['flow'];
    allowedContent = ['.btn-group'];
    category = 'buttons';
    icon = 'view-module';
    specificity = 1;
    matcher(node: HTMLElement) {
        return hasClass(node, 'btn-toolbar');
    }
}

// forms

export class InputFieldEl extends ArchitectElement {
    name = 'input field';
    html = '<input type="text" class="form-control" placeholder="Text input">';
    contentCategories = [
        'flow',
        'phrasing',
        'interactive',
        'listed',
        'labelable',
        'submittable',
        'resettable',
        'reassociateable',
        'form-associated',
    ];
    allowedContent = [];
    hiddenClasses = ['form-control'];
    category = 'forms';
    icon = 'power-input';
    controls = [
        new ArchitectElControl(this.injector, {
            label: 'Type',
            type: ElControlType.Select,
            options: [
                {key: 'Text', value: 'text'},
                {key: 'Password', value: 'password'},
                {key: 'Date', value: 'date'},
                {key: 'Email', value: 'email'},
                {key: 'Datetime', value: 'datetime'},
                {key: 'Datetime Local', value: 'datetime-local'},
                {key: 'Month', value: 'month'},
                {key: 'Time', value: 'time'},
                {key: 'Week', value: 'week'},
                {key: 'Number', value: 'number'},
                {key: 'Url', value: 'url'},
                {key: 'Search', value: 'search'},
                {key: 'Tel', value: 'tel'},
                {key: 'Color', value: 'color'},
            ],
            defaultValue(node: HTMLInputElement) {
                return node.type || this.options[0].value;
            },
            onChange(node: HTMLElement, value: string) {
                this.get(MutationsService).execute(
                    new ModifyAttributes(node, {
                        type: value,
                    })
                );
            },
        }),
        new ArchitectElControl(this.injector, {
            label: 'Placeholder',
            type: ElControlType.Input,
            defaultValue(node: HTMLInputElement) {
                return node.placeholder || 'Text input';
            },
            onChange(node: HTMLElement, value: string) {
                this.get(MutationsService).execute(
                    new ModifyAttributes(node, {
                        placeholder: value,
                    })
                );
            },
        }),
    ];
    specificity = 1;
    matcher(node: HTMLElement) {
        const excludedTypes = [
            'button',
            'checkbox',
            'hidden',
            'image',
            'radio',
            'range',
            'reset',
            'submit',
        ];
        return (
            node.nodeName === 'INPUT' &&
            !excludedTypes.includes((node as HTMLInputElement).type)
        );
    }
}

export class TextAreaEl extends ArchitectElement {
    name = 'text area';
    html = '<textarea class="form-control" rows="3"></textarea>';
    contentCategories = [
        'flow',
        'phrasing',
        'interactive',
        'listed',
        'labelable',
        'submittable',
        'resettable',
        'reassociateable',
        'form-associated',
    ];
    allowedContent = [];
    hiddenClasses = ['form-control'];
    category = 'forms';
    icon = 'short-text';
    controls = [
        new ArchitectElControl(this.injector, {
            label: 'Text Rows',
            type: ElControlType.Input,
            inputType: 'number',
            defaultValue(node: HTMLInputElement) {
                return node.getAttribute('rows') || '3';
            },
            onChange(node: HTMLElement, value: string) {
                this.get(MutationsService).execute(
                    new ModifyAttributes(node, {
                        rows: value,
                    })
                );
            },
        }),
        new ArchitectElControl(this.injector, {
            label: 'Placeholder',
            type: ElControlType.Input,
            defaultValue(node: HTMLInputElement) {
                return node.placeholder || 'Text input';
            },
            onChange(node: HTMLElement, value: string) {
                this.get(MutationsService).execute(
                    new ModifyAttributes(node, {
                        placeholder: value,
                    })
                );
            },
        }),
    ];
    specificity = 1;
    matcher(node: HTMLElement) {
        return node.nodeName === 'TEXTAREA';
    }
}

export class CheckboxEl extends ArchitectElement {
    name = 'checkbox';
    html = `<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
  <label class="form-check-label" for="flexCheckDefault">
    Default checkbox
  </label>
</div>`;
    contentCategories = [
        'flow',
        'phrasing',
        'interactive',
        'listed',
        'labelable',
        'submittable',
        'resettable',
        'reassociateable',
        'form-associated',
    ];
    allowedContent = [];
    category = 'forms';
    icon = 'check-box';
    specificity = 1;
    matcher(node: HTMLElement) {
        return hasClass(node, 'form-check');
    }
}

export class InputGroupEl extends ArchitectElement {
    name = 'input group';
    html = `<div class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text">@</div>
        </div>
        <input type="text" class="form-control" placeholder="Username">
      </div>`;
    contentCategories = ['flow'];
    allowedContent = [];
    controls = [
        new ArchitectElControl(this.injector, {
            label: 'Size',
            type: ElControlType.Select,
            options: [
                {key: 'Medium', value: 'default'},
                {key: 'Large', value: 'input-group-lg'},
                {key: 'Small', value: 'input-group-sm'},
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
    category = 'forms';
    icon = 'view-list';
    hiddenClasses = ['input-group'];
    specificity = 1;
    matcher(node: HTMLElement) {
        return hasClass(node, 'input-group');
    }
}

export class FormGroupEl extends ArchitectElement {
    name = 'form group';
    html = `<div class="form-group"><label for="email" class="control-label">Email address</label><input type="email" class="form-control" id="email" placeholder="Enter email"></div>`;
    contentCategories = ['flow'];
    allowedContent = [];
    controls = [
        new ArchitectElControl(this.injector, {
            label: 'State',
            type: ElControlType.Select,
            options: [
                {key: 'None', value: 'default'},
                {key: 'Error', value: 'has-error'},
                {key: 'Success', value: 'has-success'},
                {key: 'Warning', value: 'has-warning'},
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
    category = 'forms';
    icon = 'view-headline';
    hiddenClasses = ['form-group'];
    specificity = 1;
    matcher(node: HTMLElement) {
        return hasClass(node, 'form-group');
    }
}

export class LinkEl extends ArchitectTextEl {
    name = 'link';
    html = '<a href="#">A simple hyperlink.</a>';
    contentCategories = ['flow', 'phrasing', 'interactive'];
    allowedContent = ['phrasing'];
    category = 'typography';
    icon = 'link';
    specificity = 1;
    editActions = [
        {
            name: 'Change Link',
            onClick: (node: HTMLLinkElement) => {
                this.get(LinkEditor)
                    .open(node, node)
                    .valueChanged()
                    .subscribe((value: NodeAttributes) => {
                        if (value) {
                            this.get(MutationsService).execute(
                                new ModifyAttributes(node, value)
                            );
                        }
                    });
            },
        },
        {
            name: 'Edit Text',
            onClick: (node: HTMLElement) => {
                this.get(InlineTextEditor).open(node);
            }
        },
    ];
    matcher(node: HTMLElement) {
        return node.nodeName === 'A';
    }
}

export class AddonEl extends ArchitectElement {
    name = 'addon';
    canDrag = false;
    contentCategories = ['flow'];
    allowedContent = [];
    canEdit = [EditableProp.Text, EditableProp.Attributes];
    hiddenClasses = ['input-group-addon'];
    specificity = 1;
    matcher(node: HTMLElement) {
        return hasClass(node, 'input-group-addon');
    }
}

export class SelectEl extends ArchitectElement {
    name = 'select';
    html = `<select class="form-control">
<option>1</option>
<option>2</option>
<option>3</option>
<option>4</option>
<option>5</option>
</select>`;
    contentCategories = [
        'flow',
        'phrasing',
        'interactive',
        'listed',
        'labelable',
        'submittable',
        'resettable',
        'reassociateable',
        'form-associated',
    ];
    allowedContent = [];
    category = 'forms';
    icon = 'arrow-drop-down';
    specificity = 1;
    matcher(node: HTMLElement) {
        return node.nodeName === 'SELECT';
    }
}

export class ImageEl extends ArchitectElement {
    name = 'image';
    html = `<img src="/assets/images/builder/default.jpg" class="img-responsive" alt="">`;
    contentCategories = [
        'flow',
        'phrasing',
        'embedded',
        'interactive',
        'form-associated',
    ];
    allowedContent = [];
    category = 'media';
    icon = 'image';
    canEdit = [
        EditableProp.Padding,
        EditableProp.Margin,
        EditableProp.Attributes,
        EditableProp.Shadow,
        EditableProp.Border,
    ];
    controls = [
        new ArchitectElControl(this.injector, {
            label: 'Shape',
            type: ElControlType.Select,
            options: [
                {key: 'Default', value: 'none'},
                {key: 'Rounded', value: 'img-rounded'},
                {key: 'Thumbnail', value: 'img-thumbnail'},
                {key: 'Circle', value: 'img-circle'},
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
    specificity = 1;
    matcher(node: HTMLElement) {
        return node.nodeName === 'IMG';
    }
    editActions = [
        {
            name: 'Change Image',
            onClick: (node: HTMLImageElement) => {
                const diskPrefix = `${this.get(ActiveProject).getBaseUrl(
                    true
                )}images`;
                const config = {
                    uri: 'uploads/images',
                    httpParams: {diskPrefix},
                };
                openUploadWindow({types: [UploadInputTypes.image]}).then(
                    files => {
                        this.get(UploadQueueService)
                            .start(files, config)
                            .subscribe(response => {
                                this.get(MutationsService).execute(
                                    new ModifyAttributes(node, {
                                        src: this.getImageUrl(
                                            response.fileEntry
                                        ),
                                    })
                                );
                                this.get(ContextBoxes).hideBox(
                                    ContextType.Hover
                                );
                            });
                    }
                );
            },
        },
    ];
    private getImageUrl(entry: FileEntry) {
        if (isAbsoluteUrl(entry.url)) {
            return entry.url;
        } else {
            const path = this.get(ActiveProject).getBaseUrl(true) + 'images';
            // project will already have full project path as "base url", only need relative path from "images" folder
            return entry.url.replace(`storage/${path}`, 'images');
        }
    }
}

export class ResponsiveVideoEl extends ArchitectElement {
    name = 'responsive video';
    html =
        '<div class="embed-responsive embed-responsive-16by9"><iframe class="embed-responsive-item" src="//www.youtube.com/embed/sENM2wA_FTg"></iframe></div>';
    contentCategories = ['flow'];
    allowedContent = [];
    category = 'media';
    icon = 'video-library';
    canEdit = [
        EditableProp.Padding,
        EditableProp.Margin,
        EditableProp.Shadow,
        EditableProp.Attributes,
    ];
    controls = [
        new ArchitectElControl(this.injector, {
            label: 'Url',
            type: ElControlType.Input,
            defaultValue(node: HTMLInputElement) {
                return (
                    node.querySelector('iframe')?.src ||
                    '//www.youtube.com/embed/wGp0GAd1d1s'
                );
            },
            onChange(node: HTMLElement, value: string) {
                const iframe = node.querySelector('iframe');
                this.get(MutationsService).execute(
                    new ModifyAttributes(iframe, {
                        src: value,
                    })
                );
            },
        }),
    ];
    hiddenClasses = [
        'embed-responsive',
        'embed-responsive-16by9',
        'preview-node',
        'img-responsive',
    ];
    specificity = 1;
    matcher(node: HTMLElement) {
        return node.closest('.embed-responsive') as HTMLElement;
    }
}

export class ImageGridEl extends ArchitectElement {
    name = 'image grid';
    html = `<div class="row image-grid">
    <div class="col-xs-3">
        <a href="#" class="thumbnail"><img src="/assets/images/builder/default.jpg"></a>
    </div>
    <div class="col-xs-3">
        <a href="#" class="thumbnail"><img src="/assets/images/builder/default.jpg"></a>
    </div>
    <div class="col-xs-3">
        <a href="#" class="thumbnail"><img src="/assets/images/builder/default.jpg"></a>
    </div>
    <div class="col-xs-3">
        <a href="#" class="thumbnail"><img src="/assets/images/builder/default.jpg"></a>
    </div>
</div>`;
    contentCategories = ['flow'];
    allowedContent = [];
    category = 'media';
    icon = 'grid-on';
    canEdit = [
        EditableProp.Padding,
        EditableProp.Margin,
        EditableProp.Shadow,
        EditableProp.Attributes,
    ];
    specificity = 1;
    matcher(node: HTMLElement) {
        return hasClass(node, 'image-grid');
    }
}
