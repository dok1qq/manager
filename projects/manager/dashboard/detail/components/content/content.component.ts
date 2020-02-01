import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Item } from '@manager/core';

@Component({
	selector: 'content-component',
	templateUrl: 'content.component.html',
	styleUrls: ['content.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentComponent {

	@Input()
	item: Item;
}
