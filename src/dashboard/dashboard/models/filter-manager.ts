import { IItemBase } from '@manager/api/firebase';

export class FilterManager {

	private readonly value: string;

	constructor(value: string) {
		this.value = value.toLowerCase();
	}

	filter(items: IItemBase[]): IItemBase[] {
		return items.filter((item: IItemBase) => {
			return this.filterByName(item);
		});
	}

	private filterByName(item: IItemBase): boolean {
		const itemName: string = item.name.toLowerCase();
		return itemName.includes(this.value)
	}
}
