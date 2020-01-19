import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from '../../models/user';

@Component({
    selector: 'list-component',
    templateUrl: 'list.component.html',
    styleUrls: ['list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {

    @Input()
    items: User[];

    itemId(index: number, item: User): number {
        return item.id;
    }
}
