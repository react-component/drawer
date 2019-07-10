const base = require('@umijs/fabric/dist/eslint');

module.exports = {
  ...base,
  rules: {
    ...base.rules,
    'no-template-curly-in-string': 0,
    'prefer-promise-reject-errors': 0,
    'react/no-array-index-key': 0,
    'react/sort-comp': 0,
    'no-empty': 0,
    'no-console': 0,
    'no-param-reassign': 0,
    'no-restricted-globals': 0,
    '@typescript-eslint/no-explicit-any': 0,
  },
};