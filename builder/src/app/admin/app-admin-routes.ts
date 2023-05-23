import {Routes} from '@angular/router';
import {BuilderSettingsComponent} from './settings/builder/builder-settings.component';
import {ProjectIndexComponent} from './projects/project-index.component';
import {TemplateIndexComponent} from './templates/template-index.component';

export const APP_ADMIN_ROUTES: Routes = [
    {
        path: 'templates',
        component: TemplateIndexComponent,
        data: {permissions: ['templates.view']}
    },
    {
        path: 'projects',
        component: ProjectIndexComponent,
        data: {permissions: ['projects.view']}
    },
];

export const APP_SETTING_ROUTES: Routes = [
    {
        path: 'builder',
        component: BuilderSettingsComponent,
    },
];
