import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { INTER_FACES, webFontFaceCss } from "../webFonts.ts";

const PUBLIC_DIR = new URL("../../../public/fonts/", import.meta.url);

describe("web fonts", () => {
  it("ships the four weights the type scale uses", () => {
    assert.deepEqual(INTER_FACES.map((face) => face.weight), [400, 500, 600, 700]);
  });

  it("serves every font file from public/fonts", () => {
    for (const { file } of INTER_FACES) assert.ok(existsSync(new URL(file, PUBLIC_DIR)), file);
  });

  it("keeps the font's license beside the files", () => {
    assert.ok(existsSync(new URL("OFL.txt", PUBLIC_DIR)));
  });

  it("answers for react-native-web's system stack as well as Inter, at each weight", () => {
    const css = webFontFaceCss();
    for (const family of ["Inter", "-apple-system"]) {
      for (const { weight, file } of INTER_FACES) {
        assert.ok(css.includes(`@font-face{font-family:"${family}";font-weight:${weight};font-style:normal;font-display:swap;src:url("/fonts/${file}") format("truetype")}`), `${family} ${weight}`);
      }
    }
  });

  it("is written into the document head", () => {
    assert.match(readFileSync(new URL("../../../app/+html.tsx", import.meta.url), "utf8"), /webFontFaceCss\(\)/);
  });
});
