import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IItemBase } from './models/item-base';
import { map } from 'rxjs/operators';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
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

	deleteItem(id: string): Observable<unknown> {
		const path: string = `${this.itemsURL}/${id}.json`;
		return this.http.delete(path);
	}

	deleteIngredient(id: string): Observable<unknown> {
		const path: string = `${this.ingredientsURL}/${id}.json`;
		return this.http.delete(path);
	}

	deleteItemIngredient(id: string): Observable<unknown> {
		const path: string = `${this.itemIngredientURL}/${id}.json`;
		return this.http.delete(path);
	}

	createItem(item: IItemBase): Observable<CreateResponse> {
		const path: string = `${this.itemsURL}.json`;
		return this.http.post<CreateResponse>(path, item);
	}

	createIngredient(ingredient: IIngredientBase): Observable<CreateResponse> {
		const path: string = `${this.ingredientsURL}.json`;
		return this.http.post<CreateResponse>(path, ingredient);
	}

	createItemIngredient(itemIngredient: IItemIngredientBase): Observable<CreateResponse> {
		const path: string = `${this.itemIngredientURL}.json`;
		return this.http.post<CreateResponse>(path, itemIngredient);
	}

	saveImage(fileName: string, file: File): AngularFireUploadTask {
		const ref: AngularFireStorageReference = this.storage.ref(`items/${fileName}`);
		return ref.put(file);
	}

	deleteImage(fileName: string): Observable<unknown> {
		const ref: AngularFireStorageReference = this.storage.ref(`items/${fileName}`);
		return ref.delete();
	}

	updateItem(id: string, item: IItemBase): Observable<unknown> {
		const path: string = `${this.itemsURL}/${id}.json`;
		return this.http.patch(path, item);
	}

	getStorageRef(fileName: string): AngularFireStorageReference {
		return this.storage.ref(`items/${fileName}`);
	}
}
