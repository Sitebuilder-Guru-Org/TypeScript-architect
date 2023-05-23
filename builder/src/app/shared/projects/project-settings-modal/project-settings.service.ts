import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {Project} from '../Project';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {MatDialogRef} from '@angular/material/dialog';
import {Toast} from '@common/core/ui/toast.service';
import {FtpDetails} from '../../builder-types';
import {Settings} from '@common/core/config/settings.service';

@Injectable({
    providedIn: 'root',
})
export class ProjectSettingsService {
    loading$ = new BehaviorSubject<boolean>(false);
    form = this.fb.group({
        formsEmail: '',
        slug: '',
        publishDestination: '',
        customDomainId: null,
        storeCredentials: false,
        builder: this.fb.group({
            autoSave: false,
            selectedContextActions: false,
            hoverContextActions: true,
        }),
        ftpCredentials: this.fb.group({
            host: '',
            username: '',
            password: '',
            directory: '',
            port: 21,
            ssl: false,
            remember: false,
        }),
    });
    project: Project;
    private dialogRef: MatDialogRef<any>;

    constructor(
        private fb: FormBuilder,
        private http: AppHttpClient,
        private toast: Toast,
        private settings: Settings
    ) {}

    init(project: Project, dialogRef: MatDialogRef<any>) {
        this.project = project;
        this.dialogRef = dialogRef;
        this.hydrateForm();
    }

    submitForm() {
        this.http
            .post(`projects/${this.project.id}/settings`, this.form.value)
            .subscribe((response: {project: Project}) => {
                this.dialogRef.close(response.project);
                this.toast.open('Settings saved');
            });
    }

    private hydrateForm() {
        const formData = {...this.project.settings};
        formData.slug = this.project.slug;

        if (!formData.formsEmail) {
            formData.formsEmail = this.project.users[0].email;
        }

        if (!formData.publishDestination) {
            formData.publishDestination = 'default';
        }

        if (!formData.customDomainId) {
            formData.customDomainId = this.project.domain?.id;
        }

        let ftp = (formData.ftpCredentials || {}) as FtpDetails;
        if (!ftp.host) {
            ftp = this.settings.getJson('publish.default_credentials', {
                port: 21,
                ssl: false,
            });
        }
        if (!ftp.directory) {
            ftp.directory = this.project.slug;
        }

        this.form.patchValue({...formData, ftpCredentials: ftp});
    }
}
