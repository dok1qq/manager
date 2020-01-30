import { State } from './state';
import { Item } from './item';

export interface Model {
	item?: Item;
	state: State;
}
