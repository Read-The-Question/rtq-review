/**
 * @type {import("prettier").Config
 *   & import("prettier-plugin-tailwindcss").PluginOptions
 *   & import("@trivago/prettier-plugin-sort-imports").PrettierConfig}
 */
const prettierConfig = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 80,
  tabWidth: 2,
  arrowParens: 'avoid',
  bracketSameLine: true,
  bracketSpacing: true,
  tailwindStylesheet: './src/app/globals.css',
  importOrder: [
    '^./globals.css$',
    '<BUILTIN_MODULES>',
    '<THIRD_PARTY_MODULES>',
    '^@/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
};

export default prettierConfig;
