import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GuestGuard} from '@common/guards/guest-guard.service';
import {ContactComponent} from '@common/contact/contact.component';
import {LandingComponent} from './dashboard/landing/landing.component';
import {AuthGuard} from '@common/guards/auth-guard.service';

const routes: Routes = [
    {path: '', component: LandingComponent, canActivate: [GuestGuard]},
    {
        path: 'design',
        canLoad: [AuthGuard],
        loadChildren: () =>
            import('src/app/html-builder/html-builder.module').then(
                m => m.HtmlBuilderModule
            ),
    },
    {
        path: 'admin',
        loadChildren: () =>
            import('src/app/admin/app-admin.module').then(
                m => m.AppAdminModule
            ),
    },
    {
        path: 'billing',
        loadChildren: () =>
            import('@common/billing/billing.module').then(m => m.BillingModule),
    },
    {
        path: 'notifications',
        loadChildren: () =>
            import('@common/notifications/notifications.module').then(
                m => m.NotificationsModule
            ),
    },
    {
        path: 'api-docs',
        loadChildren: () =>
            import('@common/api-docs/api-docs.module').then(
                m => m.ApiDocsModule
            ),
    },
    {path: 'contact', component: ContactComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})],
    exports: [RouterModule],
})
export class AppRoutingModule {}
