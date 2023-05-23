import {
    Component,
    HostBinding,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatTabChangeEvent, MatTabGroup} from '@angular/material/tabs';
import {ContextBoxes} from '../../live-preview/context-box/context-boxes.service';
import {BuilderStateService} from '../../builder-state.service';
import {BuilderBreakpoint} from './builder-breakpoint';

@Component({
    selector: 'device-switcher',
    templateUrl: './device-switcher.component.html',
    styleUrls: ['./device-switcher.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('toggleAnimation', [
            state('false', style({height: '0px', visibility: 'hidden'})),
            state('true', style({height: '*', visibility: 'visible'})),
            transition(
                'true <=> false',
                animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
            ),
        ]),
    ],
})
export class DeviceSwitcherComponent {
    @ViewChild('tabs', {static: true}) tabs: MatTabGroup;
    @HostBinding('@toggleAnimation') private visible = false;

    selectedIndex = 3;

    constructor(
        private state: BuilderStateService,
        private contextBoxes: ContextBoxes
    ) {}

    toggleVisibility() {
        this.visible = !this.visible;
    }

    switchDevice(e: MatTabChangeEvent) {
        this.selectedIndex = e.index;
        this.state.breakpoint = this.getWidthFromIndex(e.index);
        this.contextBoxes.hideBoxes();
    }

    getWidthFromIndex(index: number): BuilderBreakpoint {
        switch (index) {
            case 0:
                return BuilderBreakpoint.Phone;
            case 1:
                return BuilderBreakpoint.Tablet;
            case 2:
                return BuilderBreakpoint.Laptop;
            case 3:
                return BuilderBreakpoint.Desktop;
        }
    }
}
