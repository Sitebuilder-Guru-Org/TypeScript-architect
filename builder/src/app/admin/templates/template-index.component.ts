import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CurrentUser} from '@common/auth/current-user';
import {CrupdateTemplateModalComponent} from './crupdate-template-modal/crupdate-template-modal.component';
import {BuilderTemplate} from '../../shared/builder-types';
import {Templates} from '../../shared/templates/templates.service';
import {Settings} from '@common/core/config/settings.service';
import {DatatableService} from '@common/datatable/datatable.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'template-index',
    templateUrl: './template-index.component.html',
    styleUrls: ['./template-index.component.scss'],
    providers: [DatatableService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateIndexComponent implements OnInit {
    public templates$ = this.datatable.data$ as Observable<BuilderTemplate[]>;
    constructor(
        private templates: Templates,
        public currentUser: CurrentUser,
        private settings: Settings,
        public datatable: DatatableService<BuilderTemplate>
    ) {}

    ngOnInit() {
        this.datatable.init({
            uri: 'templates',
        });
    }

    public maybeDeleteSelectedTemplates() {
        this.datatable.confirmResourceDeletion('templates')
            .subscribe(() => {
                this.templates.delete(this.datatable.selectedRows$.value as any).subscribe(() => {
                    this.datatable.reset();
                });
            });
    }

    public showCrupdateTemplateModal(template?: BuilderTemplate) {
        this.datatable.openCrupdateResourceModal(CrupdateTemplateModalComponent, {template})
            .subscribe();
    }

    public getTemplateThumbnail(template: BuilderTemplate) {
        return this.settings.getBaseUrl(true) + '/' + template.thumbnail;
    }
}
