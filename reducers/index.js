import * as number_reducers from "./number/index";
import * as array_reducers from "./array/index";
import * as boolean_reducers from "./boolean/index";
export { default as default_state } from "./default_state";
export { default as simple_reducer } from "./simple_reducer";
export const {
  array_append,
  array_prepend,
  array_remove_all,
  array_remove_index,
  array_set
} = array_reducers;
export const { boolean_set, boolean_toggle } = boolean_reducers;
export const {
  number_transform,
  number_increment,
  number_decrement
} = number_reducers;
