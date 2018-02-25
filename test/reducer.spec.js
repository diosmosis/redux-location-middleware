/**
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { expect } from 'chai';
import * as actions from '../src/actions';
import reducer from '../src/reducer';

describe('reducer', () => {
  describe('initial state', () => {
    afterEach(() => {
      jsdom.reconfigure({ url: 'https://somehost.com/' });
    });

    it('should be set to the current URL location', () => {
      jsdom.reconfigure({ url: 'https://somehost.com/path/to/somewhere?a=1&b=2&b=3&c=4#hash' });

      const bogusAction = { type: 'bogus-action' };
      const state = reducer(undefined, bogusAction);

      expect(state).to.deep.equal({
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
    });
  });

  describe('setUrl', () => {
    it('should set every part of the state correctly', () => {
      const state = reducer({}, actions.setUrl('http://someotherhost.com:24/a/b?v1=v2&v3=v4#thehash'));
      expect(state).to.deep.equal({
        hash: 'thehash',
        hostname: 'someotherhost.com',
        pathname: '/a/b',
        port: '24',
        protocol: 'http',
        search: {
          v1: 'v2',
          v3: 'v4',
        },
      });
    });
  });

  describe('setPath', () => {
    it('should set the pathname property', () => {
      const state = reducer({}, actions.setPath('/a/b/c'));
      expect(state).to.deep.equal({
        pathname: '/a/b/c',
      });
    });
  });

  describe('setSearch', () => {
    it('should set the search property if an object is used', () => {
      const state = reducer({}, actions.setSearch({
        t: 1,
        v: 2,
      }));

      expect(state).to.deep.equal({
        search: {
          t: 1,
          v: 2,
        },
      });
    });

    it('should parse the passed value and set the search property if a string is used', () => {
      const state = reducer({}, actions.setSearch('?var=val&var2=val2'));
      expect(state).to.deep.equal({
        search: {
          var: 'val',
          var2: 'val2',
        },
      });
    });
  });

  describe('setSearchParam', () => {
    it('should set a single search param value', () => {
      const state = reducer({}, actions.setSearchParam('key', 'value'));
      expect(state).to.deep.equal({
        search: {
          key: 'value',
        },
      });
    });
  });

  describe('unsetSearchParam', () => {
    it('should remove a single search param value', () => {
      const state = reducer({
        search: {
          key: 'value',
          key2: 'value2',
        },
      }, actions.unsetSearchParam('key'));

      expect(state).to.deep.equal({
        search: {
          key2: 'value2',
        },
      });
    });
  });

  describe('setHash', () => {
    it('should set the hash param value', () => {
      const state = reducer({}, actions.setHash('thehash'));
      expect(state).to.deep.equal({
        hash: 'thehash',
      });
    });
  });
});
