import { IIngredient } from '@manager/api/firebase/models/ingredient';

export class Ingredient {

	constructor(private key: string, private ingredient: IIngredient) {}

	getId(): string {
		return this.key;
	}
}
