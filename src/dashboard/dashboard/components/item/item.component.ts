import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ItemShort } from '@manager/core';

@Component({
    selector: 'item-component',
    templateUrl: 'item.component.html',
    styleUrls: ['item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemComponent {

    @Input()
    item: ItemShort;

}
