import { User } from './user';

export class FilterManager {

	private readonly value: string;

	constructor(value: string) {
		this.value = value.toLowerCase();
	}

	filter(items: User[]): User[] {
		return items.filter((item: User) => {
			return this.filterByName(item) || this.filterByEmail(item);
		});
	}

	private filterByName(item: User): boolean {
		const itemName: string = item.name.toLowerCase();
		return itemName.includes(this.value)
	}

	private filterByEmail(item: User): boolean {
		const itemEmail: string = item.email.toLowerCase();
		return itemEmail.includes(this.value)
	}
}
