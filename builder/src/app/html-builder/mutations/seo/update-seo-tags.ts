import {BaseMutation} from '../base-mutation';
import {PageSeoValues} from '../../sidebar/pages-panel/page-seo-values';
import {setMetaTagValue} from '../../utils/set-meta-tag-value';
import {setTitleTagValue} from '../../utils/set-title-tag-value';

export class UpdateSeoTags extends BaseMutation {
    constructor(protected tags: PageSeoValues) {
        super(null);
    }

    protected executeMutation(doc: Document): boolean {
        setMetaTagValue('keywords', this.tags.keywords, doc);
        setTitleTagValue(this.tags.title, doc);
        setMetaTagValue('description', this.tags.description, doc);
        return true;
    }

    protected undoMutation(doc: Document): boolean {
        return false;
    }
}
