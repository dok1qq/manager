import { Item } from './item';

export class FilterManager {

	private readonly value: string;

	constructor(value: string) {
		this.value = value.toLowerCase();
	}

	filter(items: Item[]): Item[] {
		return items.filter((item: Item) => {
			return this.filterByName(item);
		});
	}

	private filterByName(item: Item): boolean {
		const itemName: string = item.name.toLowerCase();
		return itemName.includes(this.value)
	}
}
