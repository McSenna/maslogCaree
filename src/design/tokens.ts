export const UI = {
  screen: {
    maxWidth: 1200,
    gutter: {
      mobile: 16,
      tablet: 24,
      desktop: 48,
    },
  },
  radius: {
    card: "rounded-3xl",
    pill: "rounded-full",
  },
  cardClassName:
    "w-full rounded-3xl bg-white border border-slate-100 shadow-sm shadow-black/5",
  section: {
    titleClassName: "text-lg md:text-xl font-black tracking-tight text-slate-900",
    subtitleClassName: "mt-1 text-sm font-medium text-slate-500 md:text-base",
    eyebrowClassName:
      "text-[11px] font-semibold uppercase tracking-widest text-slate-400",
  },
  chipClassName:
    "rounded-full bg-slate-100 px-2.5 py-1 border border-slate-200/60",
  chipTextClassName:
    "text-[10px] font-bold uppercase tracking-widest text-slate-600",
} as const;

