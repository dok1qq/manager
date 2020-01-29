import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import {
	NavigationCancel,
	NavigationEnd,
	NavigationError,
	RouteConfigLoadEnd,
	RouteConfigLoadStart,
	Router,
	RouterEvent
} from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';

@Component({
	selector: 'wrapper-component',
	templateUrl: 'wrapper.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WrapperComponent {

	readonly routeLoading$: Observable<boolean>;

	constructor(private router: Router) {
		this.routeLoading$ = this.initRouteLoading();
	}

	private initRouteLoading(): Observable<boolean> {
		return this.router.events.pipe(
			filter(
				(event: RouterEvent) =>
					event instanceof RouteConfigLoadStart ||
					event instanceof RouteConfigLoadEnd ||
					event instanceof NavigationEnd ||
					event instanceof NavigationError ||
					event instanceof NavigationCancel
			),
			tap((event: RouterEvent) => {
				if (!(event instanceof NavigationError)) {
					return;
				}
			}),
			map((event: RouterEvent) => event instanceof RouteConfigLoadStart)
		);
	}
}
