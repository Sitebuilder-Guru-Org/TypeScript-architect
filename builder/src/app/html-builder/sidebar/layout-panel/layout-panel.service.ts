import {Injectable} from '@angular/core';
import {Container, Row} from './layout-panel-types';
import {getNodeId, getNodeIds} from '../../utils/get-node-id';
import {BuilderStateService} from '../../builder-state.service';
import {
    ColumnEl,
    ContainerEl,
    LayoutEl,
    RowEl,
} from '../../elements/definitions/grid';
import {MutationsService} from '../../mutations/mutations.service';
import {InsertNode} from '../../mutations/dom/insert-node';
import {createColumnNode} from './utils/create-column-node';
import {ApplyRowPreset} from '../../mutations/layout/apply-row-preset';
import {findNodeById} from '../../utils/find-nodes-by-id';
import {getRowColumns} from './utils/get-row-columns';
import {LivePreview} from '../../live-preview.service';

const CONTAINER_CLASS = '.container, .container-fluid';

@Injectable({
    providedIn: 'root',
})
export class LayoutPanel {
    containers: Container[] = [];
    selectedRow: Row;
    selectedContainer: Container;

    constructor(
        private mutations: MutationsService,
        private state: BuilderStateService,
        private livePreview: LivePreview
    ) {}

    loadContainers() {
        this.containers = [];
        Array.from(
            this.state.previewDoc.querySelectorAll(CONTAINER_CLASS)
        ).forEach((node: HTMLElement) => {
            const rowIds = getNodeIds(node.querySelectorAll('.row'));
            this.containers.push({rows: rowIds, id: getNodeId(node)});
        });
    }

    createRow(parentId: string, index: number) {
        const row = this.state.previewDoc.createElement('div');
        row.appendChild(createColumnNode(12, this.state.previewDoc));
        row.classList.add('row');

        const mutation = new InsertNode(row, index, parentId);
        this.mutations.execute(mutation);
        this.livePreview.setSelectedContext(mutation.getNodeId());
    }

    createContainer(refId: string, index: number) {
        const row = this.state.previewDoc.createElement('div');
        row.appendChild(createColumnNode(12, this.state.previewDoc));
        row.classList.add('row');

        const container = this.state.previewDoc.createElement('div');
        container.classList.add('container');
        container.appendChild(row);

        const parentId = refId || getNodeId(this.state.previewDoc.body);
        const mutation = new InsertNode(container, index, parentId);
        this.mutations.execute(mutation);

        this.livePreview.setSelectedContext(mutation.getNodeId());
    }

    selectColumn(nodeId: string) {
        const node = findNodeById(nodeId, this.state.previewDoc);
        this.livePreview.setSelectedContext(node);
        this.scrollIntoView(node);
    }

    applyPreset(preset: number[]) {
        if (preset.join('+') !== this.selectedRow.preset.join('+')) {
            this.mutations.execute(
                new ApplyRowPreset(this.selectedRow.id, preset)
            );
            this.livePreview.setSelectedContext(this.selectedRow.id);
        }
    }

    selectActiveRowAndContainer() {
        if ( ! this.state.selected) return;
        const node = this.state.selected.node;
        const el = this.state.selected.el;
        let row: HTMLElement;
        let container: HTMLElement;

        if (!node || !(el instanceof LayoutEl)) return;

        if (el instanceof RowEl) {
            row = node;
            container = row.closest(CONTAINER_CLASS);
        } else if (el instanceof ColumnEl) {
            row = node.closest('.row');
            if (row) {
                container = row.closest(CONTAINER_CLASS);
            }
        } else if (el instanceof ContainerEl) {
            container = node;
            row = container.querySelector('.row');
        }

        if (this.selectedRow?.id !== getNodeId(row)) {
            this.selectRow(getNodeId(row));
        }

        if (this.selectedContainer?.id !== getNodeId(container)) {
            this.selectedContainer = this.containers.find(
                cont => cont.id === getNodeId(container)
            );
        }
    }

    selectRow(nodeId: string) {
        if (!nodeId) return;

        const node = findNodeById(nodeId, this.state.previewDoc);
        const columns = getRowColumns(node);
        const preset = columns.map(col => col.span);

        this.scrollIntoView(node);

        this.selectedRow = {id: nodeId, columns, preset};
    }

    private scrollIntoView(node: HTMLElement) {
        node?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
        });
    }
}
