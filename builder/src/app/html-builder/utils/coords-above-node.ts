export function coordsAboveNode(
    node: HTMLElement,
    x: number,
    y: number
): boolean {
    if (node.nodeName === '#text') return;

    const offset = node.getBoundingClientRect();
    const width = node.offsetWidth;
    const height = node.offsetHeight;

    const box = [
        [offset.left, offset.top], // top left
        [offset.left + width, offset.top], // top right
        [offset.left + width, offset.top + height], // bottom right
        [offset.left, offset.top + height], // bottom left
    ];

    const beforePointY = box[0][1];
    const beforePointX = box[0][0];

    if (y < box[2][1]) {
        return y < beforePointY || x < beforePointX;
    }

    // x horizontal, y vertical

    return false;
}
