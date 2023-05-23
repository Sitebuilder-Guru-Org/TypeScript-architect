import {
    Component,
    ElementRef,
    Inject,
    OnDestroy,
    OnInit,
    Optional,
    ViewChild,
} from '@angular/core';
import {OverlayPanelRef} from '@common/core/ui/overlay-panel/overlay-panel-ref';
import {BehaviorSubject, fromEvent, Subscription} from 'rxjs';
import {BuilderStateService} from '../../builder-state.service';
import {MutationsService} from '../../mutations/mutations.service';
import {ReplaceNodeContent} from '../../mutations/dom/replace-node-content';
import {LinkEditor} from '../link-editor/link-editor.service';
import {LinkEditorValue} from '../link-editor/link-editor.component';
import {GoogleFontSelectorValue} from '@common/shared/form-controls/google-font-selector/google-font-selector.component';
import {debounceTime, startWith} from 'rxjs/operators';
import {MatButton} from '@angular/material/button';
import {ColorpickerPanelComponent} from '@common/core/ui/color-picker/colorpicker-panel.component';
import {FontSelectorOverlayComponent} from '../font-selector-overlay/font-selector-overlay.component';
import {IconSelectorOverlayComponent} from '../icon-selector-overlay/icon-selector-overlay.component';
import {BuilderOverlayService} from '../builder-overlay.service';

interface CurrentState {
    fontSize?: number;
    fontName?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    link?: boolean;
    textAlign?: string;
    color?: string;
}

@Component({
    selector: 'inline-text-editor',
    templateUrl: './inline-text-editor.component.html',
    styleUrls: ['./inline-text-editor.component.scss'],
})
export class InlineTextEditorComponent implements OnInit, OnDestroy {
    @ViewChild('iconBtn', {read: ElementRef}) iconBtn: ElementRef<HTMLElement>;
    currentState = new BehaviorSubject<CurrentState>({});

    private lastCommand: {
        name: string;
        value: string | LinkEditorValue;
    };

    private oldContent: string;
    private observer: MutationObserver;
    private pickerSub: Subscription;
    private selectionSub: Subscription;

    constructor(
        private mutations: MutationsService,
        private state: BuilderStateService,
        private linkEditor: LinkEditor,
        private el: ElementRef<HTMLElement>,
        private panel: BuilderOverlayService,
        @Inject(OverlayPanelRef) @Optional() public overlayRef: OverlayPanelRef
    ) {}

    private selection(): Selection {
        return this.state.previewDoc.getSelection();
    }

    ngOnInit() {
        this.selectionSub = fromEvent(this.state.previewDoc, 'selectionchange')
            // won't fire without "startWith" until cursor is moved
            .pipe(debounceTime(500), startWith(null))
            .subscribe(() => {
                const parent = this.selection().anchorNode
                    .parentNode as HTMLElement;
                const style = window.getComputedStyle(parent);
                this.currentState.next({
                    fontSize: parseInt(style.fontSize),
                    fontName: style.fontFamily,
                    bold: parseInt(style.fontWeight) >= 500,
                    underline: style.textDecoration.includes('underline'),
                    color: style.color,
                    strikethrough:
                        style.textDecoration.includes('line-through'),
                    italic: style.fontStyle === 'italic',
                    textAlign: style.textAlign,
                });
            });

        const config = {attributes: true, childList: true, subtree: true};

        this.observer = new MutationObserver(mutations => {
            mutations.forEach(m => {
                const node = (m.addedNodes[0] || m.target) as HTMLElement;

                if (
                    (m.addedNodes[0]?.nodeName === 'FONT' ||
                        m.attributeName === 'size') &&
                    node.getAttribute('size')
                ) {
                    node.removeAttribute('size');
                    node.style.fontSize = this.lastCommand.value + 'px';
                } else if (m.addedNodes[0]?.nodeName === 'A') {
                    const v = this.lastCommand.value as LinkEditorValue;
                    Object.entries(v).forEach(([prop, value]) => {
                        node.setAttribute(prop, value);
                    });
                }
            });
        });

        this.observer.observe(this.state.editableNode, config);

        this.oldContent = this.state.editableNode.innerHTML;
    }

    ngOnDestroy() {
        this.pickerSub?.unsubscribe();
        this.selectionSub?.unsubscribe();
        this.makeNodesNotEditable();
        this.observer.disconnect();
        this.mutations.execute(
            new ReplaceNodeContent(
                this.state.editableNode,
                this.oldContent,
                this.state.editableNode.innerHTML
            )
        );
        this.state.editableNode = null;
    }

    execCommand(command: string, value?: string | LinkEditorValue) {
        // these will operate on the whole "contenteditable" element
        if (
            !command.startsWith('justify') &&
            !command.endsWith('List') &&
            !command.endsWith('dent') &&
            command !== 'insertHtml'
        ) {
            this.maybeExpandSelection();
        }
        this.lastCommand = {name: command, value};
        if (command === 'createLink') {
            value = (value as LinkEditorValue).href;
            if (!value) {
                command = 'unlink';
            }
        }
        this.state.previewDoc.execCommand(command, false, value as string);
    }

    private makeNodesNotEditable() {
        const nodes =
            this.state.previewDoc.querySelectorAll('[contenteditable]');
        nodes.forEach((node: HTMLElement) => {
            node.removeAttribute('contenteditable');
            node.blur();
        });
    }

    shouldEnableLinkBtn() {
        // prevent adding links <a> to button elements
        const node = this.state.selected.node;
        return node && node.nodeName.toLowerCase() !== 'button';
    }

    openIconPicker() {
        this.panel
            .open(IconSelectorOverlayComponent, null, this.iconBtn.nativeElement)
            .afterClosed()
            .subscribe(icon => {
                if (icon) {
                    this.insertIcon(icon);
                }
            });
    }

    openLinkEditor() {
        this.linkEditor
            .open(this.el.nativeElement)
            .afterClosed()
            .subscribe((value: LinkEditorValue) => {
                if (value) {
                    this.execCommand('createLink', value);
                }
            });
    }

    openFontPicker() {
        const panelRef = this.panel.open(FontSelectorOverlayComponent, this.el);
        panelRef.valueChanged().subscribe((value: GoogleFontSelectorValue) => {
            panelRef.close();
            this.execCommand('fontName', value.family);
        });
    }

    private insertIcon(icon: string) {
        this.execCommand('insertHtml', '<span class="' + icon + '"></span>');
    }

    openColorPicker(command: string, origin: MatButton) {
        this.pickerSub = this.panel
            .open(
                ColorpickerPanelComponent,
                {color: this.currentState.value.color},
                origin._elementRef.nativeElement,
            )
            .valueChanged()
            .subscribe(color => {
                this.execCommand(command, color);
            });
    }

    private maybeExpandSelection() {
        // if nothing is highlighted currently, bail
        const selection = this.selection();
        if (!selection.isCollapsed) return;

        // if caret is at the start, select all text content
        if (selection.anchorOffset === 0) {
            selection.getRangeAt(0).selectNode(selection.anchorNode);
        } else {
            // expand selection to word under caret
            selection.modify('move', 'backward', 'word');
            selection.modify('extend', 'forward', 'word');
        }
    }
}
