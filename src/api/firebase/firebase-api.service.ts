import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IGetItemsResponse } from './models/get-items-response.interface';
import { IItemBase } from './models/item-base';
import { catchError, first, mapTo, switchMap } from 'rxjs/operators';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { fromPromise } from 'rxjs/internal-compatibility';
import { FirebaseConstructorService } from './firebase-constructor.service';

@Injectable({ providedIn: 'root' })
export class FirebaseApiService {

	private readonly databaseURL: string = 'https://manager-12c74.firebaseio.com';

	constructor(
		private http: HttpClient,
		private storage: AngularFireStorage,
		private firebaseConstructor: FirebaseConstructorService,
	) {
	}

	getItem(id: string): Observable<IItemBase> {
		const path: string = `${this.databaseURL}/items/${id}.json`;
		return this.http.get<IItemBase>(path).pipe(
		);
	}

	getItems(): Observable<IGetItemsResponse> {
		const path: string = `${this.databaseURL}/items.json`;
		return this.http.get<IGetItemsResponse>(path);
	}

	createItem(item: IItemBase, file: File): Observable<boolean> {
		const path: string = `${this.databaseURL}/items.json`;
		const ref: AngularFireStorageReference = this.storage.ref(`items/${item.fileName}`);
		const task: AngularFireUploadTask = ref.put(file);

		// Loading image
		const load: Promise<boolean> = task
			.then(() => true)
			.catch((err: any) => {
				console.error('Load error: ', err);
				return false;
			});

		// If error occurred try to delete image
		const deleteImage$: Observable<boolean> = ref.delete().pipe(
			mapTo(false),
			catchError((err: any) => {
				console.error('Delete image error: ', err);
				return of(false);
			})
		);

		// Save item in database
		const saveItem$: Observable<boolean> = this.http.post(path, item).pipe(
			mapTo(true),
			catchError((err: HttpErrorResponse) => {
				console.error(err);
				return of(false);
			}),
		);

		return fromPromise(load).pipe(
			switchMap((result: boolean) =>
				// TODO: if error show overlay message
				result
					? ref.getDownloadURL()
					: throwError(false)
			),
			switchMap((imageUrl: string) => {
				item.imageUrl = imageUrl;
				return saveItem$;
			}),
			switchMap((result: boolean) =>
				result ? of(result) : deleteImage$
			),
			catchError(() => of(false)),
			first(),
		);
	}

	deleteItem(id: string, fileName: string): Observable<boolean> {
		const path: string = `${this.databaseURL}/items/${id}.json`;
		const ref: AngularFireStorageReference = this.storage.ref(`items/${fileName}`);

		const deleteImage$: Observable<boolean> = ref.delete().pipe(
			mapTo(true),
			catchError((err: any) => {
				// TODO: we loose consistency here
				console.error('Delete image error: ', err);
				return of(false);
			})
		);

		return this.http.delete(path).pipe(
			switchMap(() => deleteImage$),
			mapTo(true),
			catchError((err: HttpErrorResponse) => {
				console.error(err);
				return of(false);
			}),
		);
	}

	// TODO: update image
	saveItem(id:string, item: IItemBase): Observable<boolean> {
		const path: string = `${this.databaseURL}/items/${id}.json`;
		return this.http.patch(path, item).pipe(
			mapTo(true),
			catchError((err: HttpErrorResponse) => {
				console.error(err);
				return of(false);
			}),
		);
	}
}
