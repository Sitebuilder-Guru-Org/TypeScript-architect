export function setTitleTagValue(value: string, doc: Document) {
    let node = doc.querySelector('title');
    if (!node) {
        node = doc.createElement('title');
        doc.head.appendChild(node);
    }
    node.innerText = value;
}
