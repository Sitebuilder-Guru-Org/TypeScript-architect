import {
    AfterViewInit,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {Elements} from '../elements/elements.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ActiveProject} from '../projects/active-project';
import {DragVisualHelperComponent} from '../live-preview/drag-and-drop/drag-visual-helper/drag-visual-helper.component';
import {CodeEditor} from '../overlays/code-editor/code-editor.service';
import {InlineTextEditor} from '../overlays/inline-text-editor/inline-text-editor.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {BreakpointsService} from '@common/core/ui/breakpoints.service';
import {LivePreview} from '../live-preview.service';
import {forkJoin} from 'rxjs';
import {take, tap} from 'rxjs/operators';
import {Projects} from '../../shared/projects/projects.service';
import {OverlayPanel} from '@common/core/ui/overlay-panel/overlay-panel.service';
import {LinkEditor} from '../overlays/link-editor/link-editor.service';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {ContextMenu} from '@common/core/ui/context-menu/context-menu.service';
import {LayoutPanel} from '../sidebar/layout-panel/layout-panel.service';
import {CurrentUser} from '@common/auth/current-user';
import {MutationsService} from '../mutations/mutations.service';
import {BuilderDocumentActions} from '../builder-document-actions.service';
import {LivePreviewScroller} from '../live-preview/drag-and-drop/live-preview-scroller';
import {BuilderStateService} from '../builder-state.service';
import {UploadQueueService} from '@common/uploads/upload-queue/upload-queue.service';
import {BuilderOverlayService} from '../overlays/builder-overlay.service';

@Component({
    selector: 'html-builder',
    templateUrl: './html-builder.component.html',
    styleUrls: ['./html-builder.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        ActiveProject,
        LivePreview,
        BuilderDocumentActions,
        Modal,
        OverlayPanel,
        LinkEditor,
        CodeEditor,
        ContextMenu,
        InlineTextEditor,
        LayoutPanel,
        BuilderOverlayService,
        MutationsService,
        LivePreviewScroller,
        BuilderStateService,
        Elements,
        UploadQueueService,
    ],
    animations: [
        trigger('bodyExpansion', [
            state('false', style({height: '0px', visibility: 'hidden'})),
            state('true', style({height: '*', visibility: 'visible'})),
            transition(
                'true <=> false',
                animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
            ),
        ]),
    ],
})
export class HtmlBuilderComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('dragHelper')
    dragHelper: DragVisualHelperComponent;
    inspectorHidden = false;

    constructor(
        private elements: Elements,
        private route: ActivatedRoute,
        private codeEditor: CodeEditor,
        private inlineTextEditor: InlineTextEditor,
        private breakpoints: BreakpointsService,
        private projectApi: Projects,
        private livePreview: LivePreview,
        private currentUser: CurrentUser,
        private router: Router,
        public state: BuilderStateService
    ) {}

    ngOnInit() {
        forkJoin([
            this.projectApi.get(this.route.snapshot.params.id).pipe(
                tap(response => {
                    this.state.setProject(response.project);
                    this.livePreview.init();
                })
            ),
            this.elements.init(),
            this.state.previewDocReloaded$.pipe(take(1)),
        ]).subscribe(() => {
            if (!this.canOpenProjectInBuilder()) {
                this.router.navigate(['/dashboard']);
            }
        });
        this.inspectorHidden = this.breakpoints.isMobile$.value;
    }

    ngAfterViewInit() {
        this.state.dragHelper = this.dragHelper;
    }

    private canOpenProjectInBuilder(): boolean {
        return (
            this.currentUser.hasPermission('projects.update') ||
            !!this.state.project$.value.model.users.find(
                u => u.id === this.currentUser.get('id')
            )
        );
    }

    ngOnDestroy() {
        this.codeEditor.close();
        this.inlineTextEditor.close();
    }

    toggleInspector() {
        this.inspectorHidden = !this.inspectorHidden;
    }
}
