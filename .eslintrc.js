const eslintrc = {
  extends: "airbnb",
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true
    }
  },
  // plugins: [
  //     'react',
  //     'babel'
  // ],
  rules: {
    indent: [
      "error",
      2,
      {
        SwitchCase: 1
      }
    ],
    "func-names": 0,
    "no-plusplus": 0,
    "no-console": 0,
    "max-len": 0,
    "one-var": 0,
    "comma-dangle": ["error", "never"],
    "linebreak-style": 0,
    "global-require": 0,
    "prefer-destructuring": 0,
    "no-buffer-constructor": 0,
    "no-param-reassign": 0,
    "no-unused-expressions": 0,
    "no-tabs": 0,
    "no-eval": 0,
    "no-loop-func": 0,
    "no-new-func": 0,
    "no-restricted-syntax": 0,
    "no-case-declarations": 0,
    // 'no-use-before-define': 1,
    "no-underscore-dangle": 0,
    "no-extra-boolean-cast": 0,
    "no-use-before-define": 0,
    "no-await-in-loop": 0,
    "no-multi-assign": 0,
    "guard-for-in": 1,
    "import/first": 0,
    "import/no-extraneous-dependencies": 0,
    "import/no-dynamic-require": 0,
    "import/prefer-default-export": 0,
    "import/no-named-as-default-member": 0,
    "declaration-block-trailing-semicolon": 0,
    "consistent-return": 0,
    "class-methods-use-this": 0,
    "guard-for-in": 0,
    "react/default-props-match-prop-types": 0,
    "react/jsx-indent": ["error", 2],
    "react/jsx-no-bind": 0,
    "react/no-did-mount-set-state": 0,
    "react/jsx-indent-props": ["error", 2],
    "react/forbid-prop-types": [
      2,
      {
        forbid: ["any"]
      }
    ],
    "jsx-a11y/media-has-caption": 0,
    "react/no-danger": 0,
    "react/sort-comp": 0,
    "react/prop-types": 0,
    "react/jsx-first-prop-new-line": 0,
    "react/no-array-index-key": 0,
    "react/no-find-dom-node": 0,
    "react/jsx-filename-extension": 0,
    "react/destructuring-assignment": 0,
    "react/no-access-state-in-setstate": 0,
    "react/jsx-one-expression-per-line": 0,
    "react/no-multi-comp": 0,
    "react/button-has-type": 0,
    "react/jsx-one-expression-per-line": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "jsx-a11y/anchor-has-content": 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "jsx-a11y/anchor-is-valid": 0,
    "jsx-a11y/href-no-hash": 0,
    "jsx-a11y/no-noninteractive-element-interactions": 0,
    "jsx-a11y/mouse-events-have-key-events": 0,
    "experimentalDecorators": 0,
    "perator-linebreak": 0
  }
};

module.exports = eslintrc;
