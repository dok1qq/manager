import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { DetailService, Model } from '../../services/detail.service';
import { Observable } from 'rxjs';
import { DIALOG_INFO_DATA, DialogInfoData, DialogInfoRef } from '@manager/components/dialog-info';
import { ItemFull } from '@manager/core';

@Component({
	selector: 'detail-component',
	templateUrl: 'detail.component.html',
	styleUrls: ['detail.component.scss'],
	providers: [DetailService],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailComponent {

	readonly model$: Observable<Model>;
	readonly loading$: Observable<boolean>;

	constructor(
		@Inject(DIALOG_INFO_DATA)
		private data: DialogInfoData,
		private dialogRef: DialogInfoRef<DetailComponent>,
		private service: DetailService,
	) {
		this.model$ = this.service.getModel(this.data.id);
		this.loading$ = this.service.getLoading();
		this.service.setClose(this.close.bind(this));
	}

	cd(model: Model): boolean {
		console.log('Detail change detection: ', model);
		return false;
	}

	close(result: boolean): void {
		this.dialogRef.close(result);
	}

	edit(item: ItemFull): void {
		this.service.edit(item);
	}

	delete(item: ItemFull): void {
		this.service.delete(item);
	}

	refresh(): void {
		this.service.refresh();
	}

	openIngredient(ingredient: any): void {
		this.service.openIngredient(ingredient);
	}
}
