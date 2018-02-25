/**
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { createStore, applyMiddleware } from 'redux';
import { expect } from 'chai';
import * as locationState from '../src';

describe('redux-location-state', () => {
  it('should work correctly', async () => {
    jsdom.reconfigure({ url: 'https://somehost.com/path/to/somewhere?a=1&b=2&b=3&c=4#hash' });

    const store = createStore(
      locationState.reducer,
      undefined,
      applyMiddleware(locationState.middleware),
    );

    expect(store.getState()).to.deep.equal({
      hash: 'hash',
      hostname: 'somehost.com',
      pathname: '/path/to/somewhere',
      port: '',
      protocol: 'https',
      search: {
        a: '1',
        b: '3',
        c: '4',
      },
    });

    // NOTE: navigating twice
    store.dispatch(locationState.setPath('/other/path'));
    await new Promise(resolve => setTimeout(resolve, 500));
    store.dispatch(locationState.setPath('/another/path'));
    await new Promise(resolve => setTimeout(resolve, 500));

    expect(store.getState()).to.deep.equal({
      hash: 'hash',
      hostname: 'somehost.com',
      pathname: '/another/path',
      port: '',
      protocol: 'https',
      search: {
        a: '1',
        b: '3',
        c: '4',
      },
    });

    window.history.back();

    await new Promise(resolve => setTimeout(resolve, 500));

    expect(store.getState()).to.deep.equal({
      hash: 'hash',
      hostname: 'somehost.com',
      pathname: '/other/path',
      port: '',
      protocol: 'https',
      search: {
        a: '1',
        b: '3',
        c: '4',
      },
    });
  });
});
