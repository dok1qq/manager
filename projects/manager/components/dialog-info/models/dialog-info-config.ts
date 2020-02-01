import { ViewContainerRef } from '@angular/core';
import { DialogInfoSize } from './dialog-info-size';

export class DialogInfoConfig<D = any> {
	public viewContainerRef?: ViewContainerRef;
	public panelClass?: string | string[] = '';
	public hasBackdrop?: boolean = true;
	public backdropClass?: string = '';
	public disableClose?: boolean = false;
	public width?: string = '';
	public height?: string = '';
	public minWidth?: number | string;
	public minHeight?: number | string;
	public maxWidth?: number | string = '100vw';
	public maxHeight?: number | string;
	public size?: DialogInfoSize;
	public data: D | null = null;
	public closeOnNavigation?: boolean = true;
}
