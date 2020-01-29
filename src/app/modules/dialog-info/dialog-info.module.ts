import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DialogInfoContainerComponent } from './containers/dialog-info-container/dialog-info-container.component';
import { DialogInfoService } from './dialog-info.service';

@NgModule({
	imports: [
		CommonModule,
		OverlayModule,
		PortalModule,
	],
	declarations: [
		DialogInfoContainerComponent,
	],
	providers: [
		DialogInfoService,
	],
	entryComponents: [
		DialogInfoContainerComponent,
	],
})
export class DialogInfoModule {
}
