import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';

@Injectable()
export class UsersService {

	private readonly JSON_PLACEHOLDER_API: string = 'https://jsonplaceholder.typicode.com';

	users: any[] = [
		{
			id: 1,
			name: 'Mike',
		},
		{
			id: 2,
			name: 'Steve',
		},
		{
			id: 3,
			name: 'John',
		}
	];

	constructor(private http: HttpClient) {
	}

	getStubUsers(): Observable<any[]> {
		return of(this.users).pipe(
			delay(3000),
		);
	}

	getJsonPlaceholderUsers(): Observable<User[]> {
		return this.http.get<User[]>(`${this.JSON_PLACEHOLDER_API}/users`).pipe(
			delay(1000)
		);
	}
}
