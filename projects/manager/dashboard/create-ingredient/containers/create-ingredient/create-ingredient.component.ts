import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CreateIngredientService, Model } from '../../services/create-ingredient.service';
import { Observable } from 'rxjs';

@Component({
	selector: 'create-ingredient-component',
	providers: [CreateIngredientService],
	templateUrl: 'create-ingredient.component.html',
	styleUrls: ['create-ingredient.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateIngredientComponent {

	readonly model$: Observable<Model>;

	constructor(private service: CreateIngredientService) {
		this.model$ = this.service.getModel();
	}

	cd(model: Model): boolean {
		console.log('CreateIngredientComponent CdRef: ', model);
		return false;
	}

	refresh(): void {
		this.service.refresh();
	}
}
