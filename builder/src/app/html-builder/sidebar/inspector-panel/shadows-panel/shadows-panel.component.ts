import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {startWith} from 'rxjs/operators';

@Component({
    selector: 'shadows-panel',
    templateUrl: './shadows-panel.component.html',
    styleUrls: ['./shadows-panel.component.scss'],
})
export class ShadowsPanelComponent implements OnInit {
    shadowTypeControl = new FormControl('box');
    activeType$ = this.shadowTypeControl.valueChanges.pipe(startWith('box'));

    public ngOnInit(): void {}
}
