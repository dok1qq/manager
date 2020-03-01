import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { IItemBase } from './models/item-base';
import { catchError, first, map, mapTo, switchMap } from 'rxjs/operators';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { fromPromise } from 'rxjs/internal-compatibility';
import { IItem } from './models/item';
import { IIngredientBase } from './models/ingredient-base';
import { IItemIngredientBase } from './models/item-ingredient-base';
import { IIngredient } from './models/ingredient';
import { Response } from './models/response';

@Injectable({ providedIn: 'root' })
export class FirebaseApiService {

	private readonly databaseURL: string = 'https://manager-12c74.firebaseio.com';
	private readonly itemsURL: string = `${this.databaseURL}/items`;
	private readonly ingredientsURL: string = `${this.databaseURL}/ingredients`;
	private readonly itemIngredientURL: string = `${this.databaseURL}/item-ingredient`;

	constructor(
		private http: HttpClient,
		private storage: AngularFireStorage,
	) {}

	getItemBase(id: string): Observable<IItemBase> {
		const path: string = `${this.itemsURL}/${id}.json`;
		return this.http.get<IItemBase>(path);
	}

	getIngredientBase(id: string): Observable<IIngredientBase> {
		const path: string = `${this.ingredientsURL}/${id}.json`;
		return this.http.get<IIngredientBase>(path);
	}

	getItemIngredientBase(id: string): Observable<IItemIngredientBase> {
		const path: string = `${this.itemIngredientURL}/${id}.json`;
		return this.http.get<IItemIngredientBase>(path);
	}

	getItemIngredients(id: string): Observable<Response<IItemIngredientBase>> {
		const itemIngredientsRequestPath: string = `${this.itemIngredientURL}.json?orderBy="itemId"&equalTo="${id}"`;
		return this.http.get<Response<IItemIngredientBase>>(itemIngredientsRequestPath);
	}

	getBaseItems(): Observable<Response<IItemBase>> {
		const path: string = `${this.itemsURL}.json`;
		return this.http.get<Response<IItemBase>>(path);
	}

	createItem(item: IItemBase, file: File): Observable<boolean> {
		const path: string = `${this.databaseURL}/items.json`;
		const ref: AngularFireStorageReference = this.storage.ref(`items/${item.fileName}`);
		const task: AngularFireUploadTask = ref.put(file);

		// Loading image
		const load: Promise<boolean> = task
			.then(() => true)
			.catch((err: any) => {
				console.error('Load error: ', err);
				return false;
			});

		// If error occurred try to delete image
		const deleteImage$: Observable<boolean> = ref.delete().pipe(
			mapTo(false),
			catchError((err: any) => {
				console.error('Delete image error: ', err);
				return of(false);
			})
		);

		// Save item in database
		const saveItem$: Observable<boolean> = this.http.post(path, item).pipe(
			mapTo(true),
			catchError((err: HttpErrorResponse) => {
				console.error(err);
				return of(false);
			}),
		);

		return fromPromise(load).pipe(
			switchMap((result: boolean) =>
				// TODO: if error show overlay message
				result
					? ref.getDownloadURL()
					: throwError(false)
			),
			switchMap((imageUrl: string) => {
				item.imageUrl = imageUrl;
				return saveItem$;
			}),
			switchMap((result: boolean) =>
				result ? of(result) : deleteImage$
			),
			catchError(() => of(false)),
			first(),
		);
	}

	deleteItem(id: string, fileName: string): Observable<boolean> {
		const path: string = `${this.databaseURL}/items/${id}.json`;
		const ref: AngularFireStorageReference = this.storage.ref(`items/${fileName}`);

		const deleteImage$: Observable<boolean> = ref.delete().pipe(
			mapTo(true),
			catchError((err: any) => {
				// TODO: we loose consistency here
				console.error('Delete image error: ', err);
				return of(false);
			})
		);

		return this.http.delete(path).pipe(
			switchMap(() => deleteImage$),
			mapTo(true),
			catchError((err: HttpErrorResponse) => {
				console.error(err);
				return of(false);
			}),
		);
	}

	// TODO: update image
	saveItem(id: string, item: IItemBase): Observable<boolean> {
		const path: string = `${this.databaseURL}/items/${id}.json`;
		return this.http.patch(path, item).pipe(
			mapTo(true),
			catchError((err: HttpErrorResponse) => {
				console.error(err);
				return of(false);
			}),
		);
	}

	synchronizeItem(id: string, item: IItem): Observable<boolean> {
		const ingredientsPath: string = `${this.databaseURL}/ingredients.json`;
		const itemIngredientsPath: string = `${this.databaseURL}/item-ingredient.json`;

		// get old item ingredients
		const clearIngredients$: Observable<boolean> = this.http.get(`${ingredientsPath}?orderBy="itemId"&equalTo="${item.id}"`).pipe(
			switchMap((response: {[key: string]: IIngredientBase}) => {
				const keys: string[] = Object.keys(response);
				return forkJoin(keys.map((k: string) => {
					const path: string = `${this.databaseURL}/ingredients/${k}.json`;
					return this.http.delete(path);
				}));
			}),
			mapTo(true),
			catchError((err: HttpErrorResponse) => {
				console.error(err);
				return of(false);
			}),
		);

		const clearItemIngredients$: Observable<boolean> = this.http.get(`${itemIngredientsPath}?orderBy="itemId"&equalTo="${item.id}"`).pipe(
			switchMap((response: {[key: string]: IItemIngredientBase}) => {
				const keys: string[] = Object.keys(response);
				return forkJoin(keys.map((k: string) => {
					const path: string = `${this.databaseURL}/item-ingredient/${k}.json`;
					return this.http.delete(path);
				}));
			}),
			mapTo(true),
			catchError((err: HttpErrorResponse) => {
				console.error(err);
				return of(false);
			}),
		);

		const cleanUp$: Observable<boolean> = forkJoin([clearIngredients$, clearItemIngredients$]).pipe(
			switchMap((results: boolean[]) => {
				const isClean: boolean = results.every(Boolean);
				if (!isClean) {
					return throwError('Clean up Error');
				}

				return of(true);
			})
		);

		const saveIngredients: Array<Observable<string>> = item.ingredients.map((i: IIngredient) => {
			const params: IIngredientBase = { itemId: item.id, amount: i.amount };
			return this.http.post(ingredientsPath, params).pipe(
				map((result: {name: string}) => result.name),
				catchError((err: any) => {
					console.error(err);
					return of(null);
				}),
			);
		});

		const create$: Observable<boolean> = forkJoin(saveIngredients).pipe(
			map((results: string[]) => results.filter(Boolean)),
			switchMap((keys: string[]) => {
				if (!keys.length) { return of(true); }

				const saveItemIngredients: Array<Observable<boolean>> = keys.map((k: string) => {
					const params: IItemIngredientBase = { itemId: item.id, ingredientId: k };
					return this.http.post(itemIngredientsPath, params).pipe(
						mapTo(true),
						catchError((err: any) => {
							console.error(err);
							return of(false);
						}),
					);
				});

				return forkJoin(saveItemIngredients).pipe(mapTo(true));
			}),
		);

		return of(true).pipe(
			switchMap(() => cleanUp$), // clean
			switchMap(() => create$), // create
		);
	}
}
