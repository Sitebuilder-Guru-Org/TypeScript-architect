import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {Toast} from '@common/core/ui/toast.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CrupdateUserModalComponent} from '@common/admin/users/crupdate-user-modal/crupdate-user-modal.component';
import {Templates} from '../../../shared/templates/templates.service';
import {
    BuilderTemplate,
    BuilderTemplateConfig,
} from '../../../shared/builder-types';
import {Settings} from '@common/core/config/settings.service';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';
import {FormBuilder} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {finalize} from 'rxjs/operators';

interface TemplateErrors extends BuilderTemplateConfig {
    template?: string;
    thumbnail?: string;
}

@Component({
    selector: 'crupdate-template-modal',
    templateUrl: './crupdate-template-modal.component.html',
    styleUrls: ['./crupdate-template-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrupdateTemplateModalComponent implements OnInit {
    public allCategories: string[] = [];
    public loading$ = new BehaviorSubject(false);

    public form = this.fb.group({
        name: [''],
        category: [''],
        includeBootstrap: [false],
    });

    /**
     * Template file input value.
     */
    public files: {thumbnail?: File, template?: File} = {};

    public errors: Partial<TemplateErrors> = {};

    constructor(
        private dialogRef: MatDialogRef<CrupdateUserModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {template?: BuilderTemplate},
        public templates: Templates,
        private toast: Toast,
        private settings: Settings,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef,
    ) {
        this.allCategories = this.settings.getJson('builder.template_categories', []);
        this.form.get('category').setValue(this.allCategories[0]);
    }

    ngOnInit() {
        if (this.data.template) {
            this.hydrateModel(this.data.template);
        }
    }

    public confirm() {
        this.loading$.next(true);
        let request;
        const payload = this.getPayload();

        if (this.data.template) {
            request = this.templates.update(this.data.template.name, payload);
        } else {
            request = this.templates.create(payload);
        }

        request
            .pipe(finalize(() =>  this.loading$.next(false)))
            .subscribe(response => {
                this.close(response.template);
                const action = this.data.template ? 'updated' : 'created';
                this.toast.open('Template has been ' + action);
            }, (errResponse: BackendErrorResponse) => {
                this.errors = errResponse.errors;
                this.cd.markForCheck();
            });
    }

    private getPayload() {
        const data = new FormData();

        // append template and thumbnail files
        if (this.files.template) {
            data.append('template', this.files.template);
        }
        if (this.files.thumbnail) {
            data.append('thumbnail', this.files.thumbnail);
        }

        // append model values
        for (const name in this.form.value) {
            data.append(name, this.form.value[name]);
        }

        return data;
    }

    public close(data?: any) {
        this.dialogRef.close(data);
    }

    private hydrateModel(template: BuilderTemplate) {
        this.form.patchValue(template.config);
    }

    public setFile(type: 'template'|'thumbnail', files: FileList) {
        this.files[type] = files.item(0);
        this.errors = {};
    }
}
