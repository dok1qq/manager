import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ModelItem, State } from '@manager/core';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { FirebaseApiService, IItemBase } from '@manager/api/firebase';
import { Item } from '../models/item';
import { ItemForm } from '../models/item-form';
import { Router } from '@angular/router';

export type Model = ModelItem<ItemForm>;

@Injectable()
export class EditorService {

	private readonly refresh$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	private readonly loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	constructor(
		private firebase: FirebaseApiService,
		private router: Router,
	) {}

	refresh(): void {
		this.refresh$.next(true);
	}

	cancel(): void {
		this.router.navigate(['dashboard']);
	}

	save(form: ItemForm): void {
		const { name, description, fileName, file, imageUrl } = form;
		const params: IItemBase = { name, description, fileName, imageUrl };

		this.loading$.next(true);
		this.firebase.saveItem(form.id, params).subscribe((result: boolean) => {
			this.loading$.next(false);

			if (result) {
				this.router.navigate(['dashboard']);
			}
		});
	}

	create(form: ItemForm): void {
		const { name, description, fileName, file } = form;
		const params: IItemBase = { name, description, fileName, imageUrl: null };

		this.loading$.next(true);
		this.firebase.createItem(params, file).subscribe((result: boolean) => {
			this.loading$.next(false);

			if (result) {
				this.router.navigate(['dashboard']);
			}
		});
	}

	getLoading(): Observable<boolean> {
		return this.loading$.asObservable();
	}

	getModel(id: string): Observable<Model> {
		return this.refresh$.pipe(
			switchMap(() => this.initModel(id))
		);
	}

	private initModel(id: string): Observable<Model> {
		const item$: Observable<Item> = id ? this.getItem(id) : of(null);
		return item$.pipe(
			map((item: Item) => ({
				state: State.READY,
				item: item ? item.getForm() : null
			})),
			catchError((err: any) => {
				console.error(err);
				return of({ state: State.ERROR });
			}),
			startWith({ state: State.PENDING }),
		);
	}

	private getItem(id: string): Observable<Item> {
		return this.firebase.getItem(id).pipe(
			map((response: IItemBase) => new Item(id, response)),
		);
	}
}
