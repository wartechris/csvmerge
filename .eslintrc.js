module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true
  },

  extends: [
    'eslint:recommended',
    'standard'
  ],

  parserOptions: {
    ecmaVersion: 12
  },

  rules: {},

  globals: {
    argv: 'writeable'
  }
}
