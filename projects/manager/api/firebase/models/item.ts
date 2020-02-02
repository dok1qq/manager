import { IIngredient } from './ingredient';

export interface IItem {
	id: string;
	name: string;
	description: string;
	image: any;
	category: any;
	condition: any;
	ingredients: IIngredient[];
	recycles: any[];
}
