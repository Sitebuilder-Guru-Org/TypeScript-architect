import {environment} from '../environments/environment';
import {AppConfig} from '@common/core/config/app-config';

export const ARCHITECT_CONFIG: AppConfig = {
    assetsPrefix: 'client',
    environment: environment.production ? 'production' : 'dev',
    navbar: {
        defaultPosition: 'dashboard',
        defaultColor: 'primary',
        dropdownItems: [
            {route: '/dashboard', name: 'Dashboard', icon: 'web-design-custom'},
        ]
    },
    auth: {
        color: 'primary',
        redirectUri: 'dashboard',
        adminRedirectUri: 'dashboard',
    },
    translations: {
        uploads_disk_driver_description: 'Where public uploads (builder images, user avatars etc.) should be stored.'
    },
    admin: {
        pages: [
            {name: 'templates', icon: 'web-design-custom', route: 'templates', permission: 'templates.view'},
            {name: 'projects', icon: 'dashboard', route: 'projects', permission: 'projects.view'},
        ],
        settingsPages: [
            {name: 'builder', route: 'builder'},
        ],
        ads: [
            {slot: 'ads.dashboard_top', description: 'This will appear at the top of user dashboard.'},
            {slot: 'ads.dashboard_bottom', description: 'This will appear at the bottom of user dashboard.'},
        ],
    },
};
