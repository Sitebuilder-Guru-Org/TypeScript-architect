import {Injectable} from '@angular/core';
import {Settings} from '@common/core/config/settings.service';
import {CurrentUser} from '@common/auth/current-user';
import {Project} from './Project';

@Injectable({
    providedIn: 'root',
})
export class ProjectUrl {
    constructor(private settings: Settings, private currentUser: CurrentUser) {}

    getBaseUrl(project: Project, relative: boolean = false): string {
        const uri = `projects/${this.getProjectUserId(project)}/${
            project.uuid
        }/`;

        if (relative) return uri;

        return `${this.settings.getBaseUrl()}/storage/${uri}`;
    }

    getProductionUrl(project: Project, destination?: string): string {
        if (!destination) {
            destination = project.settings.publishDestination as string;
        }
        if (destination === 'customDomain' && project.domain) {
            return project.domain.host;
        } else if (destination === 'subdomain') {
            return this.getSubdomainUrl(project);
        } else {
            return this.getDefaultUrl(project);
        }
    }

    getDefaultUrl(project: Project): string {
        const base = this.settings.getBaseUrl(true);
        return `${base}/sites/${project.slug}`.replace(/\/$/, '');
    }

    getSubdomainUrl(project: Project): string {
        const base = this.settings.getBaseUrl(true);
        // strip pathname from url if generating subdomain
        const parsed = new URL(base);
        return `${parsed.protocol}//${project.slug}.${parsed.host}`.replace(
            /\/$/,
            ''
        );
    }

    private getProjectUserId(project: Project): number | string {
        if (!project.users || !project.users.length) {
            return this.currentUser.get('id');
        }
        return project.users[0].id;
    }
}
