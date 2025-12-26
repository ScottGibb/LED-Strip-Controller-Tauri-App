import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import sonarlint from 'eslint-plugin-sonarjs'
import jestPlugin from 'eslint-plugin-jest'
import jestDomPlugin from 'eslint-plugin-jest-dom'
import testingLibraryPlugin from 'eslint-plugin-testing-library'
import prettierPlugin from 'eslint-plugin-prettier'
import prettier from 'eslint-config-prettier'

const browserGlobals = {
  console: 'readonly',
  window: 'readonly',
  document: 'readonly',
  navigator: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly',
  queueMicrotask: 'readonly',
  __REACT_DEVTOOLS_GLOBAL_HOOK__: 'readonly',
  reportError: 'readonly'
}

export default [
  {
    ignores: ['node_modules/', 'dist/', 'src-tauri/target/', '.cargo/']
  },
  js.configs.recommended,
  {
    languageOptions: {
      globals: browserGlobals
    },
    rules: {
      'no-console': 'off'
    }
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: browserGlobals
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      sonarjs: sonarlint,
      '@typescript-eslint': tseslint.plugin,
      prettier: prettierPlugin
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'prettier/prettier': 'error'
    },
    settings: {
      react: { version: 'detect' }
    }
  },
  {
    files: ['**/__tests__/**'],
    languageOptions: {
      globals: {
        ...browserGlobals,
        jest: 'readonly',
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly'
      }
    },
    plugins: {
      jest: jestPlugin,
      'jest-dom': jestDomPlugin,
      'testing-library': testingLibraryPlugin,
      prettier: prettierPlugin
    },
    rules: {
      'sonarjs/no-duplicate-string': 'warn',
      '@typescript-eslint/no-var-requires': 'warn',
      'sonarjs/no-identical-functions': 'warn',
      'prettier/prettier': 'error'
    }
  },
  prettier
]



