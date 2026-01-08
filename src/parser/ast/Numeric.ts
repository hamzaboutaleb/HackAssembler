import type { ParserAstVisitor } from "../../visit/ParserAstVisitor.js";
import { AstType } from "./AstType.js";
import type { Value } from "./Interfaces.js";

export class Numeric implements Value {
  type: AstType = AstType.NUMBER;
  value: string;

  constructor(v: string) {
    this.value = v;
  }

  accept(v: ParserAstVisitor): any {
    return v.visitNumeric(this);
  }
}
