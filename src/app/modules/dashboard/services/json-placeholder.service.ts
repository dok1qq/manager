import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable()
export class JsonPlaceholderService {

	private readonly JSON_PLACEHOLDER_API: string = 'https://jsonplaceholder.typicode.com';

	constructor(private http: HttpClient) {}

	getUsers(): Observable<User[]> {
		return this.http.get<User[]>(`${this.JSON_PLACEHOLDER_API}/users`).pipe(
			delay(1000)
		);
	}
}
