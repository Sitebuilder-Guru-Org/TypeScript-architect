import {Injectable} from '@angular/core';
import {BaseMutation} from './base-mutation';
import {Subject} from 'rxjs';
import {BuilderStateService} from '../builder-state.service';

const DEBOUNCE_TIME = 800;

@Injectable({
    providedIn: 'root',
})
export class MutationsService {
    private stack: BaseMutation[] = [];
    private pointer = -1;
    canUndo: boolean;
    canRedo: boolean;
    executed$ = new Subject<BaseMutation>();

    private debounceFirst: BaseMutation;
    private debounceTimeout: any;

    constructor(private state: BuilderStateService) {
        this.state.activePage$.subscribe(() => {
            this.stack = [];
        });
    }

    execute(
        mutation: BaseMutation,
        options?: {skipUndoStack?: boolean}
    ): boolean {
        const pageDom = this.state.activePage$.value.doc;
        const executed = mutation
            .init(pageDom, this.state.previewDoc)
            .execute();

        if (executed) {
            this.executed$.next(mutation);
        }

        if (!options?.skipUndoStack) {
            if (!this.debounceFirst) {
                this.debounceFirst = mutation;
            }

            if (this.debounceTimeout) {
                clearTimeout(this.debounceTimeout);
            }

            this.debounceTimeout = setTimeout(() => {
                mutation.changes.old = this.debounceFirst.changes.old;
                this.debounceFirst = null;
                this.pushOntoStack(mutation);
            }, DEBOUNCE_TIME);
        }

        return executed;
    }

    pushOntoStack(mutation: BaseMutation) {
        // remove all stack items after new pointer (if pushing after undoing)
        if (this.canRedo) {
            this.stack = this.stack.slice(0, this.pointer + 1);
        }
        this.stack.push(mutation);
        this.setPointer(this.pointer + 1);
    }

    undo() {
        const mutation = this.stack[this.pointer];
        if (mutation) {
            mutation.undo();
            this.setPointer(this.pointer - 1);
            this.executed$.next(mutation);
        }
    }

    redo() {
        const mutation = this.stack[this.pointer + 1];
        if (mutation) {
            mutation.redo();
            this.setPointer(this.pointer + 1);
            this.executed$.next(mutation);
        }
    }

    private setPointer(newPointer: number) {
        this.pointer = newPointer;
        this.canUndo = this.pointer !== -1;
        this.canRedo = this.pointer < this.stack.length - 1;
    }
}
