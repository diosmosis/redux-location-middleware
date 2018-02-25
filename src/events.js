/**
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import * as actions from './actions';

export function bindEvents(dispatch) {
  window.addEventListener('popstate', handlePopstate);

  function handlePopstate() {
    dispatch(actions.setUrl(document.location.href));
  }
}

export function propagateChange(state) {
  let newUrl = state.pathname;

  const searchNames = Object.keys(state.search);
  if (searchNames.length) {
    const search = searchNames
      .map(name => `${encodeURIComponent(name)}=${encodeURIComponent(state.search[name])}`)
      .join('&');

    newUrl += `?${search}`;
  }

  if (state.hash) {
    newUrl += `#${state.hash}`;
  }

  window.history.pushState({}, '', newUrl);
}
