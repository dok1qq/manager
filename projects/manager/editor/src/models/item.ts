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
			image: this.image,
			category: this.category,
			condition: this.condition,
		};
	}

	getRequestData(form: ItemForm): IItemBase {
		const {
			name,
			description,
			image,
			category,
			condition,
		} = form;
		return {
			name,
			description,
			image,
			category,
			condition,
		}
	}

	private get name(): string {
		return this.item.name;
	}

	private get description(): string {
		return this.item.description;
	}

	private get image(): string {
		return this.item.image;
	}

	private get category(): string {
		return this.item.category;
	}

	private get condition(): string {
		return this.item.condition;
	}
}
