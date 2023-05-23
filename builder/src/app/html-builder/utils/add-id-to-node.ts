import {randomString} from '@common/core/utils/random-string';

export function addIdToNode(node: HTMLElement, recursive = false) {
    if (!node.dataset.arId) {
        node.dataset.arId = randomString(10);
    }
    if (recursive) {
        for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i] as HTMLElement;
            addIdToNode(child, true);
            child.dataset.arId = randomString(10);
        }
    }
}
