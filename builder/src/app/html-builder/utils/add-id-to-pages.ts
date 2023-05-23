import {BuilderPage} from '../../shared/builder-types';
import {randomString} from '@common/core/utils/random-string';

export function addIdToPages(pages: BuilderPage[]): BuilderPage[] {
    return pages.map(page => {
        page.id = page.id || randomString(10);
        return page;
    });
}

