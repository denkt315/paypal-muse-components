/* @flow */
/* eslint import/no-commonjs: 0 */

module.exports = {
  'messaging': {
    entry: './src/messaging',
    staticNamespace: '__messaging__',
    automatic: false
  },
  'muse': {
    entry: './src/index',
    staticNamespace: '__muse__',
    automatic: true
  },
  'tracker': {
    entry: './src/tracker',
    staticNamespace: '__tracker__',
    automatic: false
  },
  'shopping': {
    entry: './src/shopping',
    staticNamespace: '__shopping__',
    automatic: false
  }
};
