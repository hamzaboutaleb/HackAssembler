import * as fs from "fs";
import { Lexer } from "./Lexer/Lexer.js";
import { Parser } from "./parser/Parser.js";
import { CodeGen } from "./codeGen/CodeGen.js";

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("No arguments provided.");
  process.exit(1);
}

const fileName: string = args[0]!;
try {
  const content = fs.readFileSync(fileName, "utf-8");
  const lexer = new Lexer(content);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const program = parser.parse();
  const codeGen = new CodeGen(program);
  const output = codeGen.gen();
  const outputFileName = fileName.replace(/\.[^/.]+$/, "") + ".hack";
  fs.writeFileSync(outputFileName, output);
  console.log(`Assembled successfully to ${outputFileName}`);
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error(error.message, error.stack);
  } else {
    console.error("error occured");
  }
}
