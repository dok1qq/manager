import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { DetailService, Model } from '../../services/detail.service';
import { Observable } from 'rxjs';
import { DIALOG_INFO_DATA, DialogInfoData } from '@manager/components/dialog-info';

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
		private service: DetailService,
	) {
		this.model$ = this.service.getModel(this.data.id);
		this.loading$ = this.service.getLoading();
	}

	cd(model: Model): boolean {
		console.log('Detail change detection: ', model);
		return false;
	}

	refresh(): void {
		this.service.refresh();
	}
}
