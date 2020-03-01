import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EditorService, Model } from '../../services/editor.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ItemForm } from '../../models/item-form';

@Component({
	selector: 'editor-component',
	providers: [EditorService],
	templateUrl: 'editor.component.html',
	styleUrls: ['editor.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent {

	readonly model$: Observable<Model>;
	readonly loading$: Observable<boolean>;

	constructor(
		private service: EditorService,
		private route: ActivatedRoute,
	) {
		const id: string = this.route.snapshot.params.id;
		this.model$ = this.service.getModel(id);
		this.loading$ = this.service.getLoading();
	}

	cd(model: Model): boolean {
		console.log('Editor component Change Detection: ', model);
		return false;
	}

	refresh(): void {
		this.service.refresh();
	}

	save(form: ItemForm): void {
		this.service.save(form);
	}

	create(form: ItemForm): void {
		this.service.create(form);
	}

	cancel(): void {
		this.service.cancel();
	}
}
