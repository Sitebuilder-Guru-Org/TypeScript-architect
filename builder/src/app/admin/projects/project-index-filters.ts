import {
    DatatableFilter,
    FilterControlType
} from '@common/datatable/datatable-filters/search-input-with-filters/filter-config/datatable-filter';
import {
    CreatedAtFilter,
    UpdatedAtFilter,
} from '@common/datatable/datatable-filters/search-input-with-filters/filter-config/timestamp-filter';
import {FindUserModalComponent} from '@common/auth/find-user-modal/find-user-modal.component';

export const PROJECT_INDEX_FILTERS: DatatableFilter[] = [
    new DatatableFilter({
        type: FilterControlType.Select,
        key: 'published',
        label: 'Status',
        defaultValue: true,
        description: 'Whether project is publicly accessible',
        options: [
            {key: 'Not Published', value: false},
            {key: 'Published', value: true},
        ],
    }),
    new DatatableFilter({
        type: FilterControlType.SelectModel,
        key: 'user_id',
        label: 'Owner',
        description: 'User that has created the project',
        component: FindUserModalComponent,
    }),
    new CreatedAtFilter({
        description: 'Date user registered or was created',
    }),
    new UpdatedAtFilter({
        description: 'Date user was last updated',
    }),
];
