import { ComponentType, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Location } from '@angular/common';
import { ComponentRef, Inject, Injectable, InjectionToken, Injector, Optional } from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { DialogInfoContainerComponent } from './containers/dialog-info-container/dialog-info-container.component';
import { DialogInfoConfig } from './models/dialog-info-config';
import { DialogInfoRef } from './models/dialog-info-ref';
import { DialogInfoData } from './models/dialog-info-data';
import { DialogInfoEditorData } from './models/dialog-info-editor-data';

export const DIALOG_INFO_CONFIG: InjectionToken<DialogInfoConfig> = new InjectionToken<DialogInfoConfig>('DIALOG_INFO_CONFIG');
export const DIALOG_INFO_DATA: InjectionToken<DialogInfoData> = new InjectionToken<DialogInfoData>(
	'DIALOG_INFO_DATA',
);
export const DIALOG_EDITOR_INFO_DATA: InjectionToken<DialogInfoEditorData> = new InjectionToken<DialogInfoEditorData>(
	'DIALOG_EDITOR_INFO_DATA',
);

@Injectable({providedIn: 'root'})
export class DialogInfoService {
	private container: DialogInfoContainerComponent;
	private modalRef: DialogInfoRef<any, any>;

	constructor(
		private overlay: Overlay,
		private injector: Injector,
		@Optional() private location: Location,
		@Inject(DIALOG_INFO_CONFIG)
		@Optional()
		private overrideConfig: DialogInfoConfig,
	) {
	}

	/** Открывает модальное окно */
	openInfo<T, D = any, R = any>(
		componentRef: ComponentType<T>,
		config: DialogInfoConfig,
	): DialogInfoRef<T, R> {
		config = {
			...new DialogInfoConfig(),
			...(config || this.overrideConfig),
		};
		const overlayRef: OverlayRef = this.createOverlay(config);
		const dialogContainer: DialogInfoContainerComponent = this.attachModalContainer(
			overlayRef,
			config,
		);

		this.container = dialogContainer;

		return this.attachModalContent<T, R>(
			componentRef,
			dialogContainer,
			overlayRef,
			config,
		);
	}

	openEditor<T, R>(
		componentRef: ComponentType<T>,
		config: DialogInfoConfig,
	): DialogInfoRef<T, R> {
		config = {
			...new DialogInfoConfig(),
			...(config || this.overrideConfig),
		};
		const injector: PortalInjector = this.createEditorInjector<T>(config, this.modalRef, this.container);
		this.container.attachComponentEditorPortal<T>(
			new ComponentPortal(componentRef, undefined, injector),
		);

		return this.modalRef;
	}

	private createOverlay(config: DialogInfoConfig): OverlayRef {
		const overlayConfig: OverlayConfig = this.getOverlayConfig(config);
		return this.overlay.create(overlayConfig);
	}

	private attachModalContainer(
		overlay: OverlayRef,
		config: DialogInfoConfig,
	): DialogInfoContainerComponent {
		const containerPortal: ComponentPortal<DialogInfoContainerComponent> = new ComponentPortal(
			DialogInfoContainerComponent,
			config.viewContainerRef,
		);
		const containerRef: ComponentRef<DialogInfoContainerComponent> = overlay.attach(
			containerPortal,
		);
		containerRef.instance.config = config;

		return containerRef.instance;
	}

	private attachModalContent<T, R>(
		componentRef: ComponentType<T>,
		modalContainer: DialogInfoContainerComponent,
		overlayRef: OverlayRef,
		config: DialogInfoConfig,
	): DialogInfoRef<T, R> {
		this.modalRef = new DialogInfoRef<T, R>(
			overlayRef,
			modalContainer,
			this.location,
		);
		if (config.hasBackdrop) {
			overlayRef
				.backdropClick()
				.pipe(
					filter(() => !this.modalRef.disableClose),
					takeUntil(overlayRef.detachments()),
				)
				.subscribe(() => this.modalRef.close());
		}

		const injector: PortalInjector = this.createInjector<T>(
			config,
			this.modalRef,
			modalContainer,
		);
		const contentRef: ComponentRef<T> = modalContainer.attachComponentPortal<T>(new ComponentPortal(componentRef, undefined, injector));
		this.modalRef.componentInstance = contentRef.instance;

		return this.modalRef;
	}

	private createInjector<T>(
		config: DialogInfoConfig,
		modalRef: DialogInfoRef<T>,
		modalContainerComponent: DialogInfoContainerComponent,
	): PortalInjector {
		const userInjector: Injector =
			config &&
			config.viewContainerRef &&
			config.viewContainerRef.injector;
		const injectionTokens: WeakMap<any, any> = new WeakMap();
		injectionTokens
			.set(DialogInfoContainerComponent, modalContainerComponent)
			.set(DIALOG_INFO_DATA, config.data)
			.set(DialogInfoRef, modalRef);
		return new PortalInjector(
			userInjector || this.injector,
			injectionTokens,
		);
	}

	private createEditorInjector<T>(
		config: DialogInfoConfig,
		modalRef: DialogInfoRef<T>,
		modalContainerComponent: DialogInfoContainerComponent,
	): PortalInjector {
		const injectionTokens: WeakMap<any, any> = new WeakMap();
		injectionTokens
			.set(DialogInfoContainerComponent, modalContainerComponent)
			.set(DIALOG_EDITOR_INFO_DATA, config.data)
			.set(DialogInfoRef, modalRef);
		return new PortalInjector(
			this.injector,
			injectionTokens,
		);
	}

	private getOverlayConfig(dialogConfig: DialogInfoConfig): OverlayConfig {
		const state: OverlayConfig = new OverlayConfig({
			positionStrategy: this.overlay
				.position()
				.global()
				.centerHorizontally()
				.centerVertically(),
			panelClass: dialogConfig.panelClass,
			hasBackdrop: dialogConfig.hasBackdrop,
			minWidth: dialogConfig.size || dialogConfig.minWidth,
			minHeight: dialogConfig.minHeight,
			maxWidth: dialogConfig.size || dialogConfig.maxWidth,
			maxHeight: dialogConfig.maxHeight,
			height: dialogConfig.height,
			width: dialogConfig.width,
		});

		if (dialogConfig.backdropClass) {
			state.backdropClass = dialogConfig.backdropClass;
		}

		return state;
	}
}
