import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IItemBase } from './models/item-base';
import { catchError, first, map, mapTo, switchMap } from 'rxjs/operators';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { fromPromise } from 'rxjs/internal-compatibility';
import { IIngredientBase } from './models/ingredient-base';
import { IItemIngredientBase } from './models/item-ingredient-base';
import { CreateResponse, Response } from './models/response';

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
		return this.http.get<IItemBase>(path).pipe(
			map((item: IItemBase) => {
				item.id = id;
				return item;
			})
		);
	}

	getIngredientBase(id: string): Observable<IIngredientBase> {
		const path: string = `${this.ingredientsURL}/${id}.json`;
		return this.http.get<IIngredientBase>(path).pipe(
			map((item: IIngredientBase) => {
				item.id = id;
				return item;
			})
		);
	}

	getItemIngredientBase(id: string): Observable<IItemIngredientBase> {
		const path: string = `${this.itemIngredientURL}/${id}.json`;
		return this.http.get<IItemIngredientBase>(path).pipe(
			map((item: IItemIngredientBase) => {
				item.id = id;
				return item;
			})
		);
	}

	getItemIngredients(id: string): Observable<IItemIngredientBase[]> {
		const itemIngredientsRequestPath: string = `${this.itemIngredientURL}.json?orderBy="itemId"&equalTo="${id}"`;
		return this.http.get<Response<IItemIngredientBase>>(itemIngredientsRequestPath).pipe(
			map((response: Response<IItemIngredientBase>) => {
				return Object
					.keys(response)
					.map((key: string) => {
						const item: IItemIngredientBase = response[key];
						item.id = key;
						return response[key];
					});
			})
		);
	}

	getBaseItems(): Observable<IItemBase[]> {
		const path: string = `${this.itemsURL}.json`;
		return this.http.get<Response<IItemBase>>(path).pipe(
			map((response: Response<IItemBase>) => {
				return Object
					.keys(response)
					.map((key: string) => {
						const item: IItemBase = response[key];
						item.id = key;
						return response[key];
					});
			})
		);
	}

	deleteIngredient(id: string): Observable<unknown> {
		const path: string = `${this.ingredientsURL}/${id}.json`;
		return this.http.delete(path);
	}

	deleteItemIngredient(id: string): Observable<unknown> {
		const path: string = `${this.itemIngredientURL}/${id}.json`;
		return this.http.delete(path);
	}

	createIngredient(ingredient: IIngredientBase): Observable<CreateResponse> {
		const path: string = `${this.ingredientsURL}.json`;
		return this.http.post<CreateResponse>(path, ingredient);
	}

	createItemIngredient(itemIngredient: IItemIngredientBase): Observable<CreateResponse> {
		const path: string = `${this.itemIngredientURL}.json`;
		return this.http.post<CreateResponse>(path, itemIngredient);
	}

	// TODO: refactor
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

	// TODO: refactor
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
	// TODO: refactor
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
}
