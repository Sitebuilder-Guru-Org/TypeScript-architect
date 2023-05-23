import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {LayoutPanel} from './layout-panel.service';
import {Container} from './layout-panel-types';
import {ContextBoxes} from '../../live-preview/context-box/context-boxes.service';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {BuilderDocumentActions} from '../../builder-document-actions.service';
import {BuilderStateService} from '../../builder-state.service';
import {BuilderSidebarPanel} from '../builder-sidebar-panel';
import {MutationsService} from '../../mutations/mutations.service';
import {MoveNode} from '../../mutations/dom/move-node';
import {getNodeId} from '../../utils/get-node-id';
import {distinctUntilChanged} from 'rxjs/operators';
import {combineLatest} from 'rxjs';
import {findNodeById} from '../../utils/find-nodes-by-id';
import {LivePreview} from '../../live-preview.service';
import {ContextType} from '../../live-preview/context-box/builder-context';

@Component({
    selector: 'layout-panel',
    templateUrl: './layout-panel.component.html',
    styleUrls: ['./layout-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LayoutPanelComponent implements OnInit {
    trackByFn = (i: number, container: Container) => container.id;

    constructor(
        private contextBoxes: ContextBoxes,
        public layoutPanel: LayoutPanel,
        private actions: BuilderDocumentActions,
        public state: BuilderStateService,
        private mutations: MutationsService,
        public livePreview: LivePreview
    ) {}

    ngOnInit() {
        this.mutations.executed$.subscribe(() => {
            if (
                this.state.inspectorPanel$.value === BuilderSidebarPanel.Layout
            ) {
                this.layoutPanel.loadContainers();
                // row layout might have changed on mutation
                this.layoutPanel.selectRow(this.layoutPanel.selectedRow?.id);
            }
        });

        combineLatest([
            this.state.inspectorPanel$.pipe(distinctUntilChanged()),
            this.state.selected$,
        ]).subscribe(() => {
            if (
                this.state.inspectorPanel$.value === BuilderSidebarPanel.Layout
            ) {
                this.layoutPanel.selectActiveRowAndContainer();
            }
        });

        this.state.previewDocReloaded$.subscribe(() => {
            this.layoutPanel.loadContainers();
        });
    }

    openInspectorPanel(nodeId: string) {
        this.livePreview.setSelectedContext(
            findNodeById(nodeId, this.state.previewDoc)
        );
        this.state.inspectorPanel$.next(BuilderSidebarPanel.Inspector);
    }

    cloneContainer(container: Container) {
        const cloneId = this.actions.cloneNode(
            findNodeById(container.id, this.state.previewDoc)
        );
        this.livePreview.setSelectedContext(cloneId);
    }

    cloneRow(nodeId: string) {
        const cloneId = this.actions.cloneNode(
            findNodeById(nodeId, this.state.previewDoc)
        );
        this.livePreview.setSelectedContext(
            findNodeById(cloneId, this.state.previewDoc)
        );
    }

    removeItem(nodeId: string) {
        this.actions.removeNode(findNodeById(nodeId, this.state.previewDoc));
    }

    repositionHoverBox(nodeId: string) {
        this.contextBoxes.repositionBox(
            ContextType.Hover,
            findNodeById(nodeId, this.state.previewDoc)
        );
    }

    hideHoverBox() {
        this.contextBoxes.hideBox(ContextType.Hover);
    }

    containerIsSelected(container: Container): boolean {
        if (!this.layoutPanel.selectedContainer) return false;
        return this.layoutPanel.selectedContainer.id === container.id;
    }

    onPanelOpen(container: Container) {
        if (this.layoutPanel.selectedContainer?.id !== container.id) {
            this.layoutPanel.selectedContainer = container;
            this.livePreview.setSelectedContext(container.rows[0]);
        }
    }

    isSelected(nodeId: string) {
        return getNodeId(this.state.selected?.node) === nodeId;
    }

    widthFromSpan(span: number): string {
        return (span * 100) / 12 + '%';
    }

    reorder(e: CdkDragDrop<any>, type: 'container' | 'row' | 'column') {
        const nodeList = this.getNodeList(type);
        const nodeId = nodeList[e.previousIndex];
        const node = findNodeById(nodeId, this.state.previewDoc);
        const parentId = getNodeId(node.parentElement);
        this.mutations.execute(
            new MoveNode(
                node,
                e.previousIndex,
                parentId,
                e.currentIndex,
                parentId
            )
        );
    }

    private getNodeList(type: 'container' | 'row' | 'column'): string[] {
        switch (type) {
            case 'container':
                return this.layoutPanel.containers.map(c => c.id);
            case 'row':
                return this.layoutPanel.selectedContainer.rows;
            case 'column':
                return this.layoutPanel.selectedRow.columns.map(c => c.id);
        }
    }
}
