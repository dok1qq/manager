import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { IItem, Item } from '../models/item';

@Injectable()
export class FirebaseService {

	private readonly databaseURL: string = environment.firebaseConfig.databaseURL;

	constructor(private http: HttpClient) {}

	getItem(id: string): Observable<Item> {
		const path: string = `${this.databaseURL}/users/${id}.json`;
		return this.http.get<IItem>(path).pipe(
			map((response: IItem) => {
				return new Item(id, response);
			}),
		);
	}
}
