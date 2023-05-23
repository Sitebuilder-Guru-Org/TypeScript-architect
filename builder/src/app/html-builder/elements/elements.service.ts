import {Injectable, Injector} from '@angular/core';
import {Translations} from '@common/core/translations/translations.service';
import {ArchitectElement} from './architect-element';
import * as ArchitectElements from './definitions/all';
import {DivContainerEl} from './definitions/all';
import {ELEMENT_DEFAULTS} from './element-defaults';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {BehaviorSubject} from 'rxjs';
import {Settings} from '@common/core/config/settings.service';

@Injectable({
    providedIn: 'root',
})
export class Elements {
    elements: ArchitectElement[] = [];
    categories$ = new BehaviorSubject<string[]>([]);

    constructor(
        private i18n: Translations,
        private injector: Injector,
        private settings: Settings
    ) {}

    getDisplayName(el: ArchitectElement, node: HTMLElement) {
        if (!el) return;

        if (el instanceof DivContainerEl) {
            if (node.id) {
                return node.id;
            } else if (node.classList[0]) {
                return node.classList[0];
            } else {
                return el.name;
            }
        } else {
            return el.name;
        }
    }

    canInsert(parentNode: HTMLElement, child: ArchitectElement): boolean {
        if (parentNode.nodeName === 'BODY') return true;
        if (parentNode.nodeName === 'HTML') return false;

        const parentEl = this.match(parentNode)?.el;
        if (!parentEl) return;

        // check by architect element types
        if (parentEl.allowedEls.length) {
            return parentEl.allowedEls.some(el => child instanceof el);
        }

        // check by html content category
        if (parentEl.allowedContent && child.contentCategories) {
            return child.contentCategories.some(t =>
                parentEl.allowedContent.includes(t)
            );
        }
    }

    match(node: HTMLElement): {el: ArchitectElement; node: HTMLElement} | null {
        if (!node?.nodeName) return null;
        for (const el of this.elements) {
            const response = el.matcher?.(node);
            if (!!response) {
                return {el, node: response === true ? node : response};
            }
        }
    }

    async init() {
        const customElements = await this.fetchCustomEls();
        const categories: string[] = [];
        // first match custom elements, then bootstrap, then base ones
        this.elements = [...Object.values(ArchitectElements), ...customElements]
            .map((el: any) => {
                if (typeof el === 'function') {
                    el = new el(this.injector);
                }
                el.name = this.i18n.t(el.name);
                if (el.category && !categories.includes(el.category)) {
                    categories.push(el.category);
                }
                return el;
            })
            .sort((a, b) => (a.specificity < b.specificity ? 1 : -1));
        this.categories$.next(categories);
    }

    private async fetchCustomEls(): Promise<ArchitectElement[]> {
        const path = this.settings.getBaseUrl() + `/${AppHttpClient.prefix}/elements/custom`;

        try {
            const module = await import(/* webpackIgnore: true */ path);
            const components = [];
            Object.keys(module).forEach((key, index) => {
                if (!key.startsWith('style') && !key.startsWith('template')) {
                    const component = new module[key](this.injector);
                    component.html = module[`template${index}`];
                    component.css = module[`style${index}`];
                    Object.entries(ELEMENT_DEFAULTS).forEach(
                        ([prop, value]) => {
                            if (typeof component[prop] === 'undefined') {
                                component[prop] = value;
                            }
                        }
                    );
                    components.push(component);
                }
            });
            return components;
        } catch (e) {
            return [];
        }
    }
}
