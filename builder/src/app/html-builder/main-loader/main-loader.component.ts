import {ChangeDetectionStrategy, Component, HostBinding, Input} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'main-loader',
    templateUrl: './main-loader.component.html',
    styleUrls: ['./main-loader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('visibility', [
            state('true', style({
                opacity: '1',
                display: '*',
            })),
            state('false', style({
                opacity: '0',
                display: 'none'
            })),
            transition('true => false', animate('500ms cubic-bezier(.4,0,.2,1)'))
        ]),
    ]
})
export class MainLoaderComponent {
    @Input() @HostBinding('@visibility') visible = true;
}
