module.exports = {
  semi: false,
  trailingComma: 'none',
  importOrder: ['^@/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  arrowParens: 'avoid',
  singleQuote: true,
  bracketSpacing: true,
  endOfLine: 'lf',
  tabWidth: 2
}
