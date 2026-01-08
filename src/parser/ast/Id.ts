import type { ParserAstVisitor } from "../../visit/ParserAstVisitor.js";
import { AstType } from "./AstType.js";
import type { Value } from "./Interfaces.js";

export class Id implements Value {
  type: AstType = AstType.IDENTIFER;
  name: string;

  constructor(v: string) {
    this.name = v;
  }

  accept(v: ParserAstVisitor): any {
    return v.visitId(this);
  }
}
