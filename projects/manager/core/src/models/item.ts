import { IItem } from '@manager/api/firebase';

export class Item {

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

	initIngredients(): void {

	}
}
