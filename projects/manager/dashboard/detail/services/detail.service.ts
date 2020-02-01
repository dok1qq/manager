import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, first, map, startWith, switchMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Item, ModelItem, State } from '@manager/core';
import { FirebaseApiService, IItem } from '@manager/api/firebase';
import { DialogInfoEditorData, DialogInfoRef, DialogInfoService } from '@manager/components/dialog-info';
import { CreateIngredientComponent } from '@manager/dashboard/create-ingredient';

export type Model = ModelItem<Item>;

@Injectable()
export class DetailService {

	refresh$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	constructor(
		private dialogService: DialogInfoService,
		private firebase: FirebaseApiService,
	) {}

	getLoading(): Observable<boolean> {
		return this.loading$.asObservable();
	}

	refresh(): void {
		this.refresh$.next(true);
	}

	openIngredient(ingredient: any): void {
		const data: DialogInfoEditorData = { ingredient: ingredient ? ingredient : null };
		const ref: DialogInfoRef<CreateIngredientComponent, any> =
			this.dialogService.openEditor(CreateIngredientComponent, {data});
		ref.afterEditorClosed().pipe(first()).subscribe((result: any) => {
			console.log(result);
		});
	}

	getModel(id: string): Observable<Model> {
		return this.refresh$.pipe(
			switchMap(() => this.initModel(id))
		);
	}

	private initModel(id: string): Observable<Model> {
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
		return this.firebase.getItem(id).pipe(
			map((response: IItem) => new Item(id, response))
		);
	}
}