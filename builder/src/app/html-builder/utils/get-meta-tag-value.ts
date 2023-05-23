export function getMetaTagValue(tagName: string, doc: Document) {
    const node = doc.querySelector(`meta[name=${tagName}]`);
    return node && node.getAttribute('content');
}
