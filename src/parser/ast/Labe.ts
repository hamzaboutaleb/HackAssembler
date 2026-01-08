import type { ParserAstVisitor } from "../../visit/ParserAstVisitor.js";
import { AstType } from "./AstType.js";
import type { Id } from "./Id.js";
import type { Instruction } from "./Interfaces.js";

export class Label implements Instruction {
  type: AstType = AstType.LABEL;
  name: Id;

  constructor(name: Id) {
    this.name = name;
  }

  accept(v: ParserAstVisitor): any {
    return v.visitLabel(this);
  }
}
