import type { ParserAstVisitor } from "../../visit/ParserAstVisitor.js";
import { AstType } from "./AstType.js";
import type { AstNode, Instruction } from "./Interfaces.js";

export class Program implements AstNode {
  type: AstType = AstType.PROGRAM;
  instructions: Instruction[] = [];

  add(instruction: Instruction) {
    this.instructions.push(instruction);
  }

  accept(v: ParserAstVisitor): any {
    return v.visitProgram(this);
  }
}
