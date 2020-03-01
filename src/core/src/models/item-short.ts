import { IItemBase } from '@manager/api/firebase';

export class ItemShort {

	constructor(private key: string, private item: IItemBase) {}

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
}
