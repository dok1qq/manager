import { State } from './state';
import { User } from './user';

export interface Model {
    items?: User[];
    state: State;
}
