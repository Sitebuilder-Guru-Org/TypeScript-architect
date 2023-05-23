import {randomString} from '@common/core/utils/random-string';

export function reloadAsset(selector: string, doc: Document) {
    const link = doc.querySelector(selector);
    const oldHref = link.getAttribute('href').split('?')[0];
    const newHref = `${oldHref}?=${randomString(8)}`;
    link.setAttribute('href', newHref);
}
