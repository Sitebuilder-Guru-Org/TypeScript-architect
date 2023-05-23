import {Injectable} from '@angular/core';
import * as html2canvas from 'html2canvas';
import {Toast} from '@common/core/ui/toast.service';
import {LocalStorage} from '@common/core/services/local-storage.service';
import {ProjectUrl} from '../../shared/projects/project-url.service';
import {Projects} from '../../shared/projects/projects.service';
import {BuilderProject} from '../../shared/builder-types';
import {debounceTime} from 'rxjs/operators';
import {BuilderStateService} from '../builder-state.service';
import {MutationsService} from '../mutations/mutations.service';

@Injectable({
    providedIn: 'root',
})
export class ActiveProject {
    saving = false;

    constructor(
        public projectUrl: ProjectUrl,
        private projects: Projects,
        private toast: Toast,
        private localStorage: LocalStorage,
        private state: BuilderStateService,
        private mutations: MutationsService
    ) {
        this.bindToBuilderDocumentChangeEvent();
    }

    save(
        thumbnail = true,
        payload: object = {}
    ): Promise<{project: BuilderProject} | void> {
        this.saving = true;

        if (thumbnail) {
            this.createThumbnail();
        }

        const project = this.state.project$.value;

        payload = {
            name: project.model.name,
            css: project.css,
            js: project.js,
            ...payload,
            pages: this.state.pages$.value.map(page => {
                return {
                    name: page.name,
                    html: page.doc
                        ? page.doc.documentElement.outerHTML
                        : page.html,
                };
            }),
        };

        return this.projects
            .update(project.model.id, payload)
            .toPromise()
            .then(
                response => {
                    this.state.project$.next(response.project);
                    this.saving = false;
                    return response;
                },
                () => {
                    this.saving = false;
                    this.toast.open('Could not save project');
                }
            );
    }

    getBaseUrl(relative = false): string {
        if (!this.state.project$.value) return '';
        return this.projectUrl.getBaseUrl(
            this.state.project$.value.model,
            relative
        );
    }

    getProductionUrl() {
        return this.projectUrl.getProductionUrl(
            this.state.project$.value.model
        );
    }

    private bindToBuilderDocumentChangeEvent() {
        this.mutations.executed$.pipe(debounceTime(1000)).subscribe(() => {
            if (this.localStorage.get('settings.autoSave')) {
                this.save(false);
            }
        });
    }

    private createThumbnail() {
        const base = document.createElement('base');
        base.href = this.getBaseUrl();
        if (!this.state.previewDoc.head.querySelector('base')) {
            this.state.previewDoc.head.prepend(base);
        }
        const rect =
            this.state.previewDoc.documentElement.getBoundingClientRect();
        (html2canvas as any)(this.state.previewDoc.documentElement, {
            height: rect.height,
            width: rect.width,
        }).then(canvas => {
            base.remove();
            this.projects
                .generateThumbnail(
                    this.state.project$.value.model.id,
                    canvas.toDataURL('image/png')
                )
                .subscribe(
                    () => {},
                    () => {}
                );
        });
    }
}
