import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IItemBase } from '@manager/api/firebase';

@Component({
    selector: 'item-component',
    templateUrl: 'item.component.html',
    styleUrls: ['item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemComponent {

    @Input()
    item: IItemBase;

}
