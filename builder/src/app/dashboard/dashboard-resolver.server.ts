import {Injectable} from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import {CurrentUser} from '@common/auth/current-user';
import {Projects} from '../shared/projects/projects.service';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class DashboardResolver implements Resolve<any> {
    constructor(
        private router: Router,
        private projects: Projects,
        private currentUser: CurrentUser
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        return this.projects
            .all({user_id: this.currentUser.get('id'), per_page: 30})
            .pipe(
                catchError(() => []),
                map(response => {
                    return response.pagination.data;
                })
            );
    }
}
