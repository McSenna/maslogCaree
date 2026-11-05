# Baby immunization record modal

A tabbed dialog showing one infant's vaccination schedule, linked to the mother's record.

**Status: visual reference.** It is not connected to the API, no screen uses it, and no route renders the demo. The plan under review for production is `docs/superpowers/specs/2026-11-04-baby-immunization-record-design.md`, which has two tabs rather than these four.

## Use

```tsx
<ImmunizationRecordModal
  open={open}
  record={record}
  initialTab="vaccinations"
  onClose={close}
  onEdit={editRecord}
  onBabyDetails={openBaby}
  onMotherDetails={openMother}
  onMotherRecords={openMotherRecords}
/>
```

| Prop | Type | Notes |
|---|---|---|
| `open` | `boolean` | Content mounts only while open, so tab state resets on each open |
| `record` | `ImmunizationRecord` | See `types.ts`. Components hold no patient data |
| `initialTab` | `RecordTab` | Optional. Defaults to `vaccinations` |
| `onClose` | `() => void` | Close button, X button, Escape, Android back, backdrop |
| `onEdit` | `() => void` | Edit record button |
| `onBabyDetails`, `onMotherDetails`, `onMotherRecords` | `() => void` | The component does no routing |

Progress text and the status pill are calculated in `recordModel.ts`, never typed in. Doses marked `not_scheduled` are not counted.

`mock.ts` holds labelled test data for the demo and tests. Do not import it from a production screen. To review the modal, render `ImmunizationRecordModalDemo` from a temporary route.

## Tokens

This uses the app's tokens rather than adding the brief's values, since `CLAUDE.md` requires asking before adding one. All of them also work in dark mode, which the brief's list did not cover.

| Brief | Used here |
|---|---|
| `--primary` #0B4FF0 | `colors.primary` (#1557D6) |
| `--primary-hover` | `colors.primaryHover` |
| `--primary-soft`, `--tag-bg`, `--tag-text` | `colors.primarySoft`, `colors.primary` |
| `--text`, `--text-2`, `--text-muted` | `colors.heading`, `colors.body`, `colors.muted` |
| `--divider-glyph` | `colors.subtle` |
| `--border`, `--border-strong`, `--chip-border` | `colors.border`, `colors.divider`, `colors.borderStrong` |
| `--surface`, `--surface-subtle`, `--table-head` | `colors.surface`, `colors.tableHeader` |
| `--neutral-chip` | `colors.neutral.bg` |
| `--success-*` | `colors.success` |
| `--scrim` | `colors.overlay` |
| Radius 18, 10, 8, 6 | `RADII.modal` (20), `RADII.medium` (12), `RADII.small` (8) |
| Title 28, name 21, chip title 14 | `TYPE.headline` (24), `TYPE.title` (19), `TYPE.label` (15) |
| Spacing such as 14, 18, 22, 29 | Nearest `SPACING` value |

## Accessibility

- The web `Modal` provides `role="dialog"` and `aria-modal`. The surface is tied to the title with `aria-labelledby`. Focus is trapped, returns to the opener on close, and the page behind cannot scroll.
- Tabs use a roving tabindex with Left, Right, Home and End.
- The schedule uses table, row, column header and row header roles on web. Each dose reads like "MMR, 9 months: Dose 1, requires review".
- Status always has an icon and text as well as colour.
- Links are buttons, because they run callbacks and do not navigate.
- With reduced motion turned on, the modal opens without animation.

## Differences from the brief

| Brief | Here | Why |
|---|---|---|
| Sideways scroll with sticky column at 768 to 1279 | Two-column cards below a 1000px modal | `CLAUDE.md` section 5 bans horizontal scroll. The table starts at about 1048px |
| Tabs scroll sideways on phones | Tabs wrap | Same rule, and no tab is ever hidden |
| Popover for vaccine info | Opens in place | The table clips anything leaving its cell |
| Pending chip has no icon | Adds `alert-circle` | `CLAUDE.md` section 10 requires an icon on every status |
| `<table>` and `<th scope>` | Table roles on `View` | React Native has no table elements |
| Inline SVG icons, `history` icon | Feather icons, `clock` | The app uses Feather, which has no history icon |
| 150ms fade and scale | The app's modal fade, or slide on phones | Built into `Modal` |
