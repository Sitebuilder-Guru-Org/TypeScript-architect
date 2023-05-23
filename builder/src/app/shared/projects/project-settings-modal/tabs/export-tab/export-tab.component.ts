import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {Projects} from '../../../projects.service';
import {ProjectSettingsService} from '../../project-settings.service';
import {Toast} from '@common/core/ui/toast.service';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';
import {Settings} from '@common/core/config/settings.service';
import {CurrentUser} from '@common/auth/current-user';
import {downloadFileFromUrl} from '@common/uploads/utils/download-file-from-url';
import {FtpDetails} from '../../../../builder-types';

export interface FtpDetailsErrors extends FtpDetails {
    general?: string;
}

@Component({
    selector: 'export-tab',
    templateUrl: './export-tab.component.html',
    styleUrls: ['./export-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportTabComponent {
    exportType = new FormControl('download');
    publishing$ = new BehaviorSubject<boolean>(false);

    errors: FtpDetailsErrors = {};

    constructor(
        private projects: Projects,
        public projectSettings: ProjectSettingsService,
        private toast: Toast,
        public settings: Settings,
        public currentUser: CurrentUser
    ) {}

    async downloadProject() {
        downloadFileFromUrl(
            this.settings.getBaseUrl(true) +
                '/secure/projects/' +
                this.projectSettings.project.id +
                '/download'
        );
    }

    exportToFTP() {
        this.publishing$.next(true);
        this.projects
            .exportToFtp(
                this.projectSettings.project.id,
                this.projectSettings.form.value.ftpCredentials
            )
            .subscribe(
                () => {
                    this.publishing$.next(false);
                    this.toast.open('Project exported');
                },
                (errResponse: BackendErrorResponse) => {
                    this.errors = errResponse.errors;
                    this.publishing$.next(false);
                }
            );
    }
}
