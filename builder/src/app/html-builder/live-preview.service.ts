import {Injectable, NgZone} from '@angular/core';
import {Elements} from './elements/elements.service';
import {InlineTextEditor} from './overlays/inline-text-editor/inline-text-editor.service';
import {ActiveProject} from './projects/active-project';
import {ContextMenu} from '@common/core/ui/context-menu/context-menu.service';
import {LivePreviewContextMenuComponent} from './overlays/live-preview-context-menu/live-preview-context-menu.component';
import {Keybinds} from '@common/core/keybinds/keybinds.service';
import {ContextBoxes} from './live-preview/context-box/context-boxes.service';
import {LinkEditor} from './overlays/link-editor/link-editor.service';
import {BuilderDocumentActions} from './builder-document-actions.service';
import {BuilderStateService} from './builder-state.service';
import {nodeOrParentEditable} from './utils/node-or-parent-editable';
import {getScrollTop} from './utils/get-scroll-top';
import {MutationsService} from './mutations/mutations.service';
import {Settings} from '@common/core/config/settings.service';
import {findNodeById} from './utils/find-nodes-by-id';
import {ContextType, SelectedContext} from './live-preview/context-box/builder-context';
import {skip} from 'rxjs/operators';
import {createLinkEl} from './utils/create-link-el';

@Injectable({
    providedIn: 'root',
})
export class LivePreview {
    private hammer: HammerManager;
    constructor(
        public zone: NgZone,
        public elements: Elements,
        public textEditor: InlineTextEditor,
        public parsedProject: ActiveProject,
        public contextMenu: ContextMenu,
        public keybinds: Keybinds,
        public contextBoxes: ContextBoxes,
        public activeProject: ActiveProject,
        public linkEditor: LinkEditor,
        public actions: BuilderDocumentActions,
        public state: BuilderStateService,
        public mutations: MutationsService,
        public settings: Settings
    ) {}

    init() {
        this.state.iframe.onload = () => this.onIframeLoad();
        this.state.activePage$.subscribe(page => {
            this.state.iframe.srcdoc = this.buildSrcDoc(page.doc);
        });

        this.bindToUndoCommandExecuted();
        this.registerKeybinds();

        this.state.dragging$.pipe(skip(1)).subscribe(isDragging => {
            if (isDragging) {
                this.state.previewDoc.body.classList.add('dragging');
            } else {
                this.state.previewDoc.body.classList.remove('dragging');
            }
        });

        this.state.previewContainer.addEventListener(
            'mouseleave',
            () => {
                this.contextBoxes.hideBox(ContextType.Hover);
            },
            {passive: true}
        );
    }

    repositionBox(type: ContextType) {
        const context = this.state.getContext(type);
        if (context) {
            this.contextBoxes.repositionBox(type, context.node);
        }
    }

    setHoverContext(node: HTMLElement) {
        if (node === this.state.hover$.value?.node) return;
        const match = this.elements.match(node);
        if (match) {
            this.state.hover$.next({
                el: match.el,
                node: match.node,
            });
            this.repositionBox(ContextType.Hover);
        }
    }

    setSelectedContext(node: HTMLElement | string) {
        if (typeof node === 'string') {
            node = findNodeById(node, this.state.previewDoc);
        }

        if (
            node?.nodeType !== Node.ELEMENT_NODE ||
            this.state.selected$.value?.node === node
        ) {
            return;
        }

        const match = this.elements.match(node);
        console.log(match);
        if (!match) return;

        const context: Partial<SelectedContext> = {
            path: [],
        };

        context.el = match.el;
        context.node = match.node;

        // create an array from all parents of this node
        let parentNode = context.node;
        while (
            parentNode?.nodeType === Node.ELEMENT_NODE &&
            parentNode.nodeName.toLowerCase() !== 'body'
        ) {
            context.path.unshift({
                node: parentNode,
                name: this.elements.getDisplayName(
                    this.elements.match(parentNode)?.el,
                    parentNode
                ),
            });
            parentNode = parentNode.parentElement;
        }

        this.state.selected$.next(context as SelectedContext);
        this.repositionBox(ContextType.Selected);
        this.state.inspectorPanel$.next(context.el.defaultInspectorPanel);
    }

    private onIframeLoad() {
        this.state.previewDoc = this.state.iframe.contentDocument;
        this.state.loading$.next(true);
        this.contextBoxes.hideBoxes();
        this.state.previewDoc.body.scrollTop = 0;
        this.addIframeCss();
        this.bindToIframeEvents();

        // wait until all css stylesheets are loaded
        const links = Array.from(
            this.state.previewDoc.head.querySelectorAll('link')
        );
        const promises = links
            .filter(link => link.href.endsWith('.css') && !link.sheet)
            .map(link => {
                return new Promise(r => link.addEventListener('load', r));
            });

        return Promise.all(promises).then(() => {
            this.state.loading$.next(false);
            this.state.previewDocReloaded$.next(true);
        });
    }

