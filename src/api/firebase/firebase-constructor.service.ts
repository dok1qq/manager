import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { FirebaseApiService } from './firebase-api.service';
import { IItem } from './models/item';
import { Response } from './models/response';
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
			switchMap((response: Response<IItemIngredientBase>) => {
				const ingredients: IItemIngredientBase[] = Object.values(response);
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
}
