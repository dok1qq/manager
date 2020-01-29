import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailComponent } from './containers/detail/detail.component';


@NgModule({
	imports: [
		CommonModule,
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
