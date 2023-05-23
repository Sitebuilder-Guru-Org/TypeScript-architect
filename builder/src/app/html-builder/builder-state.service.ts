import {Injectable} from '@angular/core';
import {BehaviorSubject, ReplaySubject} from 'rxjs';
import {DragVisualHelperComponent} from './live-preview/drag-and-drop/drag-visual-helper/drag-visual-helper.component';
import {BuilderBreakpoint} from './sidebar/device-switcher/builder-breakpoint';
import {ArchitectElement} from './elements/architect-element';
import {BuilderSidebarPanel} from './sidebar/builder-sidebar-panel';
import {BuilderPage, BuilderProject} from '../shared/builder-types';
import {delay, filter, take} from 'rxjs/operators';
import {
    ContextType,
    HoverContext,
    SelectedContext,
} from './live-preview/context-box/builder-context';
import {createDocFromHtml} from './utils/create-doc-from-html';
import {addIdToPages} from './utils/add-id-to-pages';
import {CssKey} from './mutations/style/default-css-values';

@Injectable({
    providedIn: 'root',
})
export class BuilderStateService {
    breakpoint: BuilderBreakpoint = BuilderBreakpoint.Desktop;

    // active project
    pages$ = new BehaviorSubject<BuilderPage[]>([]);
    activePage$ = new BehaviorSubject<BuilderPage>(null);
    project$ = new BehaviorSubject<BuilderProject>(null);

    // inspector
    inspectorPanel$ = new BehaviorSubject<BuilderSidebarPanel>(
        BuilderSidebarPanel.Elements
    );
    inspectorEl: HTMLElement;

    // live preview
    iframe: HTMLIFrameElement;
    previewContainer: HTMLElement;
    previewDoc: Document;
    previewDocReloaded$ = new ReplaySubject(1);

    hover$ = new BehaviorSubject<HoverContext>(null);
    get hover(): HoverContext {
        return this.hover$.value;
    }
    selected$ = new BehaviorSubject<SelectedContext>(null);
    get selected(): SelectedContext {
        return this.selected$.value;
    }

    // dragging el from inspector to builder and dragging el within builder
    dragging$ = new BehaviorSubject<boolean>(false);
    dragData: {el: ArchitectElement; node: HTMLElement};
    dragHelper: DragVisualHelperComponent;
    dropHelper: HTMLElement;
    dragOverlay: HTMLElement;

    // resizing node via bottom right corner
    resizing$ = new BehaviorSubject<boolean>(false);

    // inline text editor
    editableNode: HTMLElement;

    // main loader
    loading$ = new BehaviorSubject(true);
    loadedAtLeastOnce$ = new ReplaySubject(1);

    constructor() {
        // wait 500ms until loader animation is complete
        this.loading$
            .pipe(
                filter(loading => !loading),
                take(1),
                delay(500)
            )
            .subscribe(() => this.loadedAtLeastOnce$.next(true));
    }

    setActivePage(pageId: string) {
        const page = this.pages$.value.find(curr => curr.id === pageId);
        if (page) {
            if (!page.doc) {
                page.doc = createDocFromHtml(page.html);
            }
            this.activePage$.next(page);
        }
    }

    getContext(type: ContextType): SelectedContext | HoverContext {
        return type === ContextType.Hover ? this.hover : this.selected;
    }

    getSelectedStyle(prop: CssKey): string {
        if (!this.selected?.node) return null;
        return this.iframe.contentWindow.getComputedStyle(this.selected.node)[
            prop
        ];
    }

    setProject(project: BuilderProject) {
        this.project$.next(project);
        this.pages$.next(addIdToPages(project.pages));
        this.setActivePage(this.pages$.value[0].id);
    }
}
