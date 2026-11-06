// End-to-end: open Resident details from the Master List, read it, close it,
// and check focus goes back to the row's View button.
//
// Runs against any served web build of the app (the dev server or a static
// export) with no extra dependencies: Node's built-in test runner drives an
// installed Chromium over the DevTools protocol, signs in a fake admin and
// answers every /api call itself, so no backend or real data is involved.
//
//   E2E_BASE_URL=http://localhost:8081 CHROME_PATH=chromium npm run test:e2e

import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:8081";
const CHROME = process.env.CHROME_PATH ?? "chromium";
const PORT = Number(process.env.E2E_DEBUG_PORT ?? 9345);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// The sample resident from the design brief; not a real person's data.
const EFREN = {
  _id: "6a1ce7b1950000000000e7b1",
  masterResidentId: "MSL-1CE7B195",
  firstName: "Efren",
  middleName: "Romero",
  lastName: "Abaleta",
  suffix: "",
  dateOfBirth: "1958-10-13",
  sex: "male",
  civilStatus: "married",
  barangay: "Maslog",
  address: "Purok 2, Pangulo",
  role: "resident",
  isActive: true,
  linkedAccount: false,
  createdAt: "2026-10-21T02:00:00.000Z",
  updatedAt: "2026-10-21T02:00:00.000Z",
};

const b64 = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
const ADMIN = {
  id: "e2e-admin",
  name: "E2E Admin",
  role: "admin",
  verified: true,
  token: `${b64({ alg: "HS256" })}.${b64({ userId: "e2e-admin", role: "admin", platform: "web", exp: Math.floor(Date.now() / 1000) + 3600 })}.e2e`,
};

const answer = (url) => {
  const path = new URL(url).pathname;
  if (path.endsWith(`/admin/master-residents/${EFREN._id}`)) return { success: true, record: EFREN };
  if (path.endsWith("/admin/master-residents")) {
    return { success: true, records: [EFREN], counts: { active: 1, inactive: 0, total: 1 }, pagination: { page: 1, limit: 20, total: 1, totalPages: 1 } };
  }
  return { success: true, data: [], items: [], users: [], total: 0, notifications: [], unreadCount: 0 };
};

let chrome;
let socket;
let profile;
let nextId = 0;
const pending = new Map();
const pageErrors = [];

const send = (method, params = {}) =>
  new Promise((resolve) => {
    const id = ++nextId;
    pending.set(id, resolve);
    socket.send(JSON.stringify({ id, method, params }));
  });

const evaluate = async (expression) => {
  const { result } = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? "evaluate failed");
  return result.result.value;
};

const waitFor = async (expression, label, timeout = 15000) => {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    if (await evaluate(expression)) return;
    await sleep(150);
  }
  assert.fail(`Timed out waiting for ${label}`);
};

const press = async (key, code, keyCode) => {
  for (const type of ["keyDown", "keyUp"]) {
    await send("Input.dispatchKeyEvent", { type, key, code, windowsVirtualKeyCode: keyCode, text: key === "Enter" ? "\r" : undefined });
  }
};

const visible = (selector) => `[...document.querySelectorAll(${JSON.stringify(selector)})].filter((el) => el.getClientRects().length)`;
const VIEW_BUTTON = `${visible('[aria-label="View Efren Romero Abaleta"]')}[0]`;
const DIALOG = `${visible('[role="dialog"][aria-labelledby]')}.find((el) => document.getElementById(el.getAttribute("aria-labelledby"))?.textContent === "Resident details")`;

const openList = async () => {
  await send("Page.navigate", { url: `${BASE_URL}/admin/users?section=masterlist` });
  await waitFor(`Boolean(${VIEW_BUTTON})`, "the Master List row");
};

