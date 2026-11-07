'use strict';
// Exercises the real MetricCard flex styles in the Yoga version bundled with
// React Native. Requires a C++20 compiler; no emulator, backend or API is used.
//   node scripts/verifyMetricCardsNative.cjs
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { readFileSync, writeFileSync, readdirSync, mkdtempSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const postcss = require('postcss');
const tailwind = require('tailwindcss');
const { cssToReactNativeRuntime } = require('react-native-css-interop/css-to-rn');

const root = path.resolve(__dirname, '..');
const yoga = path.join(root, 'node_modules/react-native/ReactCommon/yoga');
const source = readFileSync(path.join(root, 'src/components/dashboard/admin/MetricCard.tsx'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: {
  jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: true,
} }).outputText;
const cardModule = { exports: {} };
// Render only the card's outer JSX. Its children stay as React elements;
// fonts, icons and animation do not affect the flex policy being tested.
vm.runInNewContext(compiled, {
  exports: cardModule.exports,
  require(id) {
    if (id === 'react/jsx-runtime') return require(id);
    if (id === 'react-native') return { Text: 'Text', View: 'View' };
    if (id === '@expo/vector-icons') return { Feather: 'Icon' };
    if (id === '@/design/adminDashboardTheme') return { DASHBOARD_CARD_SHADOW: {}, DASHBOARD_RADIUS: { card: 16 } };
    if (id.startsWith('./')) return id;
    throw new Error(`Unexpected dependency: ${id}`);
  },
});
const MetricCard = cardModule.exports.default;
const cpp = String.raw`
#include <yoga/Yoga.h>
#include <cstdio>
#include <cstdlib>
#include <initializer_list>
YGNodeRef child(YGNodeRef parent) {
  auto n = YGNodeNew();
  if (parent) YGNodeInsertChild(parent, n, YGNodeGetChildCount(parent));
  return n;
}
int main(int argc, char** argv) {
  auto root = child(nullptr);
  YGNodeStyleSetWidth(root, 360);
  YGNodeStyleSetHeight(root, 680);
  auto header = child(root);
  auto grid = child(header);
  YGNodeStyleSetGap(grid, YGGutterRow, 12);
  for (int r = 0; r < 2; r++) {
    auto row = child(grid);
    YGNodeStyleSetFlexDirection(row, YGFlexDirectionRow);
    YGNodeStyleSetGap(row, YGGutterColumn, 12);
    for (int c = 0; c < 2; c++) {
      auto cell = child(row);
      YGNodeStyleSetFlex(cell, 1);
      YGNodeStyleSetMinWidth(cell, 0);
      auto card = child(cell);
      YGNodeStyleSetFlexGrow(card, std::atof(argv[1]));
      YGNodeStyleSetFlexShrink(card, std::atof(argv[2]));
      if (argv[3][0] != 'a') YGNodeStyleSetFlexBasisPercent(card, std::atof(argv[3]));
      YGNodeStyleSetPadding(card, YGEdgeAll, 14);
      YGNodeStyleSetBorder(card, YGEdgeAll, 1);
      for (float height : {18.f, 36.f, 38.f}) YGNodeStyleSetHeight(child(card), height);
    }
  }
  auto tabs = child(header);
  YGNodeStyleSetHeight(tabs, 48);
  YGNodeCalculateLayout(root, YGUndefined, YGUndefined, YGDirectionLTR);
  bool contained = true;
  for (int r = 0; r < 2; r++) {
    auto row = YGNodeGetChild(grid, r);
    auto card = YGNodeGetChild(YGNodeGetChild(row, 0), 0);
    auto last = YGNodeGetChild(card, 2);
    float contentBottom = YGNodeLayoutGetTop(last) + YGNodeLayoutGetHeight(last);
    contained &= contentBottom <= YGNodeLayoutGetHeight(card);
    contained &= YGNodeLayoutGetTop(row) + contentBottom <= YGNodeLayoutGetTop(tabs);
    std::printf("row %d: card=%.0f, content bottom=%.0f, tabs=%.0f\n", r,
      YGNodeLayoutGetHeight(card), contentBottom, YGNodeLayoutGetTop(tabs));
  }
  YGNodeFreeRecursive(root);
  return contained ? 0 : 1;
}
`;
const cppFiles = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(dir, entry.name);
  return entry.isDirectory() ? cppFiles(file) : file.endsWith('.cpp') ? [file] : [];
});
(async () => {
  const temp = mkdtempSync(path.join(tmpdir(), 'metric-card-yoga-'));
  try {
    const fixture = path.join(temp, 'layout.cpp');
    const binary = path.join(temp, 'layout');
    writeFileSync(fixture, cpp);
    execFileSync('g++', ['-std=c++20', '-O0', '-I', yoga, fixture, ...cppFiles(path.join(yoga, 'yoga')), '-o', binary]);
    for (const compact of [false, true]) for (const selected of [false, true]) {
      const element = MetricCard({ palette: { tones: { primary: {} } }, tone: 'primary', label: 'Total accounts',
        value: 1408, description: '12 staff · 1396 residents', compact, selected });
      const css = await postcss([tailwind({ content: [{ raw: element.props.className }], corePlugins: { preflight: false } })])
        .process('@tailwind utilities;', { from: undefined });
      const rules = cssToReactNativeRuntime(css.css).rules;
      const styles = Object.assign({}, ...Object.values(rules).flatMap(rule => (rule.n ?? []).flatMap(r => r.d.flatMap(d => d[0]))));
      let output;
      try {
        output = execFileSync(binary, [String(styles.flexGrow ?? 0), String(styles.flexShrink ?? 0), String(styles.flexBasis ?? 'auto')], { encoding: 'utf8' });
      } catch (error) {
        assert.fail(`Card content overlaps its surface/tabs (compact=${compact}, selected=${selected}):\n${error.stdout}`);
      }
      console.log(`PASS native card containment (compact=${compact}, selected=${selected}): ${output.trim()}`);
    }
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
