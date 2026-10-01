import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { extname } from 'node:path';

import ts from 'typescript';

const sourceRoot = new URL('../src/', import.meta.url).href;

// Exercise the real Next entry points in Node's test runner, which cannot load
// JSX or Next's server-only marker/alias without these test-local hooks.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (
      specifier === 'server-only' &&
      context.parentURL === `${sourceRoot}lib/prepare-paper.ts`
    ) {
      return { shortCircuit: true, url: 'data:text/javascript,export {}' };
    }
    if (context.parentURL?.startsWith(sourceRoot)) {
      if (specifier.startsWith('@/')) {
        return nextResolve(
          new URL(`${specifier.slice(2)}.ts`, sourceRoot).href,
          context,
        );
      }
      if (specifier.startsWith('.') && !extname(specifier)) {
        return nextResolve(`${specifier}.ts`, context);
      }
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.startsWith(sourceRoot) && url.endsWith('.tsx')) {
      return {
        format: 'module',
        shortCircuit: true,
        source: ts.transpileModule(readFileSync(new URL(url), 'utf8'), {
          compilerOptions: {
            jsx: ts.JsxEmit.ReactJSX,
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ES2022,
          },
        }).outputText,
      };
    }
    return nextLoad(url, context);
  },
});
