import {Injectable} from '@angular/core';
import {User} from '../core/types/models/User';
import {Role} from '../core/types/models/Role';
import {Subscription} from '../shared/billing/models/subscription';
import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Permission} from '@common/core/types/models/permission';

@Injectable({
    providedIn: 'root',
})
export class CurrentUser {
    model$ = new BehaviorSubject<Partial<User>>(null);
    isLoggedIn$ = this.model$.pipe(map(u => !!u.id));
    private guestsRole: Role;
    private permissions: {[key: string]: Permission} = {};

    /**
     * Uri user was attempting to open before
     * redirect to login page, if any.
     */
    redirectUri?: string;

    get<K extends keyof User>(prop: K): Partial<User>[K] {
        return this.model$.value && this.model$.value[prop];
    }

    getModel(): Partial<User> {
        return {...this.model$.value};
    }

    set(key: string, value: any): void {
        this.model$.next({...this.model$.value, [key]: value});
    }

    assignCurrent(model?: Partial<User>) {
        if (!model) {
            // guest model
            model = {roles: [this.guestsRole], permissions: this.guestsRole.permissions};
        }
        this.setPermissions(model);
        this.model$.next(model);
    }

    hasPermissions(permissions: string[]): boolean {
        return (
            permissions.filter(permission => {
                return !this.hasPermission(permission);
            }).length === 0
        );
    }

    hasPermission(permission: string): boolean {
        return !!this.permissions['admin'] || !!this.permissions[permission];
    }

    hasRole(role: string): boolean {
        return (
            this.model$.value.roles &&
            !!this.model$.value.roles.find(r => r.name === role)
        );
    }

    getRestrictionValue(
        permissionName: string,
        restrictionName: string
    ): number | boolean | null {
        const permission = this.permissions[permissionName];
        let restrictionValue = null;
        if (permission) {
            const restriction = permission.restrictions.find(
                r => r.name === restrictionName
            );
            restrictionValue = restriction ? restriction.value : null;
        }
        return restrictionValue;
    }

    isLoggedIn(): boolean {
        return this.get('id') > 0;
    }

    /**
     * Check if user subscription is active, on trial, or on grace period.
     */
    isSubscribed(): boolean {
        if (!this.model$.value?.subscriptions) return false;
        return this.model$.value.subscriptions.find(sub => sub.valid) !== undefined;
    }

    /**
     * Check if user subscription is active
     */
    subscriptionIsActive(): boolean {
        return this.isSubscribed() && !this.onTrial();
    }

    onTrial() {
        const sub = this.getSubscription();
        return sub && sub.on_trial;
    }

    onGracePeriod(): boolean {
        const sub = this.getSubscription();
        return sub && sub.on_grace_period;
    }

    getSubscription(filters: {gateway?: string; planId?: number} = {}): Subscription {
        if (!this.isSubscribed()) return null;

        let subs = this.model$.value.subscriptions.slice();

        if (filters.gateway) {
            subs = subs.filter(sub => sub.gateway_name === filters.gateway);
        }

        if (filters.planId) {
            subs = subs.filter(sub => sub.plan_id === filters.planId);
        }

        return subs[0];
    }

    setSubscription(subscription: Subscription) {
        const i = this.model$.value.subscriptions.findIndex(
            sub => sub.id === subscription.id
        );

        if (i > -1) {
            this.model$.value.subscriptions[i] = subscription;
        } else {
            this.model$.value.subscriptions.push(subscription);
        }
    }

    isAdmin(): boolean {
        return this.hasPermission('admin');
    }

    init(params: {user?: User; guestsRole: Role}) {
        this.guestsRole = params.guestsRole || ({} as Role);
        this.assignCurrent(params.user);
    }

    private setPermissions(model: Partial<User>) {
        this.permissions = {};
        (model.permissions || []).forEach(permission => {
            this.permissions[permission.name] = permission;
        });
    }
}