before(async () => {
  profile = mkdtempSync(join(tmpdir(), "maslogcare-e2e-"));
  chrome = spawn(
    CHROME,
    ["--headless=new", `--remote-debugging-port=${PORT}`, "--no-first-run", "--disable-gpu", `--user-data-dir=${profile}`,
      // Keeps the app's realtime socket away from any real backend.
      "--proxy-server=127.0.0.1:9", `--proxy-bypass-list=<-loopback>;${new URL(BASE_URL).host}`, "about:blank"],
    { stdio: "ignore" },
  );
  let targets = [];
  for (let attempt = 0; attempt < 50 && !targets.length; attempt += 1) {
    await sleep(200);
    targets = await fetch(`http://127.0.0.1:${PORT}/json`).then((res) => res.json()).catch(() => []);
  }
  socket = new WebSocket(targets.find((target) => target.type === "page").webSocketDebuggerUrl);
  await new Promise((resolve) => socket.addEventListener("open", resolve));
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.id && pending.has(message.id)) {
      pending.get(message.id)(message);
      pending.delete(message.id);
    }
    if (message.method === "Runtime.exceptionThrown") pageErrors.push(message.params.exceptionDetails.text);
    if (message.method === "Fetch.requestPaused") {
      const { requestId, request } = message.params;
      const body = request.method === "OPTIONS" ? {} : answer(request.url);
      send("Fetch.fulfillRequest", {
        requestId,
        responseCode: 200,
        responseHeaders: [
          { name: "Content-Type", value: "application/json" },
          { name: "Access-Control-Allow-Origin", value: "*" },
          { name: "Access-Control-Allow-Headers", value: "*" },
          { name: "Access-Control-Allow-Methods", value: "*" },
        ],
        body: Buffer.from(JSON.stringify(body)).toString("base64"),
      });
    }
  });
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Fetch.enable", { patterns: [{ urlPattern: "*/api/*" }] });
  await send("Emulation.setFocusEmulationEnabled", { enabled: true });
  await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: BASE_URL });
  await sleep(1500);
  await evaluate(`localStorage.setItem("maslogcare_current_user", ${JSON.stringify(JSON.stringify(ADMIN))})`);
});

after(async () => {
  // Chromium's helper processes keep writing the profile until the browser has
  // shut down, so close it properly and wait before deleting the profile.
  if (chrome && chrome.exitCode === null) {
    const exited = new Promise((resolve) => chrome.once("exit", resolve));
    await Promise.race([send("Browser.close"), sleep(2000)]);
    const forced = setTimeout(() => chrome.kill("SIGKILL"), 5000);
    await exited;
    clearTimeout(forced);
  }
  socket?.close();
  if (profile) rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
});

describe("Resident details", () => {
  it("opens from the keyboard, shows the record, and hands focus back on Escape", async () => {
    await openList();
    await evaluate(`${VIEW_BUTTON}.focus()`);
    await press("Enter", "Enter", 13);
    await waitFor(`Boolean(${DIALOG})`, "the Resident details dialog");
    await waitFor(`${DIALOG}.innerText.includes("Efren Romero Abaleta")`, "the fetched record");

    assert.equal(await evaluate(`${DIALOG}.getAttribute("aria-modal")`), "true");
    const fields = await evaluate(
      `Object.fromEntries([...${DIALOG}.querySelectorAll("dl > div")].map((row) => [row.querySelector("dt").textContent, row.querySelector("dd").textContent]))`,
    );
    assert.equal(fields["Last name"], "Abaleta");
    assert.equal(fields["Date of birth"], "Oct 13, 1958");
    assert.equal(fields.Suffix, "Not recorded");
    assert.equal(fields["App account"], "Not linked");
    assert.ok(await evaluate(`Boolean(${visible('[aria-label="Status: Active"]')}[0])`), "status has a text label");
    assert.ok(await evaluate(`${DIALOG}.contains(document.activeElement)`), "focus moved into the dialog");

    await press("Escape", "Escape", 27);
    await waitFor(`!${DIALOG}`, "the dialog to close");
    await waitFor(`document.activeElement === ${VIEW_BUTTON}`, "focus back on the View button");
  });

  it("opens from a row click and returns focus to that row after Close", async () => {
    await openList();
    const point = await evaluate(
      `(() => { const row = ${VIEW_BUTTON}.closest('[role="row"]') ?? ${VIEW_BUTTON}.parentElement.parentElement; const box = row.getBoundingClientRect(); return { x: box.left + 40, y: box.top + box.height / 2 }; })()`,
    );
    for (const type of ["mousePressed", "mouseReleased"]) {
      await send("Input.dispatchMouseEvent", { type, x: point.x, y: point.y, button: "left", clickCount: 1 });
    }
    await waitFor(`Boolean(${DIALOG})`, "the dialog from a row click");
    await waitFor(`${DIALOG}.innerText.includes("Efren Romero Abaleta")`, "the fetched record");
    await sleep(400); // let the entrance animation settle before aiming the pointer
    // React Native Web pressables ignore synthetic clicks, so press it with the mouse.
    const close = await evaluate(
      `(() => { const box = ${DIALOG}.querySelector('[data-testid="resident-details-close"]').getBoundingClientRect(); return { x: box.left + box.width / 2, y: box.top + box.height / 2 }; })()`,
    );
    for (const type of ["mousePressed", "mouseReleased"]) {
      await send("Input.dispatchMouseEvent", { type, x: close.x, y: close.y, button: "left", clickCount: 1 });
    }
    await waitFor(`!${DIALOG}`, "the dialog to close");
    await waitFor(`document.activeElement === ${VIEW_BUTTON}`, "focus back on the row's View button");
    assert.deepEqual(pageErrors, []);
  });
});
