import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IUser, User } from '../models/user';
import { environment } from '../../../../environments/environment';
import { catchError, map, mapTo } from 'rxjs/operators';

interface IGetUsersResponse  {
	[id: string]: IUser;
}

@Injectable()
export class FirebaseService {

	private readonly databaseURL: string = environment.firebaseConfig.databaseURL;

	constructor(private http: HttpClient) {}

	getUsers(): Observable<User[]> {
		const path: string = `${this.databaseURL}/users.json`;
		return this.http.get<IGetUsersResponse>(path).pipe(
			map((response: IGetUsersResponse) => {
				return Object.keys(response).map((key: string) => {
					return new User(key, response[key]);
				});
			}),
		);
	}

	addUser(user: any): Observable<boolean> {
		const path: string = `${this.databaseURL}/users.json`;
		return this.http.post(path, user).pipe(
			mapTo(true),
			catchError((err: HttpErrorResponse) => {
				console.error(err);
				return of(false);
			})
		)
	}
}
