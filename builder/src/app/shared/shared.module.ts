import {NgModule} from '@angular/core';
import {MaterialModule} from '../material.module';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CrupdateProjectModalComponent} from './crupdate-project-modal/crupdate-project-modal.component';
import {TranslationsModule} from '@common/core/translations/translations.module';
import {SelectUserInputModule} from '@common/core/ui/select-user-input/select-user-input.module';
import {MatTabsModule} from '@angular/material/tabs';
import {SlugControlModule} from '@common/shared/form-controls/slug-control/slug-control.module';
import {SvgImageModule} from '@common/core/ui/svg-image/svg-image.module';
import {NoResultsMessageModule} from '@common/core/ui/no-results-message/no-results-message.module';
import {ProjectSettingsModalComponent} from './projects/project-settings-modal/project-settings-modal.component';
import { SiteUrlTabComponent } from './projects/project-settings-modal/tabs/site-url-tab/site-url-tab.component';
import { ExportTabComponent } from './projects/project-settings-modal/tabs/export-tab/export-tab.component';
import { BuilderSettingsTabComponent } from './projects/project-settings-modal/tabs/builder-settings-tab/builder-settings-tab.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        TranslationsModule,
        SelectUserInputModule,
        ReactiveFormsModule,
        SlugControlModule,
        SvgImageModule,
        NoResultsMessageModule,

        MatTabsModule,
    ],
    declarations: [
        ProjectSettingsModalComponent,
        CrupdateProjectModalComponent,
        SiteUrlTabComponent,
        ExportTabComponent,
        BuilderSettingsTabComponent,
    ]
})
export class SharedModule {
}
