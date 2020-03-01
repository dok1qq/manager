import { Injectable } from '@angular/core';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, map, mapTo, switchMap } from 'rxjs/operators';
import { FirebaseApiService } from './firebase-api.service';
import { IItem } from './models/item';
import { CreateResponse } from './models/response';
import { IItemBase } from './models/item-base';
import { IItemIngredientBase } from './models/item-ingredient-base';
import { IIngredient } from './models/ingredient';
import { IIngredientBase } from './models/ingredient-base';

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
}
