import {
  AST,
  AstVisitor, Binary, BindingPipe, Chain, Conditional, FunctionCall, ImplicitReceiver, Interpolation,
  KeyedRead, KeyedWrite, LiteralArray, LiteralMap, LiteralMapKey, LiteralPrimitive, MethodCall, NonNullAssert, PrefixNot, PropertyRead,
  PropertyWrite,
  Quote, SafeMethodCall, SafePropertyRead
} from '../compiler/expression_parser/ast';

export class TemplateVisitor implements AstVisitor {
  visitBinary(ast: Binary, context: any): Function {
    const left = ast.left.visit(this, context);
    const right = ast.right.visit(this, context);
    if (typeof left !== 'undefined' && typeof right !== 'undefined') {
      switch (ast.operation) {
        case '||':
          return (data: any) => left(data) || right(data);
        case '&&':
          return (data: any) => left(data) && right(data);
        case '==':
          // tslint:disable-next-line
          return (data: any) => left(data) == right(data);
        case '===':
          return (data: any) => left(data) === right(data);
        case '!=':
          // tslint:disable-next-line
          return (data: any) => left(data) != right(data);
        case '!==':
          return (data: any) => left(data) !== right(data);
        case '<':
          return (data: any) => left(data) < right(data);
        case '>':
          return (data: any) => left(data) > right(data);
        case '<=':
          return (data: any) => left(data) <= right(data);
        case '>=':
          return (data: any) => left(data) >= right(data);
        case '+':
          return (data: any) => left(data) + right(data);
        case '-':
          return (data: any) => left(data) - right(data);
        case '*':
          return (data: any) => left(data) * right(data);
        case '%':
          return (data: any) => left(data) % right(data);
        case '/':
          return (data: any) => left(data) / right(data);
      }
    }
    if (typeof left !== 'undefined') {
      return (data: any) => left(data);
    }
    if (typeof right !== 'undefined') {
      return (data: any) => right(data);
    }
    return () => undefined;
  }

  visitChain(ast: Chain, context: any): Function {
    return () => undefined;
  }

  visitConditional(ast: Conditional, context: any): Function {
    const condition = ast.condition.visit(this, context);
    let trueExp: Function = () => undefined;
    let falseExp: Function = () => undefined;
    if (typeof ast.trueExp !== 'undefined') {
      trueExp = ast.trueExp.visit(this, context);
    }
    if (typeof ast.falseExp !== 'undefined') {
      falseExp = ast.falseExp.visit(this, context);
    }

    return (data: any) => condition(data) ? trueExp(data) : falseExp(data);
  }

  visitFunctionCall(ast: FunctionCall, context: any): Function {
    // TODO ...
    return () => undefined;
  }

  visitImplicitReceiver(ast: ImplicitReceiver, context: any): Function {
    // TODO ...
    return (data: any) => data || {};
  }

  visitInterpolation(ast: Interpolation, context: any): Function {
    if (ast.strings.filter((string: any) => string.length !== 0).length > 0) {
      const result: any[] = [];
      ast.strings.forEach((string: string, i: number) => {
        if (string.length > 0) {
          result.push(string);
        }
        if (ast.expressions.hasOwnProperty(i)) {
          result.push(ast.expressions[i].visit(this, context));
        }
      });
      return (data: any) => result.map((ctx: any) => {
        if (typeof ctx === 'function') {
          return ctx(data);
        }
        return ctx;
      }).join('');
    } else {
      const result = ast.expressions.map((ctx: AST) => ctx.visit(this, context));
      if (result.length > 0) {
        if (result.length === 1) {
          return (data: any) => {
            const res = result[0];
            if (typeof res === 'function') {
              return res(data);
            }
            return res;
          };
        } else {
          return (data: any) => result.map((ctx: any) => {
            if (typeof ctx === 'function') {
              return ctx(data);
            }
            return ctx;
          });
        }
      } else {
        return () => undefined;
      }
    }
  }

  visitKeyedRead(ast: KeyedRead, context: any): Function {
    const keyFunc = ast.key.visit(this, context);
    const objFunc = ast.obj.visit(this, context);
    return (data: any) => {
      const key = keyFunc(data);
      const obj = objFunc(data);

      return obj && key ? obj[key] : undefined;
    };
  }

  visitKeyedWrite(ast: KeyedWrite, context: any): Function {
    return () => undefined;
  }

  visitLiteralArray(ast: LiteralArray, context: any): Function {
    const expressions = ast.expressions.map((ctx: AST) => ctx.visit(this, context));
    return (data: any) => expressions.map((expression: Function) => expression(data));
  }

  visitLiteralMap(ast: LiteralMap, context: any): Function {
    const result: any = {};
    for (let i = 0; i < ast.keys.length; i++) {
      const ctx: LiteralMapKey = ast.keys[i];
      if (ast.values.hasOwnProperty(i)) {
        result[ctx.key] = ast.values[i].visit(this, context);
      } else {
        result[ctx.key] = () => undefined;
      }
    }
    return (data: any) => {
      const temp: any = {};
      for (let j = 0, keys = Object.keys(result); j < keys.length; j++) {
        temp[keys[j]] = result[keys[j]](data);
      }
      return temp;
    };
  }

  visitLiteralPrimitive(ast: LiteralPrimitive, context: any): Function {
    const value = ast.value;
    return () => value;
  }

  visitMethodCall(ast: MethodCall, context: any): Function {
    return this.visitSafeMethodCall(ast, context);
  }

  visitPipe(ast: BindingPipe, context: any): Function {
    return () => undefined;
  }

  visitPrefixNot(ast: PrefixNot, context: any): Function {
    const expression = ast.expression.visit(this, context);
    return (data: any) => !expression(data);
  }

  visitNonNullAssert(ast: NonNullAssert, context: any): Function {
    return () => undefined;
  }

  visitPropertyRead(ast: PropertyRead, context: any): Function {
    return this.visitSafePropertyRead(ast, context);
  }

  visitPropertyWrite(ast: PropertyWrite, context: any): Function {
    return () => undefined;
  }

  visitQuote(ast: Quote, context: any): Function {
    return () => undefined;
  }

  visitSafeMethodCall(ast: SafeMethodCall, context: any): Function {
    return () => undefined;
  }

  visitSafePropertyRead(ast: SafePropertyRead, context: any): Function {
    const name = ast.name;
    const receiver = ast.receiver.visit(this, context);

    return (data: any) => {
      const result = receiver(data);
      return result && name ? result[name] : undefined;
    };
  }
}
