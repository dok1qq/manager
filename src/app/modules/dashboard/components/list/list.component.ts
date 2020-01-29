import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Item } from '../../models/item';

@Component({
    selector: 'list-component',
    templateUrl: 'list.component.html',
    styleUrls: ['list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {

    @Input()
    items: Item[];

    itemId(index: number, item: Item): string {
        return item.id;
    }
}
