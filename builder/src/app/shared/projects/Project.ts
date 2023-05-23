import {User} from '@common/core/types/models/User';
import {CustomDomain} from '@common/custom-domain/custom-domain';
import {BuilderPage, FtpDetails} from '../builder-types';

export interface Project {
    id: number;
    name: string;
    slug: string;
    published: boolean;
    uuid?: string;
    template: string;
    users?: User[];
    pages?: BuilderPage[];
    domain?: CustomDomain;
    settings?: Record<string, string|number|boolean|FtpDetails>;
    created_at?: string;
    updated_at?: string;
}
