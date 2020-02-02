import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormActions } from '@manager/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ItemForm } from '../../models/item-form';

@Component({
	selector: 'form-component',
	templateUrl: 'form.component.html',
	styleUrls: ['form.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemFormComponent extends FormActions<any> {

	@Input()
	set itemForm(value: ItemForm) {
		if (value) {
			this.updateForm(value);
			this.markAsPristine();
		}
	}

	@Output()
	save: EventEmitter<ItemForm> = new EventEmitter<ItemForm>();

	constructor(
		fb: FormBuilder,
		private cdRef: ChangeDetectorRef,
	) {
		super();

		this.form = fb.group({
			id: [null],
			name: [null, Validators.required],
			description: [null, Validators.required],
			image: ['', Validators.required],
			category: ['', Validators.required],
			condition: ['', Validators.required],
		});
	}
s
	cd(): boolean {
		console.log('ItemFormComponent Change Detection');
		return false;
	}

	saveAction(): void {
		if (this.isValid) {
			this.save.next(this.form.value);
		} else {
			this.cdRef.markForCheck();
		}
	}
}
