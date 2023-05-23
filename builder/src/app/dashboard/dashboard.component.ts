import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CurrentUser} from '@common/auth/current-user';
import {Toast} from '@common/core/ui/toast.service';
import {FormControl, FormGroup} from '@angular/forms';
import {Project} from '../shared/projects/Project';
import {Projects} from '../shared/projects/projects.service';
import {ProjectUrl} from '../shared/projects/project-url.service';
import {debounceTime, distinctUntilChanged, skip} from 'rxjs/operators';
import {Settings} from '@common/core/config/settings.service';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {Paginator} from '@common/shared/paginator.service';
import {BehaviorSubject} from 'rxjs';
import {ConfirmModalComponent} from '@common/core/ui/confirm-modal/confirm-modal.component';
import {removeProtocol} from '@common/core/utils/remove-protocol';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {ProjectSettingsModalComponent} from '../shared/projects/project-settings-modal/project-settings-modal.component';
import {UserDomainsService} from './user-domains.service';

declare interface ProjectFilters {
    order: string;
    status: string;
    query: string;
}

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
    public loading$ = new BehaviorSubject<boolean>(false);
    public projects$ = new BehaviorSubject<Project[]>([]);
    private projectPaginator: Paginator<Project>;

    public models = new FormGroup({
        query:  new FormControl(''),
        order: new FormControl('created_at|desc'),
        published: new FormControl('all')
    });

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public settings: Settings,
        public currentUser: CurrentUser,
        private projectsApi: Projects,
        private toast: Toast,
        private modal: Modal,
        private projectUrl: ProjectUrl,
        private http: AppHttpClient,
        public userDomains: UserDomainsService,
    ) {}

    ngOnInit() {
        this.userDomains.fetch();
        this.route.data.subscribe(data => {
            this.projects$.next(data.projects || []);
        });
        this.bindToProjectFilters();
    }

    public openBuilder(project: Project) {
        this.loading$.next(true);
        this.router.navigate(['/design', project.id]).then(() => {
            this.loading$.next(true);
        });
    }

    public getProjectImage(project: Project) {
        return `${this.projectUrl.getBaseUrl(project)}thumbnail.png?timestamp=${project.created_at}`;
    }

    public getProjectUrl(project: Project, removeProto = false) {
        let url = this.projectUrl.getProductionUrl(project);
        if (removeProto) {
            url = removeProtocol(url);
        }
        return url;
    }

    public openProjectSettingsModal(project: Project) {
        this.modal.open(ProjectSettingsModalComponent, {project})
            .afterClosed()
            .subscribe(newProject => {
                if ( ! newProject || ! newProject.model) return;
                const newProjects = [...this.projects$.value];
                const i = newProjects.findIndex(curr => curr.id === newProject.model.id);
                newProjects[i] = newProject.model;
                this.projects$.next(newProjects);
            });
    }

    public deleteProjectWithConfirmation(project: Project) {
        this.modal.open(ConfirmModalComponent, {
            title: 'Delete Project',
            body: 'Are you sure you want to delete this project?',
            ok: 'Delete',
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;

            this.projectsApi.delete([project.id]).subscribe(() => {
                this.toast.open('Project deleted');
                const newProjects = [...this.projects$.value];
                newProjects.splice(newProjects.indexOf(project), 1);
                this.projects$.next(newProjects);
            });
        });
    }

    private bindToProjectFilters() {
        this.projectPaginator = new Paginator<Project>(this.router, this.http);
        this.projectPaginator.dontUpdateQueryParams = true;
        this.projectPaginator.response$
            .pipe(skip(1))
            .subscribe(response => {
                this.loading$.next(false);
                this.projects$.next(response.pagination.data);
            }, () => this.loading$.next(false));
        this.models.valueChanges.pipe(debounceTime(250), distinctUntilChanged())
            .subscribe((params: ProjectFilters) => {
                this.loading$.next(true);
                const merged = {...params, user_id: this.currentUser.get('id'), per_page: 20};
                this.projectPaginator.paginate(merged, 'projects');
            });
    }
}
