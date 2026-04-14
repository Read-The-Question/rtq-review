const { copyFileSync, mkdirSync, readFileSync, writeFileSync } = require("node:fs");
const { execFileSync } = require("node:child_process");
const { dirname, join, resolve } = require("node:path");

const projectRoot = resolve(__dirname, "../..");
const katexPackagePath = require.resolve("katex/package.json");
const katexFontsDir = join(dirname(katexPackagePath), "dist", "fonts");
const outputDir = resolve(projectRoot, "static/assets/fonts/katex");

const FULL_FONT_FILE_NAME = "KaTeX_Main-Regular.woff2";
const MINI_FONT_FILE_NAME = "KaTeX_Main-Regular-RTQ-Mini.woff2";
const MINI_FONT_BASE64_FILE_NAME = "KaTeX_Main-Regular-RTQ-Mini.base64.txt";
const MINI_FONT_GLYPHS = "0123456789.r ,-";

const fullFontOutputPath = join(outputDir, FULL_FONT_FILE_NAME);
const miniFontOutputPath = join(outputDir, MINI_FONT_FILE_NAME);
const miniFontBase64OutputPath = join(outputDir, MINI_FONT_BASE64_FILE_NAME);

mkdirSync(outputDir, { recursive: true });

copyFileSync(join(katexFontsDir, FULL_FONT_FILE_NAME), fullFontOutputPath);
console.log(`Synced ${FULL_FONT_FILE_NAME} -> ${join("static/assets/fonts/katex", FULL_FONT_FILE_NAME)}`);

execFileSync(
  "pyftsubset",
  [
    fullFontOutputPath,
    `--text=${MINI_FONT_GLYPHS}`,
    "--flavor=woff2",
    `--output-file=${miniFontOutputPath}`,
  ],
  {
    stdio: "inherit",
  },
);

const miniFontBase64 = readFileSync(miniFontOutputPath).toString("base64");
writeFileSync(miniFontBase64OutputPath, miniFontBase64);

console.log(`Built ${MINI_FONT_FILE_NAME} -> ${join("static/assets/fonts/katex", MINI_FONT_FILE_NAME)}`);
console.log(`Built ${MINI_FONT_BASE64_FILE_NAME} -> ${join("static/assets/fonts/katex", MINI_FONT_BASE64_FILE_NAME)}`);
