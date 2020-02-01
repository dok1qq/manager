import { IItem } from '@manager/api/firebase';

export class Item {

	constructor(private key: string, private item: IItem) {}

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
