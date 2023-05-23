import {BaseMutation} from '../base-mutation';
import {createColumnNode} from '../../sidebar/layout-panel/utils/create-column-node';
import {getNodeIndex} from '../../utils/get-node-index';
import {getColumnSpan} from '../../sidebar/layout-panel/utils/get-column-span';
import {findNodeById, findNodesById} from '../../utils/find-nodes-by-id';
import {Column} from '../../sidebar/layout-panel/layout-panel-types';
import {getRowColumns} from '../../sidebar/layout-panel/utils/get-row-columns';

export class ApplyRowPreset extends BaseMutation {
    private originalRowContent: string;
    private columns: Column[];

    constructor(protected rowId: string, protected preset: number[]) {
        super(rowId);
    }

    execute(): boolean {
        if (this.executeMutation(this.pageDoc)) {
            // replace row node with modified row clone from page document so that both
            // documents have the same node ids for row and all newly added children
            const modifiedRow = this.findEl(this.pageDoc, this.rowId).cloneNode(
                true
            );
            this.findEl(this.previewDoc, this.rowId).replaceWith(modifiedRow);
            return true;
        }
        return false;
    }

    protected executeMutation(doc: Document): boolean {
        this.applyPreset(this.preset, doc);
        return true;
    }

    protected undoMutation(doc: Document): boolean {
        this.findEl(doc).innerHTML = this.originalRowContent;
        return true;
    }

    protected applyPreset(preset: number[], doc: Document) {
        const rowNode = this.findEl(doc, this.rowId);
        this.columns = getRowColumns(rowNode);
        this.originalRowContent = rowNode.innerHTML;

        // remove extra columns
        if (this.columns.length > preset.length) {
            const colIds = this.columns.slice(preset.length).map(c => c.id);
            findNodesById(colIds, doc).forEach(col => col.remove());
        }

        // resize existing columns
        preset.forEach((span, i) => {
            if (this.columns[i]) {
                const col = findNodeById(this.columns[i].id, doc);
                this.resizeColumn(col, span);
            } else if (this.columns[i - 1]) {
                const col = findNodeById(this.columns[i - 1].id, doc);
                this.addNewColumn(col, span, doc);
            } else {
                // row is empty
                rowNode.appendChild(createColumnNode(span, doc));
            }
        });
    }

    private resizeColumn(
        node: HTMLElement,
        newSpan: number,
        operator?: '+' | '-'
    ) {
        if (!newSpan) newSpan = 1;

        node.className = node.className.replace(
            /(col-[a-z]+-)([0-9]+)/,
            (full, start, oldSpan) => {
                if (operator) {
                    return operator === '+'
                        ? start + (parseInt(oldSpan) + newSpan)
                        : start + (parseInt(oldSpan) - newSpan);
                }

                return start + newSpan;
            }
        );
    }

    protected addNewColumn(
        ref: HTMLElement,
        span: number,
        doc: Document
    ): void {
        const refIndex = getNodeIndex(ref);
        const siblings = Array.from(ref.parentElement.children);
        const colsAfter = siblings.slice(refIndex) as HTMLElement[];

        // add new column without resizing other columns if there's enough space left
        if (this.getTotalSpan(this.columns, doc) + span <= 12) {
            return ref.after(createColumnNode(span, doc));
        }

        // try to reduce the next column by one
        if (this.colWiderThan(1, colsAfter[0])) {
            this.resizeColumn(colsAfter[0], 1, '-');
            return ref.after(createColumnNode(span, doc));
        } else if (this.colWiderThan(1, ref)) {
            this.resizeColumn(ref, 1, '-');
            return ref.after(createColumnNode(span, doc));
        }

        // loop trough all columns after given one and
        // reduce the first one that's wider then one
        if (this.fitColumn(ref, colsAfter, span, doc)) {
            return;
        }

        // loop trough all columns before given one and
        // reduce the first one that's wider then one
        const colsBefore = siblings.slice(0, refIndex) as HTMLElement[];
        if (this.fitColumn(ref, colsBefore, span, doc)) {
            return;
        }
    }

    private fitColumn(
        ref: HTMLElement,
        columns: HTMLElement[],
        span: number,
        doc: Document
    ): boolean {
        for (const col of columns) {
            if (this.colWiderThan(1, col)) {
                this.resizeColumn(col, 1, '-');
                ref.after(createColumnNode(span, doc));
                return true;
            }
        }
    }

    private colWiderThan(span: number, node: HTMLElement) {
        if (this.isColumn(node)) {
            return getColumnSpan(node) > span;
        }
    }

    private isColumn(node: HTMLElement) {
        if (node?.className) {
            return node.className.indexOf('col-') > -1;
        }
    }

    private getTotalSpan(columns: Column[], doc: Document): number {
        const colIds = columns.map(c => c.id);
        let totalSpan = 0;
        findNodesById(colIds, doc).forEach(colNode => {
            totalSpan += getColumnSpan(colNode);
        });
        return totalSpan;
    }
}
