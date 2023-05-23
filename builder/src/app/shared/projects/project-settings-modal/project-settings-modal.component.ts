import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Settings} from '@common/core/config/settings.service';
import {Project} from '../Project';
import {ProjectSettingsService} from './project-settings.service';

@Component({
    selector: 'project-settings-modal',
    templateUrl: './project-settings-modal.component.html',
    styleUrls: ['./project-settings-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ProjectSettingsService],
})
export class ProjectSettingsModalComponent implements OnInit {
    constructor(
        private dialogRef: MatDialogRef<ProjectSettingsModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {project: Project},
        public settings: Settings,
        public projectSettings: ProjectSettingsService
    ) {}

    ngOnInit() {
        this.projectSettings.init(this.data.project, this.dialogRef);
    }

    close() {
        this.dialogRef.close();
    }
}
