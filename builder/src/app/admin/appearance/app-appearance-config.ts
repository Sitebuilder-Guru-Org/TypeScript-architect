import {HomepageAppearancePanelComponent} from './homepage-appearance-panel/homepage-appearance-panel.component';
import {AppearanceEditorConfig} from '@common/admin/appearance/appearance-editor-config.token';

export const APP_APPEARANCE_CONFIG: AppearanceEditorConfig = {
    defaultRoute: 'dashboard',
    navigationRoutes: [
        'dashboard',
        'dashboard/projects/new',
        'design',
        'account/settings',
        'admin',
    ],
    menus: {
        availableRoutes: [
            'dashboard',
            'dashboard/projects/new',
        ],
        positions: [
            'dashboard',
            'footer',
        ]
    },
    sections: [
        {
            name: 'landing page',
            component: HomepageAppearancePanelComponent,
            position: 1,
            route: '/',
        }
    ]
};
