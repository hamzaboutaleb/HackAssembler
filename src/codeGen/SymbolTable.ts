import { Label } from "../parser/ast/Labe.js";
import type { Program } from "../parser/ast/Program.js";

const preDefinedSymbols = new Map([
  ["SP", 0],
  ["LCL", 1],
  ["ARG", 2],
  ["THIS", 3],
  ["THAT", 4],
  ["R0", 0],
  ["R1", 1],
  ["R2", 2],
  ["R3", 3],
  ["R4", 4],
  ["R5", 5],
  ["R6", 6],
  ["R7", 7],
  ["R8", 8],
  ["R9", 9],
  ["R10", 10],
  ["R11", 11],
  ["R12", 12],
  ["R13", 13],
  ["R14", 14],
  ["R15", 15],
  ["SCREEN", 16384],
  ["KBD", 24576],
]);

export class SymbolTable {
  private symbols = preDefinedSymbols;
  private varibaleID = 16;

  get(key: string): number | undefined {
    return this.symbols.get(key);
  }

  addVariable(key: string) {
    if (this.symbols.has(key))
      throw new Error(`Varible "${key}" already exist`);
    this.symbols.set(key, this.varibaleID++);
    return this.symbols.get(key)!;
  }

  addLabel(name: string, value: number) {
    if (this.symbols.has(name))
      throw new Error(`Lable "${name}" already exist`);
    this.symbols.set(name, value);
  }

  contains(key: string): boolean {
    return this.symbols.has(key);
  }

  getAddress(key: string): number {
    const address = this.symbols.get(key);
    if (address === undefined)
      throw new Error(`Symbol "${key}" does not exist in the symbol table`);
    return address;
  }

  resolveLabels(program: Program) {
    let line = 0;
    program.instructions.forEach((element) => {
      if (element instanceof Label) {
        this.addLabel(element.name.name, line);
      } else {
        line++;
      }
    });
  }
}
