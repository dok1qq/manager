import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Item } from '../../models/item';

@Component({
    selector: 'item-component',
    templateUrl: 'item.component.html',
    styleUrls: ['item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemComponent {

    @Input()
    item: Item;

}
