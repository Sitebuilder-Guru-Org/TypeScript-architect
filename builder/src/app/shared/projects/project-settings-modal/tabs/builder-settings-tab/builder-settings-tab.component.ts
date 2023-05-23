import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {ProjectSettingsService} from '../../project-settings.service';

@Component({
    selector: 'builder-settings-tab',
    templateUrl: './builder-settings-tab.component.html',
    styleUrls: ['./builder-settings-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderSettingsTabComponent implements OnInit {
    constructor( public projectSettings: ProjectSettingsService,) {}

    ngOnInit(): void {}
}
