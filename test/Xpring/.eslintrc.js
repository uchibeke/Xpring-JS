module.exports = {
  root: true,

  parser: '@typescript-eslint/parser', // Make ESLint compatible with TypeScript
  parserOptions: {
    // Enable linting rules with type information from our tsconfig
    tsconfigRootDir: __dirname,
    project: ['../../tsconfig.eslint.json'],

    sourceType: 'module', // Allow the use of imports / ES modules

    ecmaFeatures: {
      impliedStrict: true, // Enable global strict mode
    },
  },

  // Specify global variables that are predefined
  env: {
    browser: true, // Enable browser global variables
    node: true, // Enable node global variables & Node.js scoping
    es2020: true, // Add all ECMAScript 2020 globals and automatically set the ecmaVersion parser option to ES2020
  },

  plugins: [],

  extends: ['@xpring-eng/eslint-config-base/loose'],

  rules: {
    // TODO:(@hbergren) We should be able to get rid of this rule eventually.
    // When we refactor our test files to be more specific / smaller,
    // we can remove this rule and use the stricter config provided for this rule in @xpring-eng/eslint-config-base.
    'max-lines': ['warn', { max: 500 }],

    // Because of gRPC, our tests have to have a ton of imports
    'import/max-dependencies': ['warn', { max: 12 }],

    // We still leave tests for deprecated code until we completely remove it
    'import/no-deprecated': 'off',

    // I think these are only needed because we aren't at the top-level of the repository
    // Mocha callback functions don't use function names
    'func-names': 'off',

    // Mocha lets you do `this.timeout()` to set a test-specific timeout
    '@typescript-eslint/no-invalid-this': 'off',

    // Mocha describe blocks get really long
    'max-lines-per-function': 'off',

    // Useful for testing
    '@typescript-eslint/no-non-null-assertion': 'off',

    'max-nested-callbacks': ['warn', { max: 3 }],
  },
}
