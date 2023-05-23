import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Toast} from '@common/core/ui/toast.service';
import {Project} from '../projects/Project';
import {Projects} from '../projects/projects.service';
import {BuilderTemplate} from '../builder-types';
import {Templates} from '../templates/templates.service';
import {slugifyString} from '@common/core/utils/slugify-string';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';
import {getProductionHtml} from '../../html-builder/utils/parse-html-into-document';
import {BLANK_PAGE_SKELETON} from './blank-page-skeleton';

interface CrupdateProjectModalData {
    project?: Project;
    templateName?: string;
    showExtraConfig?: boolean;
}

@Component({
    selector: 'crupdate-project-modal',
    templateUrl: './crupdate-project-modal.component.html',
    styleUrls: ['./crupdate-project-modal.component.scss'],
})
export class CrupdateProjectModalComponent implements OnInit {
    public templates: BuilderTemplate[] = [];
    public loading = false;
    public model: Partial<Project> = {users: []};
    public updating = false;
    public errors: Partial<Project> = {};

    constructor(
        private dialogRef: MatDialogRef<CrupdateProjectModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CrupdateProjectModalData,
        public projects: Projects,
        private toast: Toast,
        private templatesApi: Templates
    ) {}

    ngOnInit() {
        if (this.data.showExtraConfig) {
            this.getTemplates();
        }

        this.hydrateModel();
        this.updating = !!this.data.project;
    }

    public async confirm() {
        this.loading = true;
        let request;

        this.model.slug = slugifyString(this.model.name);

        if (this.updating) {
            request = this.projects.update(this.data.project.id, this.model);
        } else {
            request = this.projects.create(await this.getNewProjectPayload());
        }

        request.subscribe(
            response => {
                this.close(response.project);
                const action = this.updating ? 'updated' : 'created';
                this.toast.open('Project has been ' + action);
                this.loading = false;
            },
            (errResponse: BackendErrorResponse) => {
                this.errors = errResponse.errors;
                this.loading = false;
            }
        );
    }

    public close(data?: any) {
        this.dialogRef.close(data);
    }

    private hydrateModel() {
        this.errors = {};

        this.model = {
            pages: [],
            published: true,
            template: this.data.templateName || null,
            users: [],
        };

        if (this.data.project) {
            this.model.name = this.data.project.name;
            this.model.users = this.data.project.users;
            this.model.template = this.data.project.template;
            this.model.slug = this.data.project.slug;
        }
    }

    private getTemplates() {
        this.templatesApi.all().subscribe(response => {
            this.templates = response.pagination.data;
        });
    }

    private getNewProjectPayload() {
        const templateName = this.data.templateName || this.model.template;
        if (templateName) {
            return this.createProjectFromTemplate(templateName);
        } else {
            return this.createBlankProject();
        }
    }

    private createProjectFromTemplate(templateName: string): Promise<any> {
        return new Promise(resolve => {
            const params = this.model as any;

            this.templatesApi.get(templateName).subscribe(response => {
                params.template_name = response.template.name;
                params.pages = this.transformTemplatePages(response.template);
                resolve(params);
            });
        });
    }

    private createBlankProject() {
        const params = this.model as any;
        params.pages.push({
            name: 'index',
            html: getProductionHtml(BLANK_PAGE_SKELETON),
        });

        return params;
    }

    private transformTemplatePages(template: BuilderTemplate) {
        return template.pages.map(page => {
            return {
                name: page.name,
                html: getProductionHtml(page.html, template),
            };
        });
    }
}
