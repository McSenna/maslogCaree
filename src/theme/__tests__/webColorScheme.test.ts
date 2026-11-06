import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { describe, it } from "node:test";

import { applyWebColorScheme, DARK_CLASS } from "../webColorScheme.ts";

const require = createRequire(import.meta.url);
const config = require("../../../tailwind.config.js") as { darkMode?: unknown };

describe("tailwind.config.js dark mode", () => {
  // Without it Tailwind defaults to "media": NativeWind's web runtime then throws
  // "Cannot manually set color scheme, as dark mode is type 'media'" as soon as
  // global.css loads after it, and `dark:` classes follow the OS, not the app.
  // NativeWind 4 reads only "class" (Tailwind 3.4's "selector" falls back to media).
  it('is "class", so the app theme drives dark: variants', () => {
    assert.equal(config.darkMode, "class");
  });
});

describe("applyWebColorScheme", () => {
  const fakeRoot = (initial: string[] = []) => {
    const classes = new Set(initial);
    const calls: string[] = [];
    const root = {
      classList: {
        toggle: (token: string, force: boolean) => {
          calls.push(`class:${force ? "+" : "-"}${token}`);
          if (force) classes.add(token);
          else classes.delete(token);
          return force;
        },
      },
    };
    return { root, classes, calls };
  };

  it("adds the dark class, then tells NativeWind", () => {
    const { root, classes, calls } = fakeRoot();
    applyWebColorScheme("dark", root, (scheme) => calls.push(`set:${scheme}`));
    assert.ok(classes.has(DARK_CLASS));
    // The class must be written first: NativeWind's late-CSS observer reads it to pick a scheme.
    assert.deepEqual(calls, ["class:+dark", "set:dark"]);
  });

  it("removes the dark class for light", () => {
    const { root, classes, calls } = fakeRoot([DARK_CLASS, "other"]);
    applyWebColorScheme("light", root, (scheme) => calls.push(`set:${scheme}`));
    assert.deepEqual([...classes], ["other"]);
    assert.deepEqual(calls, ["class:-dark", "set:light"]);
  });
});
