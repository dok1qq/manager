import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailComponent } from './containers/detail/detail.component';
import { ContentComponent } from './components/content/content.component';
import { PreloaderModule } from '@manager/components/preloader';
import { ReplacementMessageModule } from '@manager/components/replacement-message';

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

		// Components
		ContentComponent,
	],
	exports: [DetailComponent],
	entryComponents: [DetailComponent],
})
export class DetailModule {
}
