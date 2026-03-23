module.exports = {
  root: true,
  ignorePatterns: ['dist', 'node_modules', 'out'],
  env: {
    node: true,
    es2022: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  overrides: [
    {
      files: ['**/*.{js,cjs,mjs}'],
      extends: ['eslint:recommended', 'prettier'],
      rules: {
        'no-console': 'error',
        'no-var': 'error',
        'prefer-const': 'error',
        eqeqeq: ['error', 'always'],
        curly: ['error', 'all']
      }
    },
    {
      files: ['src/**/*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname
      },
      plugins: ['@typescript-eslint'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-type-checked',
        'prettier'
      ],
      rules: {
        'no-console': 'error',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/consistent-type-imports': 'error'
      }
    },
    {
      files: ['*.config.ts', '**/*.config.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended']
    }
  ]
};
