export function getTitleTagValue(doc: Document) {
    const node = doc.querySelector('title');
    return node && node.innerText;
}

