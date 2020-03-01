import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormActions } from '@manager/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ItemForm } from '../../models/item-form';

@Component({
	selector: 'form-component',
	templateUrl: 'form.component.html',
	styleUrls: ['form.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemFormComponent extends FormActions<ItemForm> {

	@Input()
	set itemForm(value: ItemForm) {
		if (value) {
			this.updateForm(value);
			this.markAsPristine();
		}
	}

	@Output()
	save: EventEmitter<ItemForm> = new EventEmitter<ItemForm>();

	@Output()
	create: EventEmitter<ItemForm> = new EventEmitter<ItemForm>();

	constructor(
		fb: FormBuilder,
		private cdRef: ChangeDetectorRef,
	) {
		super();

		this.form = fb.group({
			id: [null],
			name: [null, Validators.required],
			file: [null, Validators.required],
			fileName: [null, Validators.required],
			description: [null, Validators.required],
			imageUrl: [null],
			// category: ['', Validators.required],
			// condition: ['', Validators.required],
		});
	}

	cd(): boolean {
		console.log('ItemFormComponent Change Detection');
		return false;
	}

	handleFileInput(files: FileList) {
		const fileControl: FormControl = this.getControl('file');
		const fileNameControl: FormControl = this.getControl('fileName');
		const file: File = files.item(0);
		fileControl.setValue(file);
		fileNameControl.setValue(file.name);
	}

	saveAction(): void {
		if (this.isValid) {
			this.save.next(this.form.value);
		} else {
			this.cdRef.markForCheck();
		}
	}

	createAction(): void {
		if (this.isValid) {
			this.create.next(this.form.value);
		} else {
			this.cdRef.markForCheck();
		}
	}
}
