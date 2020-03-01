import { switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

export abstract class AbstractModel<T, M> {

	private readonly refresh$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	private readonly loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	protected constructor() {
		//
	}

	refresh(): void {
		this.refresh$.next(true);
	}

	getLoading(): Observable<boolean> {
		return this.loading$.asObservable();
	}

	setLoading(value: boolean): void {
		this.loading$.next(value);
	}

	getModel(params: T): Observable<M> {
		return this.refresh$.pipe(
			switchMap(() => this.initModel(params)),
		);
	}

	protected abstract initModel(params: T): Observable<M>;
}
