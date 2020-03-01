import { ItemShort } from '@manager/core';

export class FilterManager {

	private readonly value: string;

	constructor(value: string) {
		this.value = value.toLowerCase();
	}

	filter(items: ItemShort[]): ItemShort[] {
		return items.filter((item: ItemShort) => {
			return this.filterByName(item);
		});
	}

	private filterByName(item: ItemShort): boolean {
		const itemName: string = item.getName().toLowerCase();
		return itemName.includes(this.value)
	}
}
