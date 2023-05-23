import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    Input,
} from '@angular/core';
import {BuilderDocumentActions} from '../../builder-document-actions.service';
import {LivePreview} from '../../live-preview.service';
import {UploadQueueService} from '@common/uploads/upload-queue/upload-queue.service';
import {BuilderStateService} from '../../builder-state.service';
import {BuilderSidebarPanel} from '../../sidebar/builder-sidebar-panel';
import {ContextType} from './builder-context';
import {map} from 'rxjs/operators';
import {ContextBoxes} from './context-boxes.service';

@Component({
    selector: 'context-box',
    templateUrl: './context-box.component.html',
    styleUrls: ['./context-box.component.scss'],
    providers: [UploadQueueService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextBoxComponent implements AfterViewInit {
    @Input() type: ContextType = ContextType.Hover;
    @HostBinding('class.type-selected') get typeSelected() {
        return this.type === 'selected';
    }

    showActions$ = this.state.project$.pipe(
        map(project => {
            const settings = project?.model?.settings?.builder as Record<
                string,
                boolean
            >;
            return this.type === ContextType.Hover
                ? settings?.hoverContextActions ?? true
                : settings?.selectedContextActions ?? false;
        })
    );

    constructor(
        private builderActions: BuilderDocumentActions,
        public el: ElementRef<HTMLElement>,
        private state: BuilderStateService,
        private livePreview: LivePreview,
        private contextBoxes: ContextBoxes
    ) {}

    ngAfterViewInit() {
        if (this.type === ContextType.Selected) {
            this.el.nativeElement.addEventListener('mouseenter', () => {
                this.contextBoxes.hideBox(ContextType.Hover);
            });
        }
    }

    deleteNode() {
        this.builderActions.removeNode(this.state.getContext(this.type).node);
    }

    editNode() {
        const context = this.state.getContext(this.type);
        if (this.type === ContextType.Hover) {
            this.livePreview.setSelectedContext(context.node);
        }
        if (context.el.editActions[0]) {
            context.el.editActions[0].onClick(context.node);
        } else {
            this.state.inspectorPanel$.next(BuilderSidebarPanel.Inspector);
        }
    }
}
