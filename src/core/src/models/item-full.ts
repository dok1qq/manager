import { Item } from './item';
import { IItem } from '@manager/api/firebase';

export class ItemFull implements Item {

	private ingredients: any[];

	constructor(private key: string, private item: IItem) {}

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

	getIngredients(): any[] {
		return this.ingredients;
	}

	getRecycles(): any[] {
		return this.item.recycles;
	}
}
