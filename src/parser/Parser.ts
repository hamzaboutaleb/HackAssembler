import type { Token } from "../Lexer/Token.js";
import { TokenType } from "../Lexer/TokenType.js";
import { AInstruction } from "./ast/AInstruction.js";
import { CInstruction } from "./ast/CInstruction.js";
import { Id } from "./ast/Id.js";
import type { Value } from "./ast/Interfaces.js";
import { Label } from "./ast/Labe.js";
import { Numeric } from "./ast/Numeric.js";
import { Program } from "./ast/Program.js";

export class Parser {
  private tokens: Token[];
  private pos: number = 0;
  private program: Program;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.program = new Program();
  }

  parse(): Program {
    while (!this.isAtEnd()) {
      if (this.peek().type == TokenType.NEW_LINE) {
        this.advance();
        continue;
      }
      this.parseInstruction();
    }
    return this.program;
  }

  private parseInstruction() {
    const curr = this.peek();
    switch (curr.type) {
      case TokenType.LEFT_PAREN:
        this.parseLabel();
        break;
      case TokenType.AT:
        this.parseAInstruction();
        break;
      default:
        this.parseCInstruction();
    }
  }

  private parseLabel() {
    this.consume(TokenType.LEFT_PAREN);
    const name = this.parseLabelName();
    this.consume(TokenType.RIGHT_PAREN);
    this.consume(TokenType.NEW_LINE);
    this.program.add(new Label(name));
  }

  parseLabelName(): Id {
    const name = this.consume(TokenType.IDENTIFER);
    return new Id(name.value);
  }

  private parseAInstruction() {
    this.consume(TokenType.AT);
    const value = this.parseAInstruValue();
    this.consume(TokenType.NEW_LINE, new Error("new line required"));
    this.program.add(new AInstruction(value));
  }

  parseAInstruValue(): Value {
    const curr = this.advance();

    if (curr.type == TokenType.IDENTIFER) {
      return new Id(curr.value);
    } else if (curr.type == TokenType.NUMBER) {
      return new Numeric(curr.value);
    }

    throw new Error("Invalid A instruction value");
  }

  private parseCInstruction() {
    const inst = new CInstruction();
    const dest = this.parseCDest(inst);
    const comp = this.parseCComp(inst);
    const jump = this.parseCJump(inst);
    this.consume(TokenType.NEW_LINE);
    inst.dest = dest;
    inst.comp = comp;
    inst.jump = jump;
    this.program.add(inst);
  }
  private parseCJump(ins: CInstruction): string {
    const c = this.peek();
    if (c.type != TokenType.SEMI_COLON) {
      return "";
    }
    this.consume(TokenType.SEMI_COLON);
    return this.advance().value;
  }

  private parseCComp(ins: CInstruction): string {
    let value = "";
    while (
      this.peek().type !== TokenType.SEMI_COLON &&
      this.peek().type !== TokenType.NEW_LINE &&
      !this.isAtEnd()
    ) {
      value += this.advance().value;
    }
    return value;
  }

  private parseCDest(ins: CInstruction): string {
    const next = this.peek(1);
    if (next.type !== TokenType.EQUAL) return "";
    const curr = this.advance();
    this.consume(TokenType.EQUAL);

    return curr.value;
  }

  private peek(n = 0): Token {
    if (this.pos + n >= this.tokens.length) return this.tokens.at(-1)!;

    return this.tokens[this.pos + n]!;
  }

  private consume(type: TokenType, err: Error = new Error("")): Token {
    const curr = this.peek();

    if (curr.type !== type) {
      throw err;
    }
    return this.advance();
  }

  private match(...types: TokenType[]): boolean {
    const curr = this.peek();
    for (const type of types) {
      if (curr.type === type) {
        this.advance();
        return true;
      }
    }

    return false;
  }

  private advance() {
    const curr = this.peek();
    this.pos++;
    return curr;
  }

  private isAtEnd(): boolean {
    return this.pos >= this.tokens.length || this.peek().type === TokenType.EOF;
  }
}
