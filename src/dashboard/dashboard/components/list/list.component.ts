import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ItemShort } from '@manager/core';

@Component({
    selector: 'list-component',
    templateUrl: 'list.component.html',
    styleUrls: ['list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {

    @Input()
    items: ItemShort[];

    @Output()
    openDetail: EventEmitter<ItemShort> = new EventEmitter<ItemShort>();

    itemId(index: number, item: ItemShort): string {
        return item.getId();
    }
}
