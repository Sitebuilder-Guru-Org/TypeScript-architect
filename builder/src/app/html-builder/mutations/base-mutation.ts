import {getNodeId} from '../utils/get-node-id';
import {findNodeById} from '../utils/find-nodes-by-id';

export abstract class BaseMutation {
    protected nodeId: string;
    protected pageDoc: Document;
    protected previewDoc: Document;
    changes: {new: any, old: any} = {
        new: null,
        old: null,
    };

    protected constructor(protected nodeOrId: HTMLElement | string) {
        this.nodeId =
            typeof nodeOrId === 'string' ? nodeOrId : getNodeId(nodeOrId);
    }

    init(pageDoc: Document, previewDoc: Document): this {
        // mutation will need to apply its operations to
        // page document as well as preview iframe document
        this.pageDoc = pageDoc;
        this.previewDoc = previewDoc;
        this.onInit();
        return this;
    }

    execute(): boolean {
        return [this.pageDoc, this.previewDoc]
            .map(doc => {
                return this.executeMutation(doc);
            })
            .some(executed => executed);
    }

    undo(): boolean {
        return [this.pageDoc, this.previewDoc]
            .map(doc => {
                return this.undoMutation(doc);
            })
            .every(executed => executed);
    }

    redo() {
        return this.execute();
    }

    protected findEl(doc: Document, elId?: string): HTMLElement {
        elId = elId || this.nodeId;
        return findNodeById(elId, doc);
    }

    protected abstract executeMutation(doc: Document): boolean;
    protected abstract undoMutation(doc: Document): boolean;
    protected onInit() {
        //
    }
}
