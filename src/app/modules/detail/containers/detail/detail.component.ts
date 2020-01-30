import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { DetailService } from '../../services/detail.service';
import { FirebaseService } from '../../services/firebase.service';
import { Observable } from 'rxjs';
import { Model } from '../../models/model';
import { DIALOG_INFO_DATA } from '../../../dialog-info/dialog-info.service';
import { DialogInfoData } from '../../../dialog-info/models/dialog-info-data';

@Component({
	selector: 'detail-component',
	templateUrl: 'detail.component.html',
	styleUrls: ['detail.component.scss'],
	providers: [DetailService, FirebaseService],
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
