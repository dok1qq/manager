import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../../../../environments/environment';
import { catchError, map, mapTo } from 'rxjs/operators';

@Injectable()
export class FirebaseService {

	private readonly databaseURL: string = environment.firebaseConfig.databaseURL;

	constructor(private http: HttpClient) {
		/*this.addUser({
			"name": "Mike Conly",
			"username": "Bret",
			"email": "Sincere@april.biz",
			"address": {
				"street": "Kulas Light",
				"suite": "Apt. 556",
				"city": "Gwenborough",
				"zipcode": "92998-3874",
				"geo": {
					"lat": "-37.3159",
					"lng": "81.1496"
				}
			},
			"phone": "1-770-736-8031 x56442",
			"website": "hildegard.org",
			"company": {
				"name": "Romaguera-Crona",
				"catchPhrase": "Multi-layered client-server neural-net",
				"bs": "harness real-time e-markets"
			}
		}).subscribe((result) => console.log(result))*/
	}

	getUsers(): Observable<User[]> {
		const path: string = `${this.databaseURL}/users.json`;
		return this.http.get<User[]>(path).pipe(
			map((data: unknown) => {
				return Object.values(data);
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

	updateUser(): Observable<boolean> {
		return of(true);
	}

	deleteUser(): Observable<boolean> {
		return of(true);
	}
}
