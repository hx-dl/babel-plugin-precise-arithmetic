# babel-plugin-precise-arithmetic

一个可以解决浮点数计算精度问题的 babel 插件。

A babel plugin as a solution for the problem in the calculation precision of the floating points numbers.

---

![](https://img.shields.io/badge/build-passing-green) ![](https://img.shields.io/github/license/hx-dl/babel-plugin-precise-arithmetic) ![](https://img.shields.io/github/stars/hx-dl/babel-plugin-precise-arithmetic?label=star&style=social)

## 安装

```
npm install babel-plugin-precise-arithmetic --save-dev
```

## 添加插件到项目

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

如下为几个转换示例

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

> 注意: 该插支持 + - \* \ += -= 的运算情况， eval中的代码也无法处理。 如果运算符的成员存在非Number类型，转换后的工具函数会直接返回原生 JavaScript 运算结果。

> Note: it doesn't work with eval() And just support (+ - \* \ += -=), if the members of the operator is not Number type, it will return the result as it should be
