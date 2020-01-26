import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FilterManager } from '../../models/filter-manager';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
	selector: 'filter-component',
	templateUrl: 'filter.component.html',
	styleUrls: ['filter.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnDestroy {

	@Output()
	filerChange: EventEmitter<FilterManager> = new EventEmitter();

	readonly control: FormControl = new FormControl('');
	private readonly subscription: Subscription;

	constructor() {
		this.control.enable({ emitEvent: false, onlySelf: true});
		this.subscription = this.control.valueChanges.pipe(
			distinctUntilChanged(),
			debounceTime(200),
		).subscribe((value: string) => this.filerChange.emit(new FilterManager(value)));
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
}

