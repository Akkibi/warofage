// eslint.config.js
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import deprecate from 'eslint-plugin-deprecate';

// Keep your restricted imports arrays
const restrictedImportsI18n = [
  'Trans',
  'useTranslation',
  'TFunction',
  'appWithTranslation',
];

const restrictedImportsYup = [
  'mixed',
  'string',
  'number',
  'bool',
  'boolean',
  'date',
  'object',
  'ref',
  'array',
  'addMethod',
  'setLocale',
  'ValidationError',
];

const restrictedImportsAccordionLib = ['AccordionItemProps', 'Accordion'];

// For migrating old "extends" configs
const compat = new FlatCompat({
  baseDirectory: process.cwd(),
  recommendedConfig: js.configs.recommended,
});

export default [
  // Base recommended configs
  js.configs.recommended,

  // Use compat for configs that haven't been converted to flat config yet
  // Excluding import configs that might cause resolver issues
  ...compat.extends(
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended'
  ),

  // Main configuration
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2025,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      '@typescript-eslint': tsPlugin,
      prettier,
      deprecate,
    },
    rules: {
      // --- Formatting ---
      'prettier/prettier': 'error',
      quotes: ['error', 'single', { avoidEscape: true }],
      indent: ['error', 2, { SwitchCase: 1 }],

      // --- React & TS tweaks ---
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-interface': 'off',

      // --- Hooks ---
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/rules-of-hooks': 'error',

      // --- Good practices ---
      'deprecate/function': 'error',
      'deprecate/import': 'error',
      'deprecate/member-expression': 'error',
      // Note: "no-loops/no-loops" requires eslint-plugin-no-loops to be installed
      // "no-loops/no-loops": "error",
      'react/no-array-index-key': 'warn',
      'react/button-has-type': 'error',

      // --- Stylistic ---
      'react/jsx-curly-brace-presence': [
        'error',
        { props: 'never', children: 'ignore' },
      ],
      'max-len': [
        'warn',
        {
          code: 80,
          tabWidth: 2,
          comments: 100,
          ignoreComments: true,
          ignoreTrailingComments: true,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
        },
      ],

      // --- Imports ---
      'import/no-unresolved': 'off', // Turn off if causing issues with path mapping
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'],
            'internal',
            ['parent', 'sibling', 'index'],
            'type',
          ],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin', 'external'],
          'newlines-between': 'always',
        },
      ],

      // --- Restricted imports ---
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react-i18next',
              importNames: restrictedImportsI18n,
              message: `Please use ${restrictedImportsI18n.join(
                ', '
              )} from 'next-i18next' instead.`,
            },
            {
              name: 'yup',
              importNames: restrictedImportsYup,
              message: `Please use ${restrictedImportsYup.join(
                ', '
              )} from '@/lib/yup' (or your wrapper) instead.`,
            },
            {
              name: 'styled-components',
              importNames: ['useTheme'],
              message:
                "Please import useTheme hook from 'next-themes' instead.",
            },
            {
              name: '@szhsin/react-accordion',
              importNames: restrictedImportsAccordionLib,
              message: `Please use custom ${restrictedImportsAccordionLib.join(
                ', '
              )} from @/components instead.`,
            },
          ],
        },
      ],
    },
  },
];
