import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    Optional,
} from '@angular/core';
import {OverlayPanelRef} from '@common/core/ui/overlay-panel/overlay-panel-ref';
import {Settings} from '@common/core/config/settings.service';
import {LazyLoaderService} from '@common/core/utils/lazy-loader.service';
import {FormControl} from '@angular/forms';
import {filterDatatableData} from '@common/datatable/utils/filter-datatable-data';
import {
    getFontAwesomeIconList,
    IconConfig,
} from '../../utils/get-font-awesome-icon-list';

@Component({
    selector: 'icon-selector-overlay',
    templateUrl: './icon-selector-overlay.component.html',
    styleUrls: ['./icon-selector-overlay.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {class: 'builder-overlay'},
})
export class IconSelectorOverlayComponent implements OnInit {
    allIcons: IconConfig[] = [];
    filteredIcons: IconConfig[] = [];

    searchControl = new FormControl();

    constructor(
        @Inject(OverlayPanelRef) @Optional() public overlayRef: OverlayPanelRef,
        private settings: Settings,
        private lazyLoader: LazyLoaderService,
        private cd: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.loadFontAwesome().then(() => {
            this.allIcons = getFontAwesomeIconList();
            this.filteredIcons = [...this.allIcons];
            this.cd.markForCheck();
        });
        this.searchControl.valueChanges.subscribe(query => {
            if (query) {
                this.filteredIcons = filterDatatableData(this.allIcons, query);
            } else {
                this.filteredIcons = this.allIcons;
            }
        });
    }

    selectIcon(icon: string) {
        this.overlayRef.close(icon);
    }

    private loadFontAwesome(): Promise<any> {
        const url = `${this.settings.getBaseUrl()}/builder/font-awesome/font-awesome.min.css`;
        return this.lazyLoader.loadAsset(url, {type: 'css'});
    }
}
