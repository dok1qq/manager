import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IGetItemsResponse } from './models/get-items-response.interface';
import { IItemBase } from './models/item-base';
import { catchError, mapTo } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FirebaseApiService {

	private readonly databaseURL: string = 'https://manager-12c74.firebaseio.com';

	constructor(private http: HttpClient) {
	}

	getItem(id: string): Observable<IItemBase> {
		const path: string = `${this.databaseURL}/items/${id}.json`;
		return this.http.get<IItemBase>(path);
	}

	getItems(): Observable<IGetItemsResponse> {
		const path: string = `${this.databaseURL}/items.json`;
		return this.http.get<IGetItemsResponse>(path);
	}

	createItem(item: IItemBase): Observable<boolean> {
		const path: string = `${this.databaseURL}/items.json`;
		return this.http.post(path, item).pipe(
			mapTo(true),
			catchError((err: HttpErrorResponse) => {
				console.error(err);
				return of(false);
			}),
		);
	}

	updateItem(id:string, item: IItemBase): Observable<boolean> {
		const path: string = `${this.databaseURL}/items/${id}.json`;
		return this.http.post(path, item).pipe(
			mapTo(true),
			catchError((err: HttpErrorResponse) => {
				console.error(err);
				return of(false);
			}),
		);
	}
}
