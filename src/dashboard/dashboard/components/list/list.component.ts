import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IItemBase } from '@manager/api/firebase';

@Component({
    selector: 'list-component',
    templateUrl: 'list.component.html',
    styleUrls: ['list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {

    @Input()
    items: IItemBase[];

    @Output()
    openDetail: EventEmitter<IItemBase> = new EventEmitter<IItemBase>();

    itemId(index: number, item: IItemBase): string {
        return item.id;
    }
}
