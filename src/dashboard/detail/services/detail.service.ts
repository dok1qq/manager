import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, first, map, startWith } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractModel, Item, ModelItem, State } from '@manager/core';
import { FirebaseApiService, FirebaseConstructorService, IItem } from '@manager/api/firebase';
import { DialogInfoEditorData, DialogInfoRef, DialogInfoService } from '@manager/components/dialog-info';
import { CreateIngredientComponent } from '@manager/dashboard/create-ingredient';
import { Router } from '@angular/router';

export type Model = ModelItem<Item>;

@Injectable()
export class DetailService extends AbstractModel<string, Model> {

	close: (result: boolean) => void;
	setClose(fn: (result: boolean) => any): void { this.close = fn; }

	constructor(
		private dialogService: DialogInfoService,
		private firebase: FirebaseApiService,
		private constructor: FirebaseConstructorService,
		private router: Router,
	) {
		super();
	}

	edit(item: Item): void {
		this.close(false);
		this.router.navigate(['/edit', item.getId()]);
	}

	delete(item: Item): void {
		// TODO: alert here
		this.deleteItem(item);
	}

	sync(item: Item): void {
		this.setLoading(true);
		this.constructor.synchronizeItem(item as any).subscribe((result: boolean) => {
			this.setLoading(false);

			if (result) {
				this.close(true);
			}
		});
	}

	openIngredient(ingredient: any): void {
		const data: DialogInfoEditorData = { ingredient: ingredient ? ingredient : null };
		const ref: DialogInfoRef<CreateIngredientComponent, any> =
			this.dialogService.openEditor(CreateIngredientComponent, {data});
		ref.afterEditorClosed().pipe(first()).subscribe((result: any) => {
			console.log(result);
		});
	}

	protected initModel(id: string): Observable<Model> {
		return this.getItem(id).pipe(
			map((item: Item) => ({ item, state: State.READY })),
			catchError((err: HttpErrorResponse) => {
				console.error(err);
				return of({ state: State.ERROR });
			}),
			startWith({ state: State.PENDING }),
		);
	}

	private getItem(id: string): Observable<Item> {
		return this.constructor.getItem(id).pipe(
			map((response: IItem) => new Item(id, response))
		);
	}

	private deleteItem(item: Item): void {
		this.setLoading(true);
		this.firebase.deleteItem(item.getId(), item.getFileName()).subscribe((result: boolean) => {
			this.setLoading(false);

			if (result) {
				this.close(true);
			}
		});
	}
}
