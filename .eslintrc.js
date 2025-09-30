module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'react-hooks/exhaustive-deps': 'off',
  },
  overrides: [
    {
      files: ['.eslintrc.js'],
      env: { node: true },
      parser: 'espree',
      parserOptions: { sourceType: 'script' },
      rules: {},
    },
  ],
}
