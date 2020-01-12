import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'filter-component',
	templateUrl: 'filter.component.html',
	styleUrls: ['filter.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {


	constructor() {
	}
}
