/**
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const ACTION_TYPE_PREFIX = 'LOCATION_STATE.';

export function setUrl(url) {
  return {
    type: setUrl.type,
    url,
  };
}

setUrl.type = `${ACTION_TYPE_PREFIX}.SET_URL`;

export function setPath(path) {
  return {
    type: setPath.type,
    path,
  };
}

setPath.type = `${ACTION_TYPE_PREFIX}.SET_PATH`;

export function setSearch(search) {
  return {
    type: setSearch.type,
    search,
  };
}

setSearch.type = `${ACTION_TYPE_PREFIX}.SET_QUERY`;

export function setSearchParam(name, value) {
  return {
    type: setSearchParam.type,
    name,
    value,
  };
}

setSearchParam.type = `${ACTION_TYPE_PREFIX}.SET_QUERY_PARAM`;

export function unsetSearchParam(name) {
  return {
    type: unsetSearchParam.type,
    name,
  };
}

unsetSearchParam.type = `${ACTION_TYPE_PREFIX}.UNSET_QUERY_PARAM`;

export function setHash(hash) {
  return {
    type: setHash.type,
    hash,
  };
}

setHash.type = `${ACTION_TYPE_PREFIX}.SET_HASH`;
