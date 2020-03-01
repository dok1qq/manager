import { IIngredient } from './ingredient';

/**
 * This entity we need to construct from:
 * - IItemBase - ok!
 * - IIngredientBase
 * - IRecycleBase
 * - IItemIngredientBase
 * - IItemRecycleBase
 **/
export interface IItem {
	id: string;
	name: string;
	description: string;
	imageUrl: string;
	fileName: string;
	// category: any;
	// condition: any;
	recycles: any[];
	ingredients: IIngredient[];
}
