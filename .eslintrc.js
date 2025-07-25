module.exports = {
  extends: ['react-app', 'react-app/jest', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    semi: ['error', 'always'],
    // 'prettier/prettier': [
    //   'error',
    //   {
    //     semi: true,
    //     singleQuote: true,
    //     trailingComma: 'es5',
    //     tabWidth: 2,
    //     printWidth: 100,
    //     arrowParens: 'avoid',
    //   },
    // ],
  },
};
