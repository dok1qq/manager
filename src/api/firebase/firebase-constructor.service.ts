import { Injectable } from '@angular/core';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, first, map, mapTo, switchMap, tap } from 'rxjs/operators';
import { FirebaseApiService } from './firebase-api.service';
import { IItem } from './models/item';
import { CreateResponse } from './models/response';
import { IItemBase } from './models/item-base';
import { IItemIngredientBase } from './models/item-ingredient-base';
import { IIngredient } from './models/ingredient';
import { IIngredientBase } from './models/ingredient-base';
import { HttpErrorResponse } from '@angular/common/http';
import { fromPromise } from 'rxjs/internal-compatibility';

@Injectable({ providedIn: 'root' })
export class FirebaseConstructorService {

	constructor(
		private api: FirebaseApiService,
	) {}

	getItem(id: string): Observable<IItem> {
		const item$: Observable<IItemBase> = this.api.getItemBase(id);
		const ingredients$: Observable<IIngredient[]> = this.getIngredientsByItemId(id);

		return forkJoin([item$, ingredients$]).pipe(
			map(([itemBase, ingredients]: [IItemBase, IIngredient[]]) => {
				const { name, imageUrl, fileName, description } = itemBase;
				return {
					id,
					ingredients,
					recycles: [],
					name,
					description,
					fileName,
					imageUrl,
				};
			}),
		);
	}

	getIngredientsByItemId(id: string): Observable<IIngredient[]> {
		return this.api.getItemIngredients(id).pipe(
			switchMap((ingredients: IItemIngredientBase[]) => {
				return ingredients.length
					? forkJoin(ingredients.map((ii: IItemIngredientBase) => this.getIngredient(ii.ingredientId)))
					: of([]);
			}),
		);
	}

	getIngredient(id: string): Observable<IIngredient> {
		return this.api.getIngredientBase(id).pipe(
			switchMap((ingredientBase: IIngredientBase) => {
				return this.api.getItemBase(ingredientBase.itemId).pipe(
					map((itemBase: IItemBase) => {
						return {
							id,
							item: itemBase,
							amount: ingredientBase.amount,
						};
					}),
				);
			}),
		);
	}

	deleteItem(id: string): Observable<boolean> {
		return this.api.deleteItem(id).pipe(
			mapTo(true),
			catchError(() => of(false)),
		);
	}

	deleteIngredient(id: string): Observable<boolean> {
		return this.api.deleteIngredient(id).pipe(
			mapTo(true),
			catchError(() => of(false)),
		);
	}

	deleteItemIngredient(id: string): Observable<boolean> {
		return this.api.deleteItemIngredient(id).pipe(
			mapTo(true),
			catchError(() => of(false)),
		);
	}

	createItem(item: IItemBase): Observable<string> {
		return this.api.createItem(item).pipe(
			map((response: CreateResponse) => response.name),
			catchError((err: unknown) => {
				console.error(`Create item error: ${err}`);
				return of(null);
			}),
		);
	}

	updateItem(item: IItemBase): Observable<boolean> {
		const id: string = item.id;
		item.id = undefined;
		return this.api.updateItem(id, item).pipe(
			mapTo(true),
			catchError((err: HttpErrorResponse) => {
				console.error(`Update item err: ${err}`);
				return of(false);
			}),
		);
	}

	createIngredient(ingredient: IIngredient): Observable<string> {
		const { amount, item: { id: itemId }} = ingredient;
		const params: IIngredientBase = { itemId, amount };
		return this.api.createIngredient(params).pipe(
			map((response: CreateResponse) => response.name),
			catchError(() => of(null)),
		);
	}

	createItemIngredient(itemId: string, ingredientId: string): Observable<string> {
		const params: IItemIngredientBase = { itemId, ingredientId };
		return this.api.createItemIngredient(params).pipe(
			map((response: CreateResponse) => response.name),
			catchError(() => of(null)),
		);
	}

	synchronizeItem(item: IItem): Observable<boolean> {
		const cleanUp$: Observable<boolean> = this.deleteIngredientsByItemId(item.id);
		const create$: Observable<boolean> = forkJoin(
			item.ingredients.map(i => this.createIngredient(i)) // Create Ingredients
		).pipe(
			map((results: string[]) => results.filter(Boolean)), // Take only success results
			switchMap((keys: string[]) => {
				return keys.length ? forkJoin(
					keys.map((k: string) => this.createItemIngredient(item.id, k)) // Create Item Ingredients
				).pipe(mapTo(true)) : of(true);
			}),
		);

		return of(true).pipe(
			switchMap(() => cleanUp$),
			switchMap((result: boolean) => result ? create$ : throwError('Clean Up Error')),
		);
	}

	/**
	 * Delete ingredients and bounding by ID
	 */
	deleteIngredientsByItemId(id: string): Observable<boolean> {
		return this.api.getItemIngredients(id).pipe(
			switchMap((ingredients: IItemIngredientBase[]) => {
				const keys: string[] = ingredients.map(i => i.id);
				const ingredientIDs: string[] = ingredients
					.map((item: IItemIngredientBase) => item.ingredientId);

				const removedItemIngredients$: Observable<boolean> = forkJoin(
					keys.map((k: string) => this.deleteItemIngredient(k))
				).pipe(map((results: boolean[]) => results.every(Boolean)));

				const removedIngredients$: Observable<boolean> = forkJoin(
					ingredientIDs.map((k: string) => this.deleteIngredient(k))
				).pipe(map((results: boolean[]) => results.every(Boolean)));

				return forkJoin([removedItemIngredients$, removedIngredients$]);
			}),
			map((results: boolean[]) => results.every(Boolean)),
		);
	}

	saveItem(item: IItemBase, file: File): Observable<boolean> {
		const { fileName } = item;

		// Loading image
		return this.saveImage(fileName, file).pipe(
			switchMap((result: boolean) => {
				// Remove old image
				/*return result && item.id
					? this.deleteImage(item.imageUrl)
						.pipe(mapTo(result))
					: of(result);*/
				return of(result);
			}),
			switchMap((result: boolean) => {
				return result
					? this.api.getStorageRef(fileName).getDownloadURL()
					: throwError(null)
			}),
			tap((imageUrl: string) => item.imageUrl = imageUrl),
			// Save item in database
			switchMap(() => item.id ? this.updateItem(item) : this.createItem(item)),
			switchMap((result: string) => {
				// If error occurred try to delete image
				return result ? of(true) : this.deleteImage(fileName)
			}),
			catchError(() => of(false)),
			first(),
		);
	}

	deleteItemImpl(id: string, fileName: string): Observable<boolean> {
		return this.deleteItem(id).pipe(
			switchMap((result: boolean) => result
				? this.deleteImage(fileName)
				: throwError('Delete Item err')
			),
			mapTo(true),
			catchError(() => of(false)),
		);
	}

	saveImage(fileName: string, file: File): Observable<boolean> {
		const task: Promise<boolean> = this.api.saveImage(fileName, file)
			.then(() => true)
			.catch((err: unknown) => {
				console.error('Save image err: ', err);
				return false;
			});

		return fromPromise(task);
	}

	deleteImage(filename: string): Observable<boolean> {
		return this.api.deleteImage(filename).pipe(
			mapTo(true),
			catchError((err: unknown) => {
				console.error(`Delete image error: ${err}`);
				return of(false);
			}),
		);
	}
}
