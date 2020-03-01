import { ESCAPE } from '@angular/cdk/keycodes';
import { OverlayRef } from '@angular/cdk/overlay';
import { Location } from '@angular/common';
import { Observable, Subject, SubscriptionLike } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { DialogInfoContainerComponent } from '../containers/dialog-info-container/dialog-info-container.component';

export class DialogInfoRef<T, R = any> {
	componentInstance: T;
	disableClose: boolean | undefined = this.containerInstance.config.disableClose;
	private readonly afterOpen$: Subject<void> = new Subject<void>();
	private readonly afterClosed$: Subject<R | undefined> = new Subject<R | undefined>();
	private readonly afterEditorClosed$: Subject<R | undefined> = new Subject<R | undefined>();
	private readonly beforeClose$: Subject<R | undefined> = new Subject<R | undefined>();
	private modalResult: R;
	private editorResult: R;
	private locationSubscription: SubscriptionLike;

	constructor(
		private overlayRef: OverlayRef,
		public containerInstance: DialogInfoContainerComponent,
		location?: Location,
	) {
		containerInstance.animationStateChanged
			.pipe(
				filter((event: any) => event.phaseName === 'done' && event.toState === 'enter'),
				take(1),
			)
			.subscribe(() => {
				this.afterOpen$.next();
				this.afterOpen$.complete();
			});

		containerInstance.animationStateChanged
			.pipe(
				filter((event: any) => event.phaseName === 'done' && event.toState === 'exit'),
				take(1),
			)
			.subscribe(() => {
				this.overlayRef.dispose();
				this.afterClosed$.next(this.modalResult);
				this.afterClosed$.complete();
				this.afterEditorClosed$.complete();
				this.locationSubscription.unsubscribe();
				this.componentInstance = null;
			});

		overlayRef.keydownEvents()
			.pipe(
				filter((event: KeyboardEvent) => event.keyCode === ESCAPE && !this.disableClose),
			)
			.subscribe(() => this.close());

		if (location) {
			this.locationSubscription = location
				.subscribe(() => {
					if (this.containerInstance.config.closeOnNavigation) {
						this.close();
					}
				});
		}
	}

	close(dialogResult?: R): void {
		this.modalResult = dialogResult;
		this.containerInstance.animationStateChanged
			.pipe(
				filter((event: any) => event.phaseName === 'start'),
				take(1),
			)
			.subscribe(() => {
				this.beforeClose$.next(dialogResult);
				this.beforeClose$.complete();
				this.overlayRef.detachBackdrop();
			});

		if (this.containerInstance.isEditorAttached()) {
			this.closeRight();
		}
		this.containerInstance.startExitAnimation();
	}

	closeRight(editorResult?: R): void {
		this.editorResult = editorResult;
		this.containerInstance.detachEditor();
		this.afterEditorClosed$.next(editorResult);
	}

	afterOpen(): Observable<void> {
		return this.afterOpen$.asObservable();
	}

	afterClosed(): Observable<R | undefined> {
		return this.afterClosed$.asObservable();
	}

	afterEditorClosed(): Observable<R | undefined> {
		return this.afterEditorClosed$.asObservable();
	}

	beforeClose(): Observable<R | undefined> {
		return this.beforeClose$.asObservable();
	}

	backdropClick(): Observable<MouseEvent> {
		return this.overlayRef.backdropClick();
	}

	keydownEvents(): Observable<KeyboardEvent> {
		return this.overlayRef.keydownEvents();
	}

	isEditorAttached(): boolean {
		return this.containerInstance.isEditorAttached();
	}
}
