import { Token } from "./Token.js";
import { TokenType } from "./TokenType.js";

export class Lexer {
  private input: string;
  private position: number = 0;
  private start: number = 0;
  private tokens: Token[] = [];

  constructor(input: string) {
    this.input = input;
  }

  tokenize(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.position;
      this.nextToken();
    }
    this.addToken(TokenType.NEW_LINE, "");
    this.addToken(TokenType.EOF, "");
    return this.tokens;
  }

  nextToken() {
    const c: string = this.advance()!;
    switch (c) {
      case "@":
        this.addToken(TokenType.AT);
        break;
      case "=":
        this.addToken(TokenType.EQUAL);
        break;
      case ";":
        this.addToken(TokenType.SEMI_COLON);
        break;
      case "(":
        this.addToken(TokenType.LEFT_PAREN);
        break;
      case ")":
        this.addToken(TokenType.RIGHT_PAREN);
        break;
      case "+":
        this.addToken(TokenType.PLUS);
        break;
      case "-":
        this.addToken(TokenType.MINUS);
        break;
      case "|":
        this.addToken(TokenType.OR);
        break;
      case "&":
        this.addToken(TokenType.AND);
        break;
      case "!":
        this.addToken(TokenType.NOT);
        break;
      case "\n":
        this.addToken(TokenType.NEW_LINE, "");
        break;
      case "/":
        if (this.match("/")) this.comment();
        break;
      default: {
        if (this.isNumber(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.id();
        } else if (this.isWhitespace(c)) {
          break;
        } else throw new Error(`Invalide character ${c}`);
      }
    }
  }

  private comment() {
    while (!this.isAtEnd() && this.peek() != "\n") this.advance();
  }

  private id() {
    while (this.isAlpha(this.peek()) || this.isNumber(this.peek()))
      this.advance();

    this.addToken(TokenType.IDENTIFER);
  }

  private number() {
    while (this.isNumber(this.peek())) this.advance();
    this.addToken(TokenType.NUMBER);
  }

  private isWhitespace(c: string | null) {
    if (c === null) return false;
    return /\s/.test(c);
  }

  private isAlpha(c: string | null) {
    if (c == null) return false;
    return /[a-zA-Z_.$]/.test(c);
  }

  private isNumber(c: string | null): boolean {
    if (c == null) return false;
    return /[0-9]/.test(c);
  }

  private addToken(type: TokenType, value: string | undefined = undefined) {
    if (value === undefined)
      value = this.input.substring(this.start, this.position);
    this.tokens.push(new Token(type, value));
  }

  private isAtEnd(): boolean {
    return this.position >= this.input.length;
  }

  private match(c: string): boolean {
    if (this.peek() == c) {
      this.advance();
      return true;
    }
    return false;
  }

  private advance(): string | null {
    if (this.position >= this.input.length) {
      return null;
    }
    return this.input[this.position++]!;
  }

  private peek(): string | null {
    if (this.position >= this.input.length) {
      return null;
    }
    return this.input[this.position]!;
  }
}
