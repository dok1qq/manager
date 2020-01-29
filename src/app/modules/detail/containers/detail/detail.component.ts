import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'detail-component',
	templateUrl: 'detail.component.html',
	styleUrls: ['detail.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailComponent {
	constructor() {
	}
}
