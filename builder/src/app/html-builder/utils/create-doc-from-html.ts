import {randomString} from '@common/core/utils/random-string';

export function createDocFromHtml(html: string): Document {
    const dom = new DOMParser().parseFromString(html?.trim(), 'text/html');
    const tw = dom.createTreeWalker(
        dom.documentElement,
        NodeFilter.SHOW_ELEMENT
    );
    let next;
    while ((next = tw.nextNode())) {
        next.dataset.arId = randomString(10);
    }
    return dom;
}
