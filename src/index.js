function pushCache(operation) {
  var operationFun;
  switch (operation) {
    case "+":
      operationFun = "accAdd";
      break;
    case "-":
      operationFun = "accSub";
      break;
    case "*":
      operationFun = "accMul";
      break;
    case "/":
      operationFun = "accDiv";
      break;
    case "+=":
      operationFun = "accAdd";
      break;
    case "-=":
      operationFun = "accSub";
      break;
    default:
      operationFun = "none";
  }
  if (needRequireCache.indexOf(operationFun) >= 0) return operationFun;
  operationFun !== "none" && needRequireCache.push(operationFun);
  return operationFun;
}

var needRequireCache = [];
module.exports = function ({ template: template, types: t }) {
  var preOperationAST = template("FUN_NAME(ARGS)"); //将0.1+0.2 类似的四则运算 转化为 addCalc(0.1+0.2) 的模板
  var requireAST = template("var PROPERTIES=require(SOURCE)"); //引入相应函数的模板

  function preObjectExpressionAST(keys) {
    //传入的keys为require的数组
    var properties = keys.map((key) => {
      return t.objectProperty(t.identifier(key), t.identifier(key), false, true);
    });
    return t.ObjectPattern(properties);
  }

  return {
    visitor: {
      Program: {
        exit: function (path) {
          if (needRequireCache.length <= 0) return;
          var directives = path.node.directives;
          if (directives[0] && directives[0].value.value == "calc polyfill") {
            return;
          }
          path.unshiftContainer(
            "body",
            requireAST({
              PROPERTIES: preObjectExpressionAST(needRequireCache),
              SOURCE: t.stringLiteral("babel-plugin-precise-arithmetic/src/calc.js")
            })
          );
          needRequireCache = [];
        }
      },
      BinaryExpression: {
        exit: function (path) {
          var Program = path.findParent((path) => t.isProgram(path.node));
          var directives = Program.node.directives;
          var replaceOperator = pushCache(path.node.operator);

          if (directives[0] && directives[0].value.value == "calc polyfill") {
            return;
          }

          replaceOperator !== "none" &&
            path.replaceWith(
              preOperationAST({
                FUN_NAME: t.identifier(replaceOperator),
                ARGS: [path.node.left, path.node.right]
              })
            );
        }
      },
      AssignmentExpression: {
        exit: function (path) {
          var Program = path.findParent((path) => t.isProgram(path.node));
          var directives = Program.node.directives;
          var replaceOperator = pushCache(path.node.operator);

          if (directives[0] && directives[0].value.value == "calc polyfill") {
            return;
          }

          if (replaceOperator !== "none") {
            path.node.right = t.CallExpression(t.Identifier(replaceOperator), [path.node.left, path.node.right]);
            path.node.operator = "=";
          }
        }
      }
    }
  };
};
