import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

// NativeWind's css-interop drops a Pressable style function on native (chips
// lost their background and layout on Android), so a style that depends on
// pressed or hovered must go through StatePressable, which resolves it first.

const ROOTS = ["src", "app"];

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "node_modules" || name === "__tests__" ? [] : sourceFiles(path);
    return path.endsWith(".tsx") ? [path] : [];
  });

/** Each `style={(` whose nearest enclosing opening tag is a plain Pressable. */
const offenders = (source: string): number[] => {
  const lines: number[] = [];
  const styleFn = /style=\{\s*\(/g;
  for (let match = styleFn.exec(source); match; match = styleFn.exec(source)) {
    const before = source.slice(0, match.index);
    const owners = [...before.matchAll(/<(\w+)(?=[\s>])/g)];
    const owner = owners.at(-1)?.[1];
    if (owner === "Pressable") lines.push(before.split("\n").length);
  }
  return lines;
};

describe("Pressable styles", () => {
  it("never passes a style function to a plain Pressable", () => {
    const found = ROOTS.flatMap(sourceFiles).flatMap((file) =>
      offenders(readFileSync(file, "utf8")).map((line) => `${file}:${line}`)
    );
    assert.deepEqual(found, [], `Use StatePressable for these: ${found.join(", ")}`);
  });

  it("catches the pattern it guards against", () => {
    assert.deepEqual(offenders('<Pressable\n  onPress={go}\n  style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}\n/>'), [3]);
    assert.deepEqual(offenders("<StatePressable style={({ pressed }) => ({})} />"), []);
  });
});
