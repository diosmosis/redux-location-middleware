/**
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import * as actions from './actions';

export default function locationReducer(state = initialState(), action) {
  switch (action.type) {
    case actions.setUrl.type:
      return setUrl();
    case actions.setPath.type:
      return setPath();
    case actions.setSearch.type:
      return setSearch();
    case actions.setSearchParam.type:
      return setSearchParam();
    case actions.unsetSearchParam.type:
      return unsetSearchParam();
    case actions.setHash.type:
      return setHash();
    default:
      return state;
  }

  function setUrl() {
    const urlObj = new URL(action.url);
    return Object.assign({}, state, {
      protocol: urlObj.protocol.slice(0, -1),
      hostname: urlObj.hostname,
      port: urlObj.port,
      pathname: urlObj.pathname,
      search: getSearchObject(new URLSearchParams(urlObj.search)),
      hash: urlObj.hash.substring(1),
    });
  }

  function setPath() {
    return Object.assign({}, state, {
      pathname: action.path,
    });
  }

  function setSearch() {
    const search = typeof action.search === 'string'
      ? getSearchObject(new URLSearchParams(action.search))
      : action.search;

    return Object.assign({}, state, {
      search,
    });
  }

  function setSearchParam() {
    return Object.assign({}, state, {
      search: Object.assign({}, state.search, {
        [action.name]: action.value,
      }),
    });
  }

  function unsetSearchParam() {
    if (!state.search[action.name]) { // don't need to do the assign in this case
      return state;
    }

    const search = Object.assign({}, state.search);
    delete search[action.name];

    return Object.assign({}, state, {
      search,
    });
  }

  function setHash() {
    return Object.assign({}, state, {
      hash: action.hash,
    });
  }
}

function getSearchObject(urlSearchParams) {
  const result = {};
  for (const [key, value] of urlSearchParams.entries()) {
    result[key] = value;
  }
  return result;
}

function initialState() {
  const { location } = window;
  return {
    protocol: location.protocol.slice(0, -1),
    hostname: location.hostname,
    port: location.port,
    pathname: location.pathname,
    search: getSearchObject(new URLSearchParams(location.search)),
    hash: location.hash.substring(1),
  };
}
