import {Component, Inject, OnInit, Optional} from '@angular/core';
import {OverlayPanelRef} from '@common/core/ui/overlay-panel/overlay-panel-ref';
import {BehaviorSubject} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {OVERLAY_PANEL_DATA} from '@common/core/ui/overlay-panel/overlay-panel-data';
import {skip} from 'rxjs/operators';
import {BuilderStateService} from '../../builder-state.service';
import {removeNullFromObject} from '@common/core/utils/remove-null-from-object';

const LINK_TYPES = ['none', 'url', 'page', 'anchor', 'download', 'email'];

export interface LinkEditorValue {
    href: string;
    download?: string;
    target?: string;
}

@Component({
    selector: 'link-editor',
    templateUrl: './link-editor.component.html',
    styleUrls: ['./link-editor.component.scss'],
})
export class LinkEditorComponent implements OnInit {
    linkTypes = LINK_TYPES;
    anchors$ = new BehaviorSubject<string[]>([]);
    selectedType$ = new BehaviorSubject<string>('url');
    form = this.fb.group({
        href: '',
        download: '',
        target: '',
        subject: '',
    });

    constructor(
        public state: BuilderStateService,
        private fb: FormBuilder,
        @Inject(OVERLAY_PANEL_DATA)
        @Optional()
        public data: {link?: HTMLLinkElement},
        @Inject(OverlayPanelRef) @Optional() public overlayRef: OverlayPanelRef
    ) {}

    ngOnInit() {
        this.gatherActivePageAnchors();
        this.hydrateForm();
        this.bindToSelectedTypeChange();
    }

    submit() {
        const value = {...this.form.value};
        if (this.selectedType$.value === 'email') {
            value.href = `mailto:${value.href}?subject=${value.subject}`;
        } else if (this.selectedType$.value === 'page') {
            value.href += '.html';
        } else if (this.selectedType$.value === 'anchor') {
            value.href = `#${value.href}`;
        }
        delete value.subject;
        this.close(removeNullFromObject(value));
    }

    close(value?: LinkEditorValue) {
        this.overlayRef.close(value);
    }

    private gatherActivePageAnchors() {
        this.anchors$.next(
            Array.from(this.state.previewDoc.querySelectorAll('*[id]')).map(
                (el: HTMLElement) => el.id
            )
        );
    }

    private bindToSelectedTypeChange() {
        this.selectedType$.pipe(skip(1)).subscribe(() => {
            let href = '';
            if (this.selectedType$.value === 'page') {
                href = this.state.pages$.value[0].name;
            } else if (this.selectedType$.value === 'anchor') {
                href = this.anchors$.value[0];
            }
            this.form.reset({
                href,
                target: '',
                download: '',
            });
        });
    }

    private hydrateForm() {
        if (!this.data.link) return;
        let href = this.data.link.getAttribute('href') ?? '';

        if (this.data.link.getAttribute('download')) {
            this.selectedType$.next('download');
            const fileName = this.data.link.getAttribute('download');
            this.form.patchValue({href, download: fileName});
        } else if (href.startsWith('mailto:')) {
            this.selectedType$.next('email');
            href = href.split('?subject')[0].replace('mailto:', '');
            this.form.patchValue({href});
        } else if (href.startsWith('#')) {
            this.selectedType$.next('anchor');
            this.form.patchValue({href: href.replace('#', '')});
        } else if (href.endsWith('.html')) {
            this.selectedType$.next('page');
            this.form.patchValue({href: href.replace('.html', '')});
        } else {
            this.selectedType$.next('url');
            this.form.patchValue({href});
        }
    }
}
