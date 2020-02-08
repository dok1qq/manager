import { IItemBase } from '@manager/api/firebase';
import { ItemForm } from './item-form';

export class Item {

	constructor(
		private id: string,
		private item: IItemBase
	) {}

	getForm(): ItemForm {
		return {
			id: this.id,
			name: this.name,
			description: this.description,
			file: null,
			fileName: this.fileName,
			imageUrl: this.imageUrl,
		};
	}

	/*getRequestData(form: ItemForm): IItemBase {
		const {
			name,
			description,
			image,
			// category,
			// condition,
		} = form;
		return {
			name,
			description,
			image,
			// category,
			// condition,
		}
	}*/

	private get name(): string {
		return this.item.name;
	}

	private get description(): string {
		return this.item.description;
	}

	private get fileName(): string {
		return this.item.fileName;
	}

	private get imageUrl(): string {
		return this.item.imageUrl;
	}

	/*private get category(): string {
		return this.item.category;
	}

	private get condition(): string {
		return this.item.condition;
	}*/
}
