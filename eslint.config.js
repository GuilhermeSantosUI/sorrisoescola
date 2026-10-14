import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  { ignores: ['**/dist', '**/.expo', '**/node_modules', 'packages/shared/src/api/schema.ts'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    plugins: { 'jsx-a11y': jsxA11y, 'react-hooks': reactHooks },
    rules: { ...jsxA11y.flatConfigs.recommended.rules, ...reactHooks.configs.recommended.rules },
  },
  {
    files: ['apps/mobile/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: { ...reactHooks.configs.recommended.rules },
  },
  {
    // Cores literais são proibidas fora de tokens.ts (a marca usa só tokens).
    files: ['apps/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        { selector: "Literal[value=/^#[0-9a-fA-F]{3,8}$/]", message: 'Use tokens de packages/shared/src/tokens.ts.' },
      ],
    },
  },
);
