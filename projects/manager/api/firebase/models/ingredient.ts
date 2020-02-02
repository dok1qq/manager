import { IItemBase } from './item-base';

export interface IIngredient {
	id: string;
	amount: string;
	item: IItemBase;
}
