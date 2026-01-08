import type { ParserAstVisitor } from "../../visit/ParserAstVisitor.js";
import { AstType } from "./AstType.js";

export interface AstNode {
  type: AstType;
  accept(v: ParserAstVisitor): any;
}

export interface Instruction extends AstNode {}

export interface Value extends AstNode {}
