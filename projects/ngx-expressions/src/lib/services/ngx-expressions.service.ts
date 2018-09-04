import { Injectable } from '@angular/core';
import { isString, isUndefined } from 'util';
import { Parser } from '../compiler/expression_parser/parser';
import { Lexer } from '../compiler/expression_parser/lexer';
import { InterpolationConfig } from '../compiler/ml_parser/interpolation_config';
import { AstVisitor, ASTWithSource } from '../compiler/expression_parser/ast';
import { TemplateVisitor } from '../visitors/template.visitor';

@Injectable()
export class NgxExpressionsService {
  private _parser: Parser;

  constructor() {
    this._parser = new Parser(new Lexer());
  }

  createTemplate(input: any, context?: any, interpolationConfig?: InterpolationConfig): Function | null {
    let config: InterpolationConfig;
    if (interpolationConfig) {
      config = interpolationConfig;
    } else {
      config = new InterpolationConfig('{!!', '!!}');
    }

    const visitor = new TemplateVisitor();
    const ast = this._parse(input, ASTParseType.INTERPOLATION, visitor, context, config);
    if (ast.ast === null) {
      return null;
    } else {
      return ast.ast.visit(visitor, context);
    }
  }

  private _parse(input: any,
                 type: ASTParseType,
                 visitor: AstVisitor,
                 context?: any,
                 interpolationConfig?: InterpolationConfig): { ast: any, source: string } {
    if (isString(input)) {
      let ast: ASTWithSource | null;
      switch (type) {
        default:
        case ASTParseType.INTERPOLATION:
          ast = this._parser.parseInterpolation(input, null, interpolationConfig);
          break;
        case ASTParseType.ACTION:
          ast = this._parser.parseAction(input, null, interpolationConfig);
          break;
      }
      if (ast) {
        return { ast: ast.visit(visitor, context), source: ast.source };
      }
      return { ast: null, source: isUndefined(input) || input === null ? '' : input };
    }
    return { ast: null, source: isUndefined(input) || input === null ? '' : input };
  }
}

enum ASTParseType {
  INTERPOLATION = 'interpolation',
  ACTION = 'action'
}
