import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IItem } from './models/item';
import { IGetItemsResponse } from './models/get-items-response.interface';

@Injectable({ providedIn: 'root' })
export class FirebaseApiService {

	private readonly databaseURL: string = 'https://manager-12c74.firebaseio.com';

	constructor(private http: HttpClient) {
	}

	getItem(id: string): Observable<IItem> {
		const path: string = `${this.databaseURL}/users/${id}.json`;
		return this.http.get<IItem>(path).pipe();
	}

	getItems(): Observable<IGetItemsResponse> {
		const path: string = `${this.databaseURL}/users.json`;
		return this.http.get<IGetItemsResponse>(path).pipe();
	}
}
