/**
 * ESLint configuration for @stakra/ts-container
 *
 * Standalone flat config — does not extend the monorepo shared config
 * to avoid pulling in monorepo-only plugins (turbo, etc.) that are not
 * installed in this package.
 *
 * @module eslint.config
 */

import tseslint from 'typescript-eslint';

export default tseslint.config(
  // ── Ignore patterns ────────────────────────────────────────────────────
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      '.examples/**',
      '*.config.js',
      '*.config.ts',
      'eslint.config.ts',
    ],
  },

  // ── TypeScript files ────────────────────────────────────────────────────
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Allow explicit `any` in DI internals where types are intentionally loose
      '@typescript-eslint/no-explicit-any': 'warn',
      // Require explicit return types on public methods
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      // Allow unused vars prefixed with _
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Allow non-null assertions in injector internals
      '@typescript-eslint/no-non-null-assertion': 'warn',
      // No require() — ESM only
      '@typescript-eslint/no-require-imports': 'error',
    },
  }
);
