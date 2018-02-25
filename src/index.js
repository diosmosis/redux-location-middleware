/**
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { bindEvents, propagateChange } from './events';

export {
  setUrl,
  setPath,
  setSearch,
  setSearchParam,
  unsetSearchParam,
  setHash,
} from './actions';

export { default as reducer } from './reducer';

export const DEFAULT_STATE_PROPERTY = 'location';

export function middleware({ getState, dispatch }) {
  bindEvents(dispatch); // TODO: how often does this get called?

  return next => (action) => {
    const result = next(action);

    if (/^LOCATION_STATE\./.test(action.type)) {
      propagateChange(getState());
    }

    return result;
  };
}
