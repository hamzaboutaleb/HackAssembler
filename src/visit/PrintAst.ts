import type { AInstruction } from "../parser/ast/AInstruction";
import type { CInstruction } from "../parser/ast/CInstruction";
import type { Id } from "../parser/ast/Id";
import type { Label } from "../parser/ast/Labe";
import type { Numeric } from "../parser/ast/Numeric";
import type { Program } from "../parser/ast/Program";
import type { ParserAstVisitor } from "./ParserAstVisitor";

export class PrintAst implements ParserAstVisitor {
  visitAInstruction(n: AInstruction): any {
    const value = n.value.accept(this);

    console.log(`@${value}`);
  }

  visitCInstruction(n: CInstruction): any {
    let value = "";
    if (n.dest != "") value += n.dest + "=";
    value += n.comp;
    if (n.jump != "") {
      value += ";" + n.jump;
    }
    console.log(value);
  }

  visitId(n: Id): any {
    return n.name;
  }

  visitLabel(n: Label): any {
    const name = n.name.accept(this);
    console.log(`(${name})`);
  }

  visitNumeric(n: Numeric): any {
    return n.value;
  }

  visitProgram(n: Program): any {
    n.instructions.forEach((ins) => {
      ins.accept(this);
    });
  }
}
