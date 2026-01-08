import type { ParserAstVisitor } from "../../visit/ParserAstVisitor.js";
import { AstType } from "./AstType.js";
import type { Instruction, Value } from "./Interfaces.js";

export class AInstruction implements Instruction {
  type: AstType = AstType.A_INSTRUCTION;
  value: Value;

  constructor(val: Value) {
    this.value = val;
  }

  accept(v: ParserAstVisitor): any {
    return v.visitAInstruction(this);
  }
}
