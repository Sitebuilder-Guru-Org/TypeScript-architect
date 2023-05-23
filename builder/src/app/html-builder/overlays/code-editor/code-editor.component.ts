import {
    Component,
    ElementRef,
    Inject,
    OnDestroy,
    OnInit,
    Optional,
    ViewChild,
} from '@angular/core';
import {aceThemes} from './ace-themes';
import {LazyLoaderService} from '@common/core/utils/lazy-loader.service';
import {OverlayPanelRef} from '@common/core/ui/overlay-panel/overlay-panel-ref';
import {BuilderStateService} from '../../builder-state.service';
import {ActiveProject} from '../../projects/active-project';
import {BehaviorSubject} from 'rxjs';
import {randomString} from '@common/core/utils/random-string';

declare let ace: any;

@Component({
    selector: 'code-editor',
    templateUrl: './code-editor.component.html',
    styleUrls: ['./code-editor.component.scss'],
})
export class CodeEditorComponent implements OnInit, OnDestroy {
    @ViewChild('editor', {static: true}) editorEl: ElementRef;

    private loading$ = new BehaviorSubject(false);

    private editor;
    activeEditorTheme = 'chrome';
    editorThemes = aceThemes;
    private activeEditor: 'css' | 'js' = 'css';

    private content = {
        css: '',
        js: '',
    };

    constructor(
        private lazyLoader: LazyLoaderService,
        private state: BuilderStateService,
        private activeProject: ActiveProject,
        @Inject(OverlayPanelRef) @Optional() public overlayRef: OverlayPanelRef
    ) {}

    ngOnInit() {
        this.initEditor().then(() => {
            this.content.css = this.state.project$.value.css;
            this.content.js = this.state.project$.value.js;
            this.updateEditorContents(this.activeEditor);
        });
    }

    ngOnDestroy() {
        this.editor && this.editor.destroy();
    }

    useTheme(name: string) {
        this.editor.setTheme('ace/theme/' + name);
    }

    switchType(name: 'css' | 'js') {
        this.activeEditor = name;
        this.changeEditorMode(name);
        this.updateEditorContents(name);
    }

    private updateEditorContents(type: 'css' | 'js') {
        if (type === 'css') {
            this.setEditorValue(this.content.css);
        } else if (type === 'js') {
            this.setEditorValue(this.content.js);
        }
    }

    private setEditorValue(value: string) {
        if (this.editor && this.editor.getValue() !== value) {
            this.editor.setValue(value, -1);
        }
    }

    activeTypeIs(name: 'css' | 'js') {
        return this.activeEditor === name;
    }

    closeEditor() {
        this.overlayRef.close();
    }

    private initEditor(language: 'js' | 'css' = 'css') {
        this.loading$.next(true);
        return Promise.all([
            this.lazyLoader.loadAsset('js/ace/ace.js', {type: 'js'}),
            this.lazyLoader.loadAsset('js/beautify-html.js', {type: 'js'}),
        ]).then(() => {
            this.editor = ace.edit(this.editorEl.nativeElement);
            this.changeEditorMode(language);
            this.useTheme('chrome');
            this.editor.$blockScrolling = Infinity;
            this.loading$.next(false);

            this.editor.on('change', () => {
                this.content[this.activeEditor] = this.editor.getValue();
            });
        });
    }

    private changeEditorMode(mode: 'js' | 'css') {
        mode = mode === 'js' ? 'javascript' : (mode as any);
        if (this.editor) {
            this.editor.getSession().setMode('ace/mode/' + mode);
        }
    }

    async saveCustomCode() {
        this.loading$.next(true);
        await this.activeProject.save(false, {
            css: this.content.css,
            js: this.content.js,
        });
        this.reloadAssetsInBuilder();
        this.loading$.next(false);
        this.closeEditor();
    }

    private reloadAssetsInBuilder() {
        const cssEl = this.state.previewDoc.querySelector(
            '#custom-css'
        ) as HTMLLinkElement;
        const cssUrl = new URL(cssEl.href);
        cssEl.href = `${cssUrl.origin}${cssUrl.pathname}?${randomString(8)}`;

        const jsEl = this.state.previewDoc.querySelector(
            '#custom-js'
        ) as HTMLScriptElement;
        const jsUrl = new URL(jsEl.src);
        jsEl.src = `${jsUrl.origin}${jsUrl.pathname}?${randomString(8)}`;
    }
}
