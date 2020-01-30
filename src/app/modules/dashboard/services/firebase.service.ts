import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
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
}