    private bindToUndoCommandExecuted() {
        this.mutations.executed$.subscribe(() => {
            this.repositionBox(ContextType.Selected);
            this.contextBoxes.hideBox(ContextType.Hover);
        });
    }

    private bindToIframeEvents() {
        if (this.hammer) {
            this.hammer.destroy();
        }
        this.hammer = new Hammer.Manager(this.state.previewDoc);
        const doubleTap = new Hammer.Tap({event: 'double_tap', taps: 2});

        this.hammer.add(doubleTap);

        this.listenForHover();
        this.listenForClick();
        this.listenForDoubleClick(this.hammer);
        this.listenForContextMenu();
        this.keybinds.listenOn(this.state.previewDoc);

        this.state.previewDoc.addEventListener(
            'scroll',
            () => {
                this.contextBoxes.hideBox(ContextType.Hover);
                if (this.state.selected?.node) {
                    this.repositionBox(ContextType.Selected);
                }
                this.textEditor.close();
                this.contextMenu.close();
            },
            true
        );
    }

    private registerKeybinds() {
        this.keybinds.add('ctrl+shift+x', () =>
            this.actions.cutNode(this.state.selected?.node)
        );
        this.keybinds.add('ctrl+shift+c', () =>
            this.actions.copyNode(this.state.selected?.node)
        );
        this.keybinds.add('ctrl+shift+v', () =>
            this.actions.pasteNode(this.state.selected?.node)
        );
        this.keybinds.add('ctrl+z', () => this.mutations.undo());
        this.keybinds.add('ctrl+y', () => this.mutations.redo());
        this.keybinds.add('arrow_up', e => {
            if (
                this.state.selected?.node &&
                !this.state.selected.node.getAttribute('contentEditable')
            ) {
                this.actions.moveSelected('up');
                e.preventDefault();
            }
        });
        this.keybinds.add('arrow_down', e => {
            if (
                this.state.selected?.node &&
                !this.state.selected.node.getAttribute('contentEditable')
            ) {
                this.actions.moveSelected('down');
                e.preventDefault();
            }
        });
        this.keybinds.add('delete', () => {
            this.actions.removeNode(this.state.selected?.node);
        });
    }

    private listenForHover() {
        this.state.previewDoc.addEventListener('mousemove', e => {
            this.zone.run(() => {
                if (this.state.dragging$.value) return;
                const node = this.state.previewDoc.elementFromPoint(
                    e.pageX,
                    e.pageY - getScrollTop(this.state.previewDoc)
                ) as HTMLElement;
                this.setHoverContext(node);
            });
        });
    }

    private listenForContextMenu() {
        this.state.previewDoc.addEventListener('contextmenu', e => {
            this.zone.run(() => {
                e.preventDefault();
                if (this.state.editableNode) return;
                this.setSelectedContext(e.target as HTMLElement);
                if (!this.state.selected.el.contextMenu) return;
                this.contextMenu.open(LivePreviewContextMenuComponent, e, {
                    offsetX:
                        this.state.inspectorEl.getBoundingClientRect().width,
                });
            });
        });
    }

    private listenForClick() {
        this.state.previewDoc.addEventListener(
            'click',
            e => {
                this.zone.run(() => {
                    const node = e.target as HTMLElement;

                    this.handleLinkClick(e);
                    this.handleFormSubmitButtonClick(e);

                    this.state.previewDoc.body.focus();

                    // node is already selected, bail
                    if (this.state.selected?.node === node) return true;

                    // node text is being edited, bail
                    if (nodeOrParentEditable(node)) return;

                    this.contextMenu.close();
                    this.textEditor.close();
                    this.linkEditor.close();

                    this.setSelectedContext(node);
                });
            },
            true
        );
    }

    private listenForDoubleClick(hammer: HammerManager) {
        hammer.on('double_tap', e => {
            this.zone.run(() => {
                if (this.state.selected?.el?.editActions[0]) {
                    this.state.selected?.el?.editActions[0].onClick(this.state.selected.node);
                }
            });
        });
    }

    private handleLinkClick(e: MouseEvent) {
        const node = e.target as HTMLElement;
        if (node.closest('a')) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    private handleFormSubmitButtonClick(e: MouseEvent) {
        const node = e.target as HTMLElement;

        // clicked node is not a submit button
        if (
            !node.matches(
                'input[type=submit], button[type=submit], button[type=submit] *'
            )
        ) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();
    }

    private addIframeCss() {
        if (this.state.previewDoc.head.querySelector('#preview-css')) return;
        const url = this.settings.getAssetUrl() + 'css/iframe.css';
        const link = createLinkEl(url, 'preview-css');
        this.state.previewDoc.head.appendChild(link);
    }

    private buildSrcDoc(doc: Document) {
        const base = doc.createElement('base');
        base.href = this.activeProject.getBaseUrl();
        doc.head.prepend(base);
        const outerHTML = doc.documentElement.outerHTML;
        base.remove();
        return outerHTML;
    }
}
