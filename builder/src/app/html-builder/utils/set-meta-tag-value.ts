export function setMetaTagValue(tagName: string, value: string, doc: Document) {
    let node = doc.querySelector(`meta[name=${tagName}]`);
    if (!node) {
        node = doc.createElement('meta');
        doc.head.appendChild(node);
    }
    node.setAttribute('name', tagName);
    node.setAttribute('content', value);
}
