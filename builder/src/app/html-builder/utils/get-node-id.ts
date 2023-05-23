export function getNodeIds(nodes: NodeListOf<HTMLElement>): string[] {
    const ids = [];
    nodes.forEach(node => {
        ids.push(getNodeId(node));
    });
    return ids;
}

export function getNodeId(node: HTMLElement): string | null {
    return node?.dataset?.arId || null;
}
