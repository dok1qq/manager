import { FormArray, FormControl, FormGroup } from '@angular/forms';

export abstract class FormActions<T> {

	form: FormGroup;

	get isValid(): boolean {
		this.validateForm();
		return this.form.valid;
	}

	setForm(form: FormGroup) {
		this.form = form;
	}

	getForm(): FormGroup {
		return this.form;
	}

	getControl(value: string): FormControl {
		return this.form.get(value) as FormControl;
	}

	getGroup(value: string): FormGroup {
		return this.form.get(value) as FormGroup;
	}

	getArray(value: string): FormArray {
		return this.form.get(value) as FormArray;
	}

	controlIsValid(field: string): boolean {
		const control: FormControl = this.getControl(field);
		return control.valid;
	}

	controlIsInvalid(field: string): boolean {
		const control: FormControl = this.getControl(field);
		return control.hasError('required') && control.touched;
	}

	controlWithWarning(field: string, error: string): boolean {
		const control: FormControl = this.getControl(field);
		return control.hasError(error);
	}

	controlValue(field: string): any {
		const control: FormControl = this.getControl(field);
		return control && control.value;
	}

	groupValue(group: string): any {
		const formGroup: FormGroup = this.getGroup(group);
		return formGroup && formGroup.value;
	}

	reset(): void {
		this.form.reset();
	}

	updateForm(form: T): void {
		this.form.patchValue(form);
	}

	markAsPristine(): void {
		this.form.markAsPristine();
	}

	validateForm(): void {
		Object.keys(this.form.controls).forEach((key: string) => {
			this.form.get(key).markAsTouched();
		});

		this.form.updateValueAndValidity();
	}
}
