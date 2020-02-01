import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'preloader-component',
	templateUrl: 'preloader.component.html',
	styleUrls: ['preloader.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreloaderComponent {}
