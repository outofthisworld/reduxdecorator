import * as number_reducers from './number/index';
import * as array_reducers from './array/index';
import * as boolean_reducers from './boolean/index';
import def_state from './default_state';
import simp_red from './simple_reducer';

export const default_state = def_state;
export const simple_reducer = simp_red;
export const {
    array_append,
    array_remove_all,
    array_remove_index,
    array_set
} = array_reducers;
export const {
    boolean_set,
    boolean_toggle
} = boolean_reducers;
export const {
    number_transform
}= number_reducers;

