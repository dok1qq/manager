export interface IUser {
    id: number;
    name: string;
    username: string;
    email: string;
    address: {
        street: string;
        suite: string;
        city: string;
        zipcode: string;
        geo: {
            lat: string;
            lng: string;
        };
    };
    phone: string;
    website: string;
    company: {
        name: string;
        catchPhrase: string;
        bs: string;
    };
}

export class User {

	constructor(private key: string, private user: IUser) {}

	get id(): string {
		return this.key;
	}

	get name(): string {
		return this.user.name;
	}

	get email(): string {
		return this.user.email;
	}
}
