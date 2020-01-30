import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailComponent } from './containers/detail/detail.component';
import { ReplacementMessageModule } from '../replacement-message/replacement-message.module';
import { PreloaderModule } from '../preloader/preloader.module';


@NgModule({
	imports: [
		CommonModule,

		// Components
		PreloaderModule,
		ReplacementMessageModule,
	],
	declarations: [
		// Containers
		DetailComponent,
	],
	exports: [DetailComponent],
	entryComponents: [DetailComponent],
})
export class DetailModule {
}
