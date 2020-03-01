import { IItem } from '@manager/api/firebase';
import { Ingredient } from './ingredient';

export class Item {

	private ingredients: Ingredient[];

	constructor(private key: string, private item: IItem) {
		// this.ingredients = item.ingredients.map(i => new Ingredient());
	}

	getId(): string {
		return this.key;
	}

	getName(): string {
		return this.item.name;
	}

	getDescription(): string {
		return this.item.description;
	}

	getImageUrl(): string {
		return this.item.imageUrl;
	}

	getFileName(): string {
		return this.item.fileName;
	}

	getIngredients(): Ingredient[] {
		return this.ingredients;
	}

	getRecycles(): any[] {
		return this.item.recycles;
	}
}
