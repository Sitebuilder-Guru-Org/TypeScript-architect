import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ProjectSettingsService} from '../../project-settings.service';
import {finalize} from 'rxjs/operators';
import {Projects} from '../../../projects.service';
import {Settings} from '@common/core/config/settings.service';
import {ProjectUrl} from '../../../project-url.service';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {CustomDomainService} from '@common/custom-domain/custom-domain.service';
import {UserDomainsService} from '../../../../../dashboard/user-domains.service';
import {CurrentUser} from '@common/auth/current-user';

@Component({
    selector: 'site-url-tab',
    templateUrl: './site-url-tab.component.html',
    styleUrls: ['./site-url-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteUrlTabComponent implements OnInit {
    constructor(
        private modal: Modal,
        public projectSettings: ProjectSettingsService,
        private customDomains: CustomDomainService,
        private projects: Projects,
        public settings: Settings,
        public projectUrl: ProjectUrl,
        public userDomains: UserDomainsService,
        public currentUser: CurrentUser
    ) {}

    ngOnInit() {
        this.userDomains.fetch();
    }

    toggleProjectState(published: boolean) {
        this.projectSettings.loading$.next(true);
        this.projects
            .toggleState(this.projectSettings.project.id, published)
            .pipe(finalize(() => this.projectSettings.loading$.next(false)))
            .subscribe(response => {
                this.projectSettings.project.published =
                    response.project.model.published;
            });
    }

    openConnectDomainModal() {
        this.userDomains.openConnectDomainModal().subscribe(newDomain => {
            if (newDomain) {
                this.userDomains
                    .attachDomainToProject(
                        this.projectSettings.project,
                        newDomain
                    )
                    .subscribe(() => {
                        this.projectSettings.project.domain = newDomain;
                        this.projectSettings.form.patchValue({
                            customDomainId: newDomain.id,
                        });
                    });
            }
        });
    }
}
