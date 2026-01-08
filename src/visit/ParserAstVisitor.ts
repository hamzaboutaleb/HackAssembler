import { AInstruction } from "../parser/ast/AInstruction.js";
import type { CInstruction } from "../parser/ast/CInstruction.js";
import type { Id } from "../parser/ast/Id.js";
import type { Label } from "../parser/ast/Labe.js";
import type { Numeric } from "../parser/ast/Numeric";
import type { Program } from "../parser/ast/Program.js";

export interface ParserAstVisitor {
  visitAInstruction(n: AInstruction): any;
  visitCInstruction(n: CInstruction): any;
  visitId(n: Id): any;
  visitLabel(n: Label): any;
  visitNumeric(n: Numeric): any;
  visitProgram(n: Program): any;
}
