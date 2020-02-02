import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ModelItem, State } from '@manager/core';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { FirebaseApiService, IItemBase } from '@manager/api/firebase';
import { Item } from '../models/item';
import { ItemForm } from '../models/item-form';

export type Model = ModelItem<Item>;

@Injectable()
export class EditorService {

	private readonly refresh$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	private readonly loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	constructor(private firebase: FirebaseApiService) {}

	refresh(): void {
		this.refresh$.next(true);
	}

	save(form: ItemForm): void {
		const params: IItemBase = {
			name: form.name,
			description: form.description,
			condition: form.condition,
			category: form.category,
			image: form.image,
		};
		this.firebase.createItem(params).subscribe((result: boolean) => {
			console.log('Save: ', result);
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
			map((item: Item) => ({ state: State.READY, item })),
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
