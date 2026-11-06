# Resident details

The read-only view of one Barangay Master List record, opened from the Resident
Masterlist (the row's View button, or a click anywhere on a desktop row).

- **Web, 1024px and up:** centred modal with two columns (personal information
  on the left; residency, record details and record history on the right).
- **Web, 768 to 1023px:** the same modal with the columns stacked.
- **Phones (under 768px) and the Android app:** a full-screen sheet with the
  footer pinned above the safe area. Android's back button or gesture closes it.

## Usage

```tsx
import ResidentDetailsDialog from "@/features/masterList/residentDetails/ResidentDetailsDialog";

{viewingId ? (
  <ResidentDetailsDialog
    key={viewingId}
    recordId={viewingId}
    onClose={closeView}
    onEdit={editFromView}
  />
) : null}
```

| Prop | Type | Notes |
| --- | --- | --- |
| `recordId` | `string` | The record's database id. The dialog fetches the record itself and never reads the list row. |
| `onClose` | `() => void` | Close button, scrim, Escape and Android back all call it. |
| `onEdit` | `(record: MasterResidentRecord) => void` | Called with the freshly fetched record. Only shown to roles that may edit. |

Mount the dialog only while it is open and key it by `recordId`: the record
lives in the dialog's state and is dropped when it unmounts.

## Wiring "Edit record"

`useMasterListScreen` already does this. `editFromView` clears `viewingId` and
opens the editor with the record passed to `onEdit`, so the two dialogs never
stack and the editor starts from server data, not a list row that may be
stale. To use the view elsewhere, close the view first, then open your editor
with the record you were given.

The button appears only when `canEditResidentRecord(role)` is true (admins).
That only hides it: every `/admin/master-residents` route is admin-only on the
server, and `backend/tests/integration/masterResidentDetails.test.js` checks
that a doctor gets 403 for both reading and editing.

## States

| State | What shows |
| --- | --- |
| Loading | A skeleton shaped like the loaded view, so nothing jumps. |
| Ready | Identity banner (initials, full name, record ID and role, status pill) and the field grid. |
| Error | "Couldn't load this record", the server's message, and Try again. |
| Not found | The record was deleted or never existed (404). Also shown if another admin deletes it while the view is open. |
| Empty field | "Not recorded" in muted italic text. |
| Status | Active (green) or Inactive (grey). Each pill has a dot and the word, and is announced as "Status: Active". |
| App account | "Linked" or "Not linked". |
| Long names | Wrap in the banner and in each value; nothing overflows. |

While open, the view stays current: another admin's edit replaces the record
in place, a delete switches to Not found, and a reconnect reloads quietly. If a
quiet reload fails, the record on screen stays and a toast says it may be
behind.

## Accessibility

- The dialog is `role="dialog"` with `aria-modal="true"`, labelled by the
  "Resident details" title. Focus is trapped inside; Escape and the scrim close it.
- On close, focus returns to the row's View button. That includes a mouse
  click on the row, which focuses nothing by itself (see `returnFocus.ts`).
- Fields are a real `<dl>`, `<dt>` and `<dd>` on web (`ResidentFieldList.web.tsx`).
  On Android each row is read as one "label, value" item.
- Colours come from the app's theme tokens in light and dark mode; the close
  button and footer buttons are at least 44px.

## Privacy (RA 10173)

Date of birth and civil status are personal data.

- Nothing is logged: error reports carry only the error kind, code and status.
- Nothing is cached: the record is fetched on every open and kept only in
  component state, and the server answers both the record and the list with
  `Cache-Control: no-store`.
- The URL never changes; the record id is only in the API request path.

## Tests

- `npm run test:unit`: `__tests__/residentDetails.test.ts` covers the model
  (the sample resident Efren Romero Abaleta, MSL-1CE7B195), empty fields,
  inactive and linked records, missing names, and the edit permission.
- `npm run test:e2e`: `e2e/residentDetails.e2e.mjs` opens the view from the
  keyboard and from a row click, checks the dialog and field markup, closes it,
  and checks focus returns. It needs a served web build and Chromium:
  `E2E_BASE_URL=http://localhost:8081 CHROME_PATH=chromium npm run test:e2e`.
  It answers every API call itself, so no backend or real data is used.
- Backend: `node tests/integration/masterResidentDetails.test.js`.

## Differences from the Concept 10 mockup

- **No eyebrow line.** "CONCEPT 10 · SPLIT INFORMATION GRID" is a design-review
  label, not something a health worker should read.
- **App colours, not the mockup's hex values.** The view uses the existing
  theme tokens (blue #1557D6 and the app's text and divider colours) so it
  matches the rest of MaslogCare and works in dark mode.
- **Breakpoints follow the app's shared hook** (768 and 1024px) rather than
  600px, which the app does not use.
- **Statuses are Active and Inactive only.** The database has no Deceased or
  Moved state; residents who moved or died are marked inactive.
- **App account shows Linked or Not linked, with no account id.** The server
  does not send the account id, and the view does not need it.
- **Phones get a compact banner** (smaller avatar, no divider) so long names
  keep the width.
