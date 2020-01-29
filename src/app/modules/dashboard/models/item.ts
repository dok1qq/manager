export interface IItem {
	name: string;
	description: string;
	image: any;
	category: any;
	condition: any;
	ingredients: any[];
	recycler: any[];
}

export class Item {

	constructor(private key, private item: IItem) {}

	get id(): string {
		return this.key;
	}

	get name(): string {
		return this.item.name;
	}

	get description(): string {
		return this.item.description;
	}
}
