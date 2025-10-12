module.exports = {
  root: true,
  extends: '@react-native',
  plugins: ['import'],
  rules: {
    'react-hooks/exhaustive-deps': 'off',
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          ['external'],
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'react-native',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'react-native-*',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react', 'react-native'],
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
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
