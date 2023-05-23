import {Component, OnInit} from '@angular/core';
import {LivePreview} from '../../../live-preview.service';
import {FormControl} from '@angular/forms';
import {MutationsService} from '../../../mutations/mutations.service';
import {SetIdAttribute} from '../../../mutations/attributes/set-id-attribute';
import {
    isInternalClass,
    SyncElClasses,
} from '../../../mutations/attributes/sync-el-classes';
import {ChangeVisibility} from '../../../mutations/attributes/change-visibility';
import {BuilderStateService} from '../../../builder-state.service';

@Component({
    selector: 'attributes-panel',
    templateUrl: './attributes-panel.component.html',
    styleUrls: ['./attributes-panel.component.scss'],
})
export class AttributesPanelComponent implements OnInit {
    visibility: Record<string, boolean> = {
        sm: true,
        md: true,
        lg: true,
        xl: true,
    };

    id: string;
    classControl = new FormControl([]);

    constructor(
        private livePreview: LivePreview,
        private mutations: MutationsService,
        private state: BuilderStateService
    ) {}

    ngOnInit() {
        this.classControl.valueChanges.subscribe(value => {
            this.mutations.execute(
                new SyncElClasses(
                    this.state.selected.node,
                    this.state.selected.el,
                    value
                )
            );
        });

        this.state.selected$.subscribe(() => {
            this.onElementSelected();
        });
    }

    changeElId(id: string) {
        this.mutations.execute(
            new SetIdAttribute(this.state.selected.node, id)
        );
    }

    changeVisibility(size: string) {
        this.visibility[size] = !this.visibility[size];
        this.mutations.execute(
            new ChangeVisibility(this.state.selected.node, this.visibility),
            {skipUndoStack: true}
        );
    }

    private onElementSelected() {
        if (!this.state.selected?.node?.classList) return;

        // set element classes
        this.classControl.setValue(
            Array.from(this.state.selected.node.classList).filter(
                c => !isInternalClass(c, this.state.selected.el)
            ),
            {emitEvent: false}
        );

        // set element id
        this.id = this.state.selected.node.id;

        // set 'bootstrap' visibility
        if (this.state.selected.node.classList.contains('d-none')) {
            Object.keys(this.visibility).forEach(key => {
                const className = key === 'sm' ? 'd-none' : `d-${key}-none`;
                this.visibility[key] =
                    !this.state.selected.node.classList.value.includes(
                        className
                    );
            });
        }
    }
}
