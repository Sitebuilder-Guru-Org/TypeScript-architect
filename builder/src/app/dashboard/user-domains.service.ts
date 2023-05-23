import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {CustomDomain} from '@common/custom-domain/custom-domain';
import {CustomDomainService} from '@common/custom-domain/custom-domain.service';
import {CurrentUser} from '@common/auth/current-user';
import {CrupdateCustomDomainModalComponent} from '@common/custom-domain/crupdate-custom-domain-modal/crupdate-custom-domain-modal.component';
import {Project} from '../shared/projects/Project';
import {ConfirmModalComponent} from '@common/core/ui/confirm-modal/confirm-modal.component';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {Toast} from '@common/core/ui/toast.service';
import {tap} from 'rxjs/operators';

interface ProjectDomain extends CustomDomain {
    resource: Project;
}

@Injectable({
    providedIn: 'root',
})
export class UserDomainsService {
    domains$ = new BehaviorSubject<ProjectDomain[]>([]);
    fetched = false;
    constructor(
        private customDomains: CustomDomainService,
        private currentUser: CurrentUser,
        private modal: Modal,
        private toast: Toast,
    ) {}

    fetch() {
        if (this.fetched) return;
        this.customDomains
            .index({userId: this.currentUser.get('id'), with: ['resource']})
            .subscribe(response => {
                this.domains$.next(response.pagination.data as ProjectDomain[]);
                this.fetched = true;
            });
    }

    openConnectDomainModal(): Observable<ProjectDomain> {
        return this.modal.open(CrupdateCustomDomainModalComponent, {resourceName: 'projects'})
            .afterClosed()
            .pipe(tap(newDomain => {
                if (newDomain) {
                    this.domains$.next([...this.domains$.value, newDomain]);
                }
            }));
    }

    attachDomainToProject(project: Project, domain: ProjectDomain): Observable<any> {
        return this.customDomains.update(domain.id, {resource_id: project.id, resource_type: 'App\\Project'})
            .pipe(tap(() => {
                const domains = [...this.domains$.value];
                const i = domains.findIndex(d => d.id === domain.id);
                domains[i].resource = project;
                this.domains$.next(domains);
            }));
    }

    maybeRemoveDomain(domain: ProjectDomain) {
        this.modal.show(ConfirmModalComponent, {
            title: 'Remove Domain',
            body:  'Are you sure you want to permanently remove this domain from your account?',
            ok:    'Remove'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.removeDomain(domain);
        });
    }

    private removeDomain(domain: ProjectDomain) {
        this.customDomains.delete([domain.id]).subscribe(() => {
            const newDomains = this.domains$.value.filter(d => d.id !== domain.id);
            this.domains$.next(newDomains);
            this.toast.open('Domain removed.');
        });
    }
}
