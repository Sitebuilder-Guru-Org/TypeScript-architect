import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {CodeEditor} from '../overlays/code-editor/code-editor.service';
import {ActiveProject} from '../projects/active-project';
import {Toast} from '@common/core/ui/toast.service';
import {DeviceSwitcherComponent} from './device-switcher/device-switcher.component';
import {ContextBoxes} from '../live-preview/context-box/context-boxes.service';
import {Projects} from '../../shared/projects/projects.service';
import {CurrentUser} from '@common/auth/current-user';
import {Settings} from '@common/core/config/settings.service';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {MutationsService} from '../mutations/mutations.service';
import {BuilderStateService} from '../builder-state.service';
import {BuilderSidebarPanel} from './builder-sidebar-panel';
import {ContextType} from '../live-preview/context-box/builder-context';
import {ProjectSettingsModalComponent} from '../../shared/projects/project-settings-modal/project-settings-modal.component';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'builder-sidebar',
    templateUrl: './builder-sidebar.component.html',
    styleUrls: ['./builder-sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BuilderSidebarComponent implements OnInit {
    @ViewChild(DeviceSwitcherComponent, {static: false})
    private deviceSwitcher: DeviceSwitcherComponent;
    inspectorPanel = BuilderSidebarPanel;
    settingsModalRef: MatDialogRef<ProjectSettingsModalComponent>;

    constructor(
        public mutations: MutationsService,
        private codeEditor: CodeEditor,
        private projects: Projects,
        public activeProject: ActiveProject,
        public state: BuilderStateService,
        private toast: Toast,
        private el: ElementRef,
        private settings: Settings,
        private contextBoxes: ContextBoxes,
        private modal: Modal,
        public currentUser: CurrentUser
    ) {}

    ngOnInit() {
        this.codeEditor.setOrigin(this.el);
        this.state.inspectorEl = this.el.nativeElement;
    }

    toggleCodeEditor() {
        this.codeEditor.toggle();
    }

    async saveProject() {
        await this.activeProject.save();
        this.toast.open('Project saved');
    }

    openProjectSettingsModal() {
        this.settingsModalRef = this.modal.open(ProjectSettingsModalComponent, {
            project: this.state.project$.value.model,
        });
        this.settingsModalRef.afterClosed().subscribe(project => {
            this.settingsModalRef = null;
            if (project) {
                this.state.project$.next({
                    ...this.state.project$.value,
                    model: project,
                });
            }
        });
    }

    async openPreview() {
        const newWindow = window.open('loading', '_blank');
        await this.activeProject.save();
        let baseUrl = this.activeProject.getProductionUrl();
        const activePage = this.state.activePage$.value;
        if (activePage && activePage.name && activePage.name !== 'index')
            baseUrl += '/' + activePage.name;
        newWindow.location.replace(baseUrl);
    }

    toggleDeviceSwitcher() {
        this.deviceSwitcher.toggleVisibility();
    }
}
