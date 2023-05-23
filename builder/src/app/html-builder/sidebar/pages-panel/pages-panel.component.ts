import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Toast} from '@common/core/ui/toast.service';
import {Projects} from '../../../shared/projects/projects.service';
import {getProductionHtml} from '../../utils/parse-html-into-document';
import {BehaviorSubject} from 'rxjs';
import {FormBuilder, FormControl} from '@angular/forms';
import {BLANK_PAGE_SKELETON} from '../../../shared/crupdate-project-modal/blank-page-skeleton';
import {getMetaTagValue} from '../../utils/get-meta-tag-value';
import {BuilderStateService} from '../../builder-state.service';
import {getTitleTagValue} from '../../utils/get-title-tag-value';
import {PageSeoValues} from './page-seo-values';
import {MutationsService} from '../../mutations/mutations.service';
import {UpdateSeoTags} from '../../mutations/seo/update-seo-tags';
import {take} from 'rxjs/operators';
import {BuilderPage} from '../../../shared/builder-types';
import {addIdToPages} from '../../utils/add-id-to-pages';
import {LivePreview} from '../../live-preview.service';
import {ActiveProject} from '../../projects/active-project';

@Component({
    selector: 'pages-panel',
    templateUrl: './pages-panel.component.html',
    styleUrls: ['./pages-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagesPanelComponent implements OnInit {
    loading$ = new BehaviorSubject(false);
    activePageControl = new FormControl();
    pageForm = this.fb.group({
        name: [''],
        title: [''],
        description: [''],
        keywords: [''],
    });

    constructor(
        private projects: Projects,
        private toast: Toast,
        private fb: FormBuilder,
        public state: BuilderStateService,
        private mutations: MutationsService,
        private livePreview: LivePreview,
        private activeProject: ActiveProject
    ) {}

    ngOnInit() {
        this.state.previewDocReloaded$.pipe(take(1)).subscribe(() => {
            this.activePageControl.valueChanges.subscribe(pageId => {
                // initial "index" page will be already loaded,
                // make sure to not reload it again needlessly
                if (pageId !== this.state.activePage$.value.id) {
                    this.state.setActivePage(pageId);
                }
            });

            this.state.activePage$.subscribe(page => {
                if (page) {
                    this.activePageControl.setValue(page.id);
                    this.hydrateUpdateModel();
                }
            });
        });
    }

    async createNewPage() {
        this.loading$.next(true);

        let name = `page-${this.state.pages$.value.length + 1}`;
        // make sure we don't duplicate page names
        if (this.state.pages$.value.find(page => page.name === name)) {
            name += '-copy';
        }

        await this.addPage({
            name,
            html: getProductionHtml(BLANK_PAGE_SKELETON),
        });

        this.hydrateUpdateModel();
        await this.activeProject.save();
        this.activePageControl.setValue(this.state.activePage$.value.id);
        this.loading$.next(false);
        this.toast.open('Page created');
    }

    canDeleteSelectedPage() {
        return (
            this.state.activePage$.value?.name?.toLowerCase() !== 'index' &&
            this.state.pages$.value.length > 1
        );
    }

    updateSelectedPage() {
        this.loading$.next(true);

        const pageValue = this.pageForm.getRawValue() as PageSeoValues;
        this.mutations.execute(new UpdateSeoTags(pageValue), {
            skipUndoStack: true,
        });

        const pages = [...this.state.pages$.value];
        const i = pages.findIndex(
            page => page.id === this.state.activePage$.value.id
        );
        pages[i].html = this.state.activePage$.value.doc.documentElement.outerHTML;
        pages[i].name = pageValue.name;
        this.state.pages$.next(pages);

        this.activeProject.save(false).then(() => {
            this.loading$.next(false);
            this.toast.open('Page updated');
        });
    }

    deleteSelectedPage() {
        this.loading$.next(true);

        const page = this.state.activePage$.value;
        const pages = this.state.pages$.value;
        this.state.pages$.next(pages.filter(p => p.id !== page.id));
        this.activePageControl.setValue(pages[pages.length - 1].id);

        this.activeProject.save(false).then(() => {
            this.loading$.next(false);
            this.toast.open('Page deleted');
        });
    }

    duplicateSelectedPage() {
        this.loading$.next(true);

        const activePage = this.state.activePage$.value;
        this.addPage({
            name: activePage.name + '-copy',
            html: activePage.doc.documentElement.outerHTML,
        });

        this.activeProject.save(false).then(() => {
            this.loading$.next(false);
            this.toast.open('Page duplicated');
        });
    }

    private addPage(page: BuilderPage) {
        this.state.pages$.next(
            addIdToPages([page, ...this.state.pages$.value])
        );
        this.activePageControl.setValue(page.id);
    }

    private hydrateUpdateModel() {
        const pageName = this.state.activePage$.value.name;
        this.pageForm.patchValue({
            name: pageName,
            title: getTitleTagValue(this.state.previewDoc),
            description: getMetaTagValue('description', this.state.previewDoc),
            keywords: getMetaTagValue('keywords', this.state.previewDoc),
        });
        if (pageName === 'index') {
            this.pageForm.get('name').disable();
        } else {
            this.pageForm.get('name').enable();
        }
    }
}
