import { State } from './state';
import { Item } from './item';

export interface Model {
    items?: Item[];
    state: State;
}
