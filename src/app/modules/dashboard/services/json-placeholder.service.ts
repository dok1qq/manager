import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, switchMap } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable()
export class JsonPlaceholderService {

	private readonly JSON_PLACEHOLDER_API: string = 'https://jsonplaceholder.typicode.com';

	constructor(private http: HttpClient) {}

	getUsers(): Observable<User[]> {
		return this.http.get<User[]>(`${this.JSON_PLACEHOLDER_API}/users`).pipe(
			catchError(() => {
				return of(undefined).pipe(
					delay(1000),
					switchMap(() => throwError(undefined))
				);
			}),
			delay(2000)
		);
	}
}
