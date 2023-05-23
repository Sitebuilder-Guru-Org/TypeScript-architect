import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../material.module';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard.component';
import {NewProjectPageComponent} from './new-project-page/new-project-page.component';
import {TemplatesInfiniteScrollDirective} from './new-project-page/templates-infinite-scroll.directive';
import { MatTabsModule } from '@angular/material/tabs';
import {CustomDomainModule} from '@common/custom-domain/custom-domain.module';
import {LandingComponent} from './landing/landing.component';
import {SharedModule} from '../shared/shared.module';
import {MaterialNavbarModule} from '@common/core/ui/material-navbar/material-navbar.module';
import {AdHostModule} from '@common/core/ui/ad-host/ad-host.module';
import {TranslationsModule} from '@common/core/translations/translations.module';
import {FormatPipesModule} from '@common/core/ui/format-pipes/format-pipes.module';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {NoResultsMessageModule} from '@common/core/ui/no-results-message/no-results-message.module';
import {LoadingIndicatorModule} from '@common/core/ui/loading-indicator/loading-indicator.module';
import {AppFooterModule} from '@common/shared/app-footer/app-footer.module';
import {ImageOrIconModule} from '@common/core/ui/image-or-icon/image-or-icon.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DashboardRoutingModule,
        SharedModule,
        CustomDomainModule,
        MaterialNavbarModule,
        AdHostModule,
        TranslationsModule,
        FormatPipesModule,
        NoResultsMessageModule,
        LoadingIndicatorModule,
        AppFooterModule,
        ImageOrIconModule,

        // material
        MaterialModule,
        MatTabsModule,
        MatIconModule,
        MatButtonModule,
    ],
    declarations: [
        DashboardComponent,
        NewProjectPageComponent,
        TemplatesInfiniteScrollDirective,
        LandingComponent,
    ],
})
export class DashboardModule {
}
