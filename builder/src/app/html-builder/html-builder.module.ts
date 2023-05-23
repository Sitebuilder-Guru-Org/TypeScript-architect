import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HtmlBuilderComponent} from './html-builder/html-builder.component';
import {HtmlBuilderRoutingModule} from './html-builder-routing.module';
import {LivePreviewComponent} from './live-preview/live-preview.component';
import {PreviewDragAndDropDirective} from './live-preview/drag-and-drop/preview-drag-and-drop.directive';
import {ElementsPanelComponent} from './sidebar/elements-panel/elements-panel.component';
import {InspectorPanelComponent} from './sidebar/inspector-panel/inspector-panel.component';
import {AttributesPanelComponent} from './sidebar/inspector-panel/attributes-panel/attributes-panel.component';
import {SpacingPanelComponent} from './sidebar/inspector-panel/spacing-panel/spacing-panel.component';
import {BorderStyleControlsComponent} from './sidebar/inspector-panel/border-style-controls/border-style-controls.component';
import {SideControlBorderComponent} from './sidebar/inspector-panel/spacing-panel/side-control-border/side-control-border.component';
import {BackgroundPanelComponent} from './sidebar/inspector-panel/background-panel/background-panel.component';
import {ShadowsPanelComponent} from './sidebar/inspector-panel/shadows-panel/shadows-panel.component';
import {DragVisualHelperComponent} from './live-preview/drag-and-drop/drag-visual-helper/drag-visual-helper.component';
import {LayoutPanelComponent} from './sidebar/layout-panel/layout-panel.component';
import {ColumnPresetsComponent} from './sidebar/layout-panel/column-presets/column-presets.component';
import {DragElFromSidebarToPreviewDirective} from './live-preview/drag-and-drop/drag-el-from-sidebar-to-preview.directive';
import {InlineTextEditorComponent} from './overlays/inline-text-editor/inline-text-editor.component';
import {CodeEditorComponent} from './overlays/code-editor/code-editor.component';
import {LivePreviewContextMenuComponent} from './overlays/live-preview-context-menu/live-preview-context-menu.component';
import {PagesPanelComponent} from './sidebar/pages-panel/pages-panel.component';
import {ContextBoxComponent} from './live-preview/context-box/context-box.component';
import {LinkEditorComponent} from './overlays/link-editor/link-editor.component';
import {DeviceSwitcherComponent} from './sidebar/device-switcher/device-switcher.component';
import {MaterialModule} from '../material.module';
import {SharedModule} from '../shared/shared.module';
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatRadioModule} from '@angular/material/radio';
import {MatSliderModule} from '@angular/material/slider';
import {MatTabsModule} from '@angular/material/tabs';
import {PortalModule} from '@angular/cdk/portal';
import {OverlayModule} from '@angular/cdk/overlay';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ElementResizerDirective} from './live-preview/drag-and-drop/element-resizer.directive';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TranslationsModule} from '@common/core/translations/translations.module';
import {LoadingIndicatorModule} from '@common/core/ui/loading-indicator/loading-indicator.module';
import {NoResultsMessageModule} from '@common/core/ui/no-results-message/no-results-message.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MainLoaderComponent} from './main-loader/main-loader.component';
import {SkeletonModule} from '@common/core/ui/skeleton/skeleton.module';
import {ColorPickerInputModule} from '@common/core/ui/color-picker/color-picker-input/color-picker-input.module';
import {BackgroundSelectorModule} from '@common/shared/form-controls/background-selector/background-selector.module';
import {GoogleFontSelectorModule} from '@common/shared/form-controls/google-font-selector/google-font-selector.module';
import {FontSelectorOverlayComponent} from './overlays/font-selector-overlay/font-selector-overlay.component';
import {IconSelectorOverlayComponent} from './overlays/icon-selector-overlay/icon-selector-overlay.component';
import {MatRippleModule} from '@angular/material/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {ShadowPanelFormComponent} from './sidebar/inspector-panel/shadows-panel/shadow-panel-form/shadow-panel-form.component';
import {BuilderSidebarComponent} from './sidebar/builder-sidebar.component';
import {ElementControlsComponent} from './sidebar/inspector-panel/attributes-panel/element-controls/element-controls.component';
import {ChipsModule} from '@common/core/ui/chips/chips.module';
import {SvgImageModule} from '@common/core/ui/svg-image/svg-image.module';
import {TypographyPanelComponent} from './sidebar/inspector-panel/typography-panel/typography-panel.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        MaterialModule,
        HtmlBuilderRoutingModule,
        TranslationsModule,
        LoadingIndicatorModule,
        NoResultsMessageModule,
        FormsModule,
        ReactiveFormsModule,
        SkeletonModule,
        ColorPickerInputModule,
        BackgroundSelectorModule,
        GoogleFontSelectorModule,
        ChipsModule,
        SvgImageModule,

        // material
        MatExpansionModule,
        MatSliderModule,
        MatChipsModule,
        PortalModule,
        OverlayModule,
        MatTabsModule,
        MatRadioModule,
        DragDropModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatRippleModule,
        MatButtonToggleModule,
    ],
    declarations: [
        HtmlBuilderComponent,
        BuilderSidebarComponent,
        LivePreviewComponent,
        PreviewDragAndDropDirective,
        ElementsPanelComponent,
        InspectorPanelComponent,
        AttributesPanelComponent,
        SpacingPanelComponent,
        BorderStyleControlsComponent,
        TypographyPanelComponent,
        SideControlBorderComponent,
        BackgroundPanelComponent,
        FontSelectorOverlayComponent,
        ShadowsPanelComponent,
        DragVisualHelperComponent,
        LayoutPanelComponent,
        ColumnPresetsComponent,
        DragElFromSidebarToPreviewDirective,
        InlineTextEditorComponent,
        CodeEditorComponent,
        LivePreviewContextMenuComponent,
        PagesPanelComponent,
        ContextBoxComponent,
        LinkEditorComponent,
        DeviceSwitcherComponent,
        ElementResizerDirective,
        MainLoaderComponent,
        IconSelectorOverlayComponent,
        ShadowPanelFormComponent,
        ElementControlsComponent,
    ],
})
export class HtmlBuilderModule {}
