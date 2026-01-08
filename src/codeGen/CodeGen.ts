import type { AInstruction } from "../parser/ast/AInstruction.js";
import type { CInstruction } from "../parser/ast/CInstruction.js";
import type { Id } from "../parser/ast/Id.js";
import type { Label } from "../parser/ast/Labe.js";
import type { Numeric } from "../parser/ast/Numeric.js";
import type { Program } from "../parser/ast/Program.js";
import type { ParserAstVisitor } from "../visit/ParserAstVisitor.js";
import { SymbolTable } from "./SymbolTable.js";

export class CodeGen implements ParserAstVisitor {
  private symbols = new SymbolTable();
  private output: string[] = [];
  private program: Program;

  constructor(program: Program) {
    this.program = program;
    this.symbols.resolveLabels(program);
  }

  gen(): string {
    this.visitProgram(this.program);
    return this.output.join("\n");
  }

  visitAInstruction(n: AInstruction) {
    const value = n.value.accept(this);
    let address = toBinary(value as number, 15);
    this.output.push("0" + address);
  }

  visitCInstruction(n: CInstruction) {
    this.output.push(n.binary);
  }

  visitId(n: Id) {
    if (this.symbols.contains(n.name)) {
      return this.symbols.getAddress(n.name);
    }
    return this.symbols.addVariable(n.name);
  }

  visitLabel(n: Label) {}

  visitNumeric(n: Numeric) {
    return +n.value;
  }

  visitProgram(n: Program) {
    n.instructions.forEach((ins) => {
      ins.accept(this);
    });
  }
}

function toBinary(value: number, length: number): string {
  let bin = value.toString(2);
  while (bin.length < length) {
    bin = "0" + bin;
  }
  return bin;
}
