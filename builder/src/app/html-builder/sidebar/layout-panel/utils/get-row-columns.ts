import {getColumnSpan} from './get-column-span';
import {getNodeId} from '../../../utils/get-node-id';
import {Column} from '../layout-panel-types';

export function getRowColumns(row: HTMLElement): Column[] {
    return Array.from(row?.children || [])
        .filter(n => {
            return n.className.indexOf('col-') > -1;
        })
        .map((node: HTMLElement) => {
            return {
                span: getColumnSpan(node),
                id: getNodeId(node),
            };
        });
}
