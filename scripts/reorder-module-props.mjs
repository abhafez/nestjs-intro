#!/usr/bin/env node
// Reorders @Module({...}) decorator properties into a fixed order.
// Used as a save-time codemod (see .vscode/settings.json) since oxlint/oxfmt
// have no rule for enforcing a *custom* (non-alphabetical) property order.
import ts from 'typescript';
import { readFileSync, writeFileSync, globSync } from 'node:fs';

const ORDER = ['controllers', 'providers', 'imports', 'exports'];

function reorderModuleDecorator(filePath) {
  const source = readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true);

  let objectLiteral = null;

  function visit(node) {
    if (
      ts.isDecorator(node) &&
      ts.isCallExpression(node.expression) &&
      ts.isIdentifier(node.expression.expression) &&
      node.expression.expression.text === 'Module' &&
      node.expression.arguments.length === 1 &&
      ts.isObjectLiteralExpression(node.expression.arguments[0])
    ) {
      objectLiteral = node.expression.arguments[0];
      return;
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);

  if (!objectLiteral || objectLiteral.properties.length < 2) return false;

  const props = objectLiteral.properties;
  const indexOf = (name) => {
    const i = ORDER.indexOf(name);
    return i === -1 ? ORDER.length : i;
  };

  const propText = (prop) => source.slice(prop.getStart(sourceFile), prop.getEnd());
  const propName = (prop) => (prop.name && ts.isIdentifier(prop.name) ? prop.name.text : '');

  const sorted = [...props].sort((a, b) => indexOf(propName(a)) - indexOf(propName(b)));

  const originalNames = props.map(propName).join(',');
  const sortedNames = sorted.map(propName).join(',');
  if (originalNames === sortedNames) return false;

  // indentation: whitespace between the line start and the first property
  const firstPropStart = props[0].getStart(sourceFile);
  const lineStart = source.lastIndexOf('\n', firstPropStart) + 1;
  const indent = source.slice(lineStart, firstPropStart);

  const trailingComma = source.slice(props[props.length - 1].end, props[props.length - 1].end + 1) === ',';

  const body = sorted.map(propText).join(`,\n${indent}`);
  const replacement = body + (trailingComma ? ',' : '');

  const start = props[0].getStart(sourceFile);
  const end = props[props.length - 1].end + (trailingComma ? 1 : 0);

  const updated = source.slice(0, start) + replacement + source.slice(end);
  if (updated !== source) {
    writeFileSync(filePath, updated);
    return true;
  }
  return false;
}

const files = process.argv.slice(2);
if (files.length === 0) {
  files.push(...globSync('src/**/*.module.ts', { exclude: (p) => p.includes('node_modules') }));
}
if (files.length === 0) {
  console.error('Usage: reorder-module-props.mjs [file.ts ...]  (defaults to all src/**/*.module.ts)');
  process.exit(1);
}

let changed = false;
for (const file of files) {
  try {
    if (reorderModuleDecorator(file)) {
      console.log(`reordered: ${file}`);
      changed = true;
    }
  } catch (err) {
    console.error(`failed: ${file}: ${err.message}`);
    process.exitCode = 1;
  }
}

if (changed) {
  console.error('Module property order fixed above — stage the changes and commit again.');
  process.exitCode = 1;
}
