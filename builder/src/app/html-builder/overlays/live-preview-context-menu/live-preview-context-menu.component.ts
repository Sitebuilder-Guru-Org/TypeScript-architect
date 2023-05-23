import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatMenuTrigger} from '@angular/material/menu';
import {CurrentUser} from '@common/auth/current-user';
import {BuilderDocumentActions} from '../../builder-document-actions.service';
import {MutationsService} from '../../mutations/mutations.service';
import {BuilderStateService} from '../../builder-state.service';
import {LivePreview} from '../../live-preview.service';

@Component({
    selector: 'live-preview-context-menu',
    templateUrl: './live-preview-context-menu.component.html',
    styleUrls: ['./live-preview-context-menu.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LivePreviewContextMenuComponent {
    @ViewChild(MatMenuTrigger, {static: true}) trigger: MatMenuTrigger;
    @ViewChild('contextMenu', {static: true}) contextMenu;

    constructor(
        public state: BuilderStateService,
        public currentUser: CurrentUser,
        private actions: BuilderDocumentActions,
        public mutations: MutationsService,
        private livePreview: LivePreview
    ) {}

    remove() {
        this.actions.removeNode(this.state.selected.node);
    }

    undo() {
        this.mutations.undo();
    }

    redo() {
        this.mutations.redo();
    }

    copy() {
        this.actions.copyNode(this.state.selected.node);
    }

    cut() {
        this.actions.cutNode(this.state.selected.node);
    }

    paste() {
        this.actions.pasteNode(this.state.selected.node);
    }

    canPaste() {
        return this.actions.copiedNode;
    }

    duplicate() {
        this.actions.cloneNode(this.state.selected.node);
    }

    selectParent() {
        this.livePreview.setSelectedContext(
            this.state.selected.node.parentElement
        );
    }

    canSelectParent(): boolean {
        const parent = this.state.selected?.node?.parentElement;
        return parent && parent.nodeName.toLowerCase() !== 'body';
    }

    canSelectChild(): boolean {
        return !!this.state.selected?.node?.firstChild;
    }

    selectChild() {
        this.livePreview.setSelectedContext(
            this.state.selected.node.firstChild as HTMLElement
        );
    }

    move(direction: 'up' | 'down') {
        this.actions.moveSelected(direction);
    }
}
