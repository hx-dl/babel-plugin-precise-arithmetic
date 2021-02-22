# babel-plugin-precise-arithmetic

A babel plugin as a solution for the problem in the calculation precision of the floating points numbers.

---

![](https://img.shields.io/badge/build-passing-green) ![](https://img.shields.io/github/license/hx-dl/babel-plugin-precise-arithmetic) ![](https://img.shields.io/github/stars/hx-dl/babel-plugin-precise-arithmetic?label=star&style=social)

## Usage

```
npm install babel-plugin-precise-arithmetic --save-dev
```

## Add babel-plugin-precise-arithmetic

.babelrc

```json
{
  "plugins": ["precise-arithmetic"]
}
```

or

webpack.config.js

```js
...
{
	test: /\.js$/,
	loader: 'babel-loader',
	option: {
		plugins: [
			require('babel-plugin-precise-arithmetic')
		]
	},
},
...
```

## Example

By this plugin, it translate BinaryExpression to FunctionCall for a right result with float number.

```js
var a = 0.1 + 0.2;
//0.30000000000000004
	↓ ↓ ↓ ↓ ↓ ↓
var { accAdd } = require('babel-plugin-precise-arithmetic/src/calc.js');
var a = accAdd(0.1, 0.2); // 0.3
```

```js
var a = 0.1 + 0.2;
var b = 0.8 - 0.2;
//0.30000000000000004
//0.6000000000000001
	↓ ↓ ↓ ↓ ↓ ↓
var { accAdd, accSub } = require('babel-plugin-precise-arithmetic/src/calc.js');
var a = accAdd(0.1, 0.2); //0.3
var a = accSub(0.8, 0.2); //0.6


```

> Note: it doesn't work with eval() And just support (+ - \* \ += -=), if the members of the operator is not Number type, it will return the result as it should be
