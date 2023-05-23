import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BuilderSettingsComponent} from './settings/builder/builder-settings.component';
import {CrupdateTemplateModalComponent} from './templates/crupdate-template-modal/crupdate-template-modal.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {BaseAdminModule} from '@common/admin/base-admin.module';
import {MatTabsModule} from '@angular/material/tabs';
import {ConfirmModalModule} from '@common/core/ui/confirm-modal/confirm-modal.module';
import {NoResultsMessageModule} from '@common/core/ui/no-results-message/no-results-message.module';
import {LoadingIndicatorModule} from '@common/core/ui/loading-indicator/loading-indicator.module';
import {DatatableModule} from '@common/datatable/datatable.module';
import {ProjectIndexComponent} from './projects/project-index.component';
import {TemplateIndexComponent} from './templates/template-index.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BaseAdminModule,
        ConfirmModalModule,
        NoResultsMessageModule,
        LoadingIndicatorModule,
        DatatableModule,

        // material
        MatProgressBarModule,
        MatTabsModule,
    ],
    declarations: [
        TemplateIndexComponent,
        CrupdateTemplateModalComponent,
        ProjectIndexComponent,
        BuilderSettingsComponent,
    ]
})
export class AppAdminModule {
}
