# FlyMenu motion rollout (in parts)

## Part 1 — Done
- Shared motion kit: `src/components/motion/`
- Global scroll progress bar + route transitions (`template.tsx`)
- Shimmer loading skeletons (`loading.tsx` per segment)
- Auth: floating decor, card scale-in, form fade
- Customer `/explore` scroll reveals + hover lift
- Platform dashboard: animated KPIs, glow cards, chart bars

## Part 2 — Done (Platform admin)
- `/platform/approvals`, `/restaurants`, `/customers`, `/revenue`, `/settings`, `/approvals/[id]`
- `FilterTabs`, `ChartBars`, `DonutChart`, `ProgressBarList`, `AnimatedBar`
- Table rows via `Reveal as="tr"`, KPI `AnimatedMetric` + `GlowCard`
- Per-route `loading.tsx` (table / dashboard / default variants)

## Part 3 — Done (Restaurant admin `/admin/*`)
- Fixed sidebar (`AdminSidebar` + `ADMIN_SIDEBAR_WIDTH` 280px)
- Dashboard, orders kanban, menu grid + staff/clients/settings motion
- Tailwind layouts via `admin-ui.ts` (replaces empty `admin.css` classes)
- Per-route `loading.tsx` with sidebar offset

## Part 4 — Done (Marketing)
- `/` — Ken Burns hero, parallax bg, animated dashboard mock, scroll reveals, chart bars, staggered cards
- `/forcustomers` — floating hero plate, orbiting decor rings, infinite food marquee, scroll reveals
- New: `ParallaxLayer`, `Marquee`, `HeroDashboardMock` in `components/marketing/`

## Usage
```tsx
import { Reveal, Stagger, GlowCard, AnimatedMetric, LoadingScreen } from "@/components/motion";
```

Respects `prefers-reduced-motion` globally in `globals.css`.
