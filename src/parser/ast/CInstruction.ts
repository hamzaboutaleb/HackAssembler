import type { ParserAstVisitor } from "../../visit/ParserAstVisitor.js";
import { AstType } from "./AstType.js";
import type { Instruction } from "./Interfaces.js";

const destMap = new Map([
  ["", "000"],
  ["M", "001"],
  ["D", "010"],
  ["MD", "011"],
  ["A", "100"],
  ["AM", "101"],
  ["AD", "110"],
  ["AMD", "111"],
]);

const jumpMap = new Map([
  ["", "000"],
  ["JGT", "001"],
  ["JEQ", "010"],
  ["JGE", "011"],
  ["JLT", "100"],
  ["JNE", "101"],
  ["JLE", "110"],
  ["JMP", "111"],
]);

const compMap = new Map([
  // When a=0 (Register A)
  ["0", "0101010"],
  ["1", "0111111"],
  ["-1", "0111010"],
  ["D", "0001100"],
  ["A", "0110000"],
  ["!D", "0001101"],
  ["!A", "0110001"],
  ["-D", "0001111"],
  ["-A", "0110011"],
  ["D+1", "0011111"],
  ["A+1", "0110111"],
  ["D-1", "0001110"],
  ["A-1", "0110010"],
  ["D+A", "0000010"],
  ["D-A", "0010011"],
  ["A-D", "0000111"],
  ["D&A", "0000000"],
  ["D|A", "0010101"],

  // When a=1 (Memory M)
  ["M", "1110000"],
  ["!M", "1110001"],
  ["-M", "1110011"],
  ["M+1", "1110111"],
  ["M-1", "1110010"],
  ["D+M", "1000010"],
  ["D-M", "1010011"],
  ["M-D", "1000111"],
  ["D&M", "1000000"],
  ["D|M", "1010101"],
]);

export class CInstruction implements Instruction {
  type: AstType = AstType.C_INSTRUCTION;
  private _dest: string;
  private _comp: string;
  private _jump: string;

  constructor(dest: string = "", comp: string = "", jump: string = "") {
    this._dest = dest;
    this._comp = comp;
    this._jump = jump;
  }

  set dest(v: string) {
    if (!destMap.has(v)) throw new Error(`Invalid Destination value '${v}'`);
    this._dest = v;
  }

  set jump(v: string) {
    if (!jumpMap.has(v)) throw new Error(`Invalid JUMP value '${v}'`);
    this._jump = v;
  }

  set comp(v: string) {
    if (!compMap.has(v)) throw new Error(`Invalid Comp value '${v}'`);
    this._comp = v;
  }

  get dest() {
    return this._dest;
  }

  get jump() {
    return this._jump;
  }

  get comp() {
    return this._comp;
  }

  get binary(): string {
    const compBits = compMap.get(this._comp)!;
    const destBits = destMap.get(this._dest)!;
    const jumpBits = jumpMap.get(this._jump)!;

    return `111${compBits}${destBits}${jumpBits}`;
  }

  accept(v: ParserAstVisitor): any {
    return v.visitCInstruction(this);
  }
}
