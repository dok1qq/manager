import { NgModule } from '@angular/core';
import { PreloaderComponent } from './preloader.component';
import { CommonModule } from '@angular/common';

@NgModule({
	imports: [CommonModule],
	declarations: [PreloaderComponent],
	exports: [PreloaderComponent],
})
export class PreloaderModule {
}
