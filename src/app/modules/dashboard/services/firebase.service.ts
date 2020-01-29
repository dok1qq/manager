import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { catchError, map, mapTo } from 'rxjs/operators';
import { IItem, Item } from '../models/item';

// TODO: should be in api
interface IGetItemsResponse  {
	[id: string]: IItem;
}

@Injectable()
export class FirebaseService {

	private readonly databaseURL: string = environment.firebaseConfig.databaseURL;

	constructor(private http: HttpClient) {}

	getItems(): Observable<Item[]> {
		const path: string = `${this.databaseURL}/users.json`;
		return this.http.get<IGetItemsResponse>(path).pipe(
			map((response: IGetItemsResponse) => {
				return Object.keys(response).map((key: string) => {
					return new Item(key, response[key]);
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
