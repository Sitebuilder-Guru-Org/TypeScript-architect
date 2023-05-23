import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HtmlBuilderComponent} from './html-builder/html-builder.component';
import {AuthGuard} from '@common/guards/auth-guard.service';

const routes: Routes = [
    {
        path: ':id',
        component: HtmlBuilderComponent,
        canActivate: [AuthGuard],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HtmlBuilderRoutingModule {
}
