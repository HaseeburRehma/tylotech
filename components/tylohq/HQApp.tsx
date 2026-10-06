"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Bell,
  Bot,
  Building,
  Building2,
  Calendar,
  ChartLine,
  Check,
  ChevronDown,
  ChevronRight,
  Download,
  FileArchive,
  FileSpreadsheet,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Link2,
  LoaderCircle,
  Lock,
  MessageCircle,
  Palette,
  Send,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useLocale, useT } from "../i18n/LocaleProvider";
import TrendChart, { type ChartSeries } from "./TrendChart";
import {
  CLIENTS,
  DASH,
  DOC_TYPES,
  DOCS,
  INTEGRATIONS,
  KI_TOOLS,
  METRICS,
  MONTH_EN,
  MONTHS,
  PROJECTS,
  RANGE_EN,
  RANGES,
  SOURCES,
  TASKS,
  TEAM,
  axisLabel,
  eur,
  figure,
  niceMax,
  num,
  rangeLabels,
  series,
  type ClientId,
  type IntegrationId,
  type Month,
  type Range,
  type Source,
  type ViewId,
} from "./data";

/* ------------------------------------------------------------------ */
/* navigation                                                          */
/* ------------------------------------------------------------------ */

const NAV: { group: string; en: string; items: { id: ViewId; label: string; en: string; icon: LucideIcon }[] }[] = [
  {
    group: "Arbeitsbereich",
    en: "Workspace",
    items: [
      { id: "dashboard", label: "Dashboard", en: "Dashboard", icon: LayoutDashboard },
      { id: "leistung", label: "Leistung", en: "Performance", icon: ChartLine },
      { id: "integrationen", label: "Integrationen", en: "Integrations", icon: Link2 },
      { id: "ki", label: "KI-Tools", en: "AI tools", icon: Sparkles },
      { id: "austausch", label: "Austausch", en: "Messages", icon: MessageCircle },
      { id: "dokumente", label: "Dokumente", en: "Documents", icon: FileText },
    ],
  },
  {
    group: "TyloTech",
    en: "TyloTech",
    items: [
      { id: "hub", label: "Internal Hub", en: "Internal Hub", icon: Building },
      { id: "kunden", label: "Kunden", en: "Clients", icon: Building2 },
      { id: "team", label: "Team", en: "Team", icon: Users },
      { id: "projekte", label: "Projekte", en: "Projects", icon: FolderKanban },
      { id: "prompts", label: "KI-Prompts", en: "AI prompts", icon: Bot },
    ],
  },
];

const GOLD = "#c08f4b";
const TEAL = "#0e6580";

/* ------------------------------------------------------------------ */
/* small UI atoms                                                      */
/* ------------------------------------------------------------------ */

function Mono({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <p className={cn("font-mono text-[8.2px] font-medium uppercase leading-[11.5px] tracking-[0.57px] text-[#7d7973]", className)}>
      {children}
    </p>
  );
}

function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[13px] border border-[#eeedea] bg-white shadow-[0_1px_2px_rgba(8,34,44,0.06)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function PanelHead({
  title,
  sub,
  action,
  onAction,
}: {
  title: string;
  sub?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-[#eeedea] py-[13px] pl-4 pr-3">
      <div className="min-w-0">
        <p className="truncate font-display text-[12.3px] font-semibold leading-4 tracking-[-0.2px] text-[#1a1917]">{title}</p>
        {sub && <p className="mt-px truncate text-[9.8px] leading-[13px] text-[#7d7973]">{sub}</p>}
      </div>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="ml-auto flex shrink-0 items-center gap-1 rounded-[6.5px] py-[5px] pl-2 pr-1.5 font-display text-[10.2px] font-medium text-[#5c5954] transition-colors hover:bg-[#f6f5f3] hover:text-[#1a1917]"
        >
          {action}
          <ChevronRight className="size-[11px]" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

function Delta({ value, down }: { value: string; down?: boolean }) {
  const Icon = down ? ArrowDown : ArrowUpRight;
  return (
    <span className="inline-flex items-center gap-[2.5px] rounded-[5px] bg-[rgba(14,101,128,0.09)] py-[1.6px] pl-[5px] pr-[6.5px] font-mono text-[9px] font-medium leading-[11.5px] text-[#0b5568]">
      <Icon className="size-[9px]" strokeWidth={2.4} />
      {value}
    </span>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 whitespace-nowrap rounded-full border px-2.5 py-[4px] text-[10.3px] font-medium transition-colors duration-200",
        active
          ? "border-[#e3c79e] bg-[#fbf3e4] text-[#94713f]"
          : "border-[#e2e0dc] bg-white text-[#5c5954] hover:border-[#cbc8c2] hover:text-[#1a1917]",
      )}
    >
      {children}
    </button>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  label?: (v: T) => string;
}) {
  return (
    <div className="inline-flex shrink-0 items-center gap-0.5 rounded-[9px] border border-[#e2e0dc] bg-[#f6f5f3] p-[3px]">
      {options.map((o) => (
        <button
          type="button"
          key={o}
          onClick={() => onChange(o)}
          className={cn(
            "rounded-[6.5px] px-2 py-[3px] text-[10.3px] font-medium transition-colors duration-200",
            value === o ? "bg-[#c79a53] text-white shadow-[0_1px_2px_rgba(107,79,38,0.3)]" : "text-[#5c5954] hover:text-[#1a1917]",
          )}
        >
          {label ? label(o) : o}
        </button>
      ))}
    </div>
  );
}

function GoldButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[8px] bg-gradient-to-b from-[#e4c79a] to-[#c39a5c] px-3 py-2 font-display text-[10.7px] font-semibold leading-[14.75px] tracking-[-0.08px] text-[#0f0e0d] shadow-[0_1px_2.5px_rgba(107,79,38,0.2),inset_0_1px_0_rgba(255,255,255,0.5)] transition-[filter,translate] duration-200 hover:brightness-105 active:translate-y-px"
    >
      {children}
    </button>
  );
}

function ViewHeader({
  title,
  sub,
  children,
}: {
  title: string;
  sub: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-[#eeedea] bg-white px-4 py-[15px] @[560px]:px-[26px]">
      <div className="min-w-[min(100%,230px)] flex-1">
        <p className="truncate font-display text-[17.2px] font-semibold leading-[21px] tracking-[-0.41px] text-[#1a1917]">
          {title}
        </p>
        <p className="mt-[2.5px] truncate text-[10.65px] leading-[14.75px] text-[#7d7973]">{sub}</p>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

function useFlash(ms = 1800) {
  const [on, setOn] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  return [
    on,
    () => {
      setOn(true);
      clearTimeout(t.current);
      t.current = setTimeout(() => setOn(false), ms);
    },
  ] as const;
}

/* ------------------------------------------------------------------ */
/* app shell                                                           */
/* ------------------------------------------------------------------ */

export default function HQApp({ live }: { live: boolean }) {
  const [view, setView] = useState<ViewId>("dashboard");
  const [client, setClient] = useState<ClientId>("fixdone");
  const [clientMenu, setClientMenu] = useState(false);
  const [connected, setConnected] = useState<Record<IntegrationId, boolean>>({
    meta: false,
    gads: false,
    ga4: false,
    sc: true,
    tiktok: false,
    linkedin: false,
  });
  const scroller = useRef<HTMLDivElement>(null);
  const t = useT();

  const go = (v: ViewId) => {
    setView(v);
    scroller.current?.scrollTo({ top: 0 });
  };
  const c = CLIENTS.find((x) => x.id === client)!;

  return (
    <div className={cn("hq-app @container", live && "hq-live")}>
      <div className="flex h-[560px] overflow-hidden rounded-[16px] border border-[#e2e0dc] bg-[#f6f5f3] text-left shadow-[0_50px_100px_-50px_rgba(8,34,44,0.45),0_20px_40px_-30px_rgba(8,34,44,0.25)] @[760px]:h-[498px]">
        {/* ---- sidebar (desktop) ---- */}
        <aside
          data-lenis-prevent
          className="hq-noscrollbar hidden w-[203px] shrink-0 flex-col overflow-y-auto border-r border-[#eeedea] bg-white px-[13px] pb-[13px] pt-4 @[760px]:flex"
        >
          <div className="flex items-center pb-[15px] pl-[5px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/tylotech-logo.svg" alt="TyloTech" className="h-[27px] w-auto" />
            <span className="ml-auto flex items-center gap-0.5 text-[#5c5954]">
              <button type="button" aria-label={t("Markenvorschau", "Brand preview")} className="grid size-[25px] place-items-center rounded-md hover:bg-[#f6f5f3]">
                <Palette className="size-[13px]" strokeWidth={1.8} />
              </button>
              <button type="button" aria-label={t("Benachrichtigungen", "Notifications")} className="relative grid size-[25px] place-items-center rounded-md hover:bg-[#f6f5f3]">
                <Bell className="size-[13px]" strokeWidth={1.8} />
                <span className="absolute right-[5px] top-[5px] size-[5px] rounded-full bg-[#b4502f]" />
              </button>
            </span>
          </div>

          {/* client context switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setClientMenu((o) => !o)}
              className="flex w-full items-center gap-2 rounded-[11px] border border-[#eeedea] bg-[#f6f5f3] py-[6.5px] pl-[6.5px] pr-2 text-left transition-colors hover:border-[#e2e0dc]"
            >
              <span className="grid size-[21px] shrink-0 place-items-center rounded-[7px] bg-gradient-to-b from-[#17485b] to-[#04161d] font-display text-[9px] font-semibold tracking-[0.2px] text-[#e3c79e]">
                {c.init}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-[7.8px] font-medium leading-[10px] tracking-[0.5px] text-[#7d7973]">{t("KUNDE", "CLIENT")}</span>
                <span className="block truncate font-display text-[11.5px] font-medium leading-[15.5px] tracking-[-0.2px] text-[#1a1917]">
                  {c.name}
                </span>
              </span>
              <ChevronDown className={cn("size-3 text-[#7d7973] transition-transform", clientMenu && "rotate-180")} />
            </button>
            {clientMenu && (
              <div className="absolute inset-x-0 top-[calc(100%+4px)] z-30 overflow-hidden rounded-[10px] border border-[#e2e0dc] bg-white py-1 shadow-[0_16px_30px_-12px_rgba(8,34,44,0.3)] animate-[hqfade_.2s_ease]">
                {CLIENTS.map((x) => (
                  <button
                    type="button"
                    key={x.id}
                    onClick={() => {
                      setClient(x.id);
                      setClientMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-[10.5px] text-[#1a1917] hover:bg-[#f6f5f3]"
                  >
                    <span className="grid size-[18px] place-items-center rounded-[5px] bg-[#12313d] font-display text-[7.5px] font-semibold text-[#e3c79e]">
                      {x.init}
                    </span>
                    <span className="flex-1 truncate">{x.name}</span>
                    {x.id === client && <Check className="size-3 text-[#c08f4b]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {NAV.map((g) => (
            <nav key={g.group} className="flex flex-col gap-[1.6px] pt-[18px]">
              <p className="pb-[5px] font-display text-[9.4px] font-medium leading-[13px] tracking-[0.1px] text-[#7d7973]">{t(g.group, g.en)}</p>
              {g.items.map((it) => {
                const on = view === it.id;
                const Icon = it.icon;
                return (
                  <button
                    type="button"
                    key={it.id}
                    onClick={() => go(it.id)}
                    className={cn(
                      "group/nav relative flex h-[33px] w-full items-center gap-[9px] rounded-[10px] px-[10px] text-left transition-colors duration-200",
                      on ? "bg-[#fbf6ee]" : "hover:bg-[#f6f5f3]",
                    )}
                  >
                    <Icon
                      className={cn("size-[14.75px] shrink-0 transition-colors", on ? "text-[#1a1917]" : "text-[#5c5954] group-hover/nav:text-[#1a1917]")}
                      strokeWidth={1.7}
                    />
                    <span
                      className={cn(
                        "font-display text-[11.9px] font-medium leading-4 tracking-[-0.2px] transition-colors",
                        on ? "text-[#1a1917]" : "text-[#5c5954] group-hover/nav:text-[#1a1917]",
                      )}
                    >
                      {t(it.label, it.en)}
                    </span>
                    {(it.id === "hub" || it.id === "prompts") && <Lock className="ml-auto size-[10px] text-[#b3aea6]" />}
                    {it.id === "austausch" && (
                      <span className="ml-auto grid h-[15px] min-w-[15px] place-items-center rounded-full bg-[#c79a53] px-1 font-mono text-[8px] font-medium text-white">
                        2
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          ))}

          <div className="mt-auto pt-4">
            <div className="flex items-center gap-2 rounded-[11px] border border-[#eeedea] py-[7px] pl-[6.5px] pr-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/team/ilias-el-aradi.jpg" alt="" className="size-[23px] rounded-full object-cover" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-[11px] font-medium leading-[14.75px] text-[#1a1917]">Ilias El Aradi</span>
                <span className="block text-[9.4px] leading-3 text-[#7d7973]">Super Admin</span>
              </span>
            </div>
          </div>
        </aside>

        {/* ---- content ---- */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* compact tab bar for narrow containers */}
          <div className="flex shrink-0 flex-col gap-2 border-b border-[#eeedea] bg-white px-3 pb-2 pt-3 @[760px]:hidden">
            <div className="flex items-center justify-between">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/tylotech-logo.svg" alt="TyloTech" className="h-[22px] w-auto" />
              <select
                aria-label={t("Kunde", "Client")}
                value={client}
                onChange={(e) => setClient(e.target.value as ClientId)}
                className="max-w-[150px] truncate rounded-[8px] border border-[#eeedea] bg-[#f6f5f3] px-2 py-1 text-[11px] font-medium text-[#1a1917] outline-none"
              >
                {CLIENTS.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name}
                  </option>
                ))}
              </select>
            </div>
            <div data-lenis-prevent className="hq-noscrollbar -mx-3 flex gap-1 overflow-x-auto px-3">
              {NAV.flatMap((g) => g.items).map((it) => {
                const Icon = it.icon;
                const on = view === it.id;
                return (
                  <button
                    type="button"
                    key={it.id}
                    onClick={() => go(it.id)}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-medium transition-colors",
                      on ? "border-[#e3c79e] bg-[#fbf6ee] text-[#1a1917]" : "border-transparent text-[#5c5954]",
                    )}
                  >
                    <Icon className="size-3.5" strokeWidth={1.8} />
                    {t(it.label, it.en)}
                  </button>
                );
              })}
            </div>
          </div>

          <div ref={scroller} data-lenis-prevent className="hq-noscrollbar min-h-0 flex-1 overflow-y-auto">
            <div key={view} className="animate-[hqview_.45s_cubic-bezier(.22,1,.36,1)_both]">
              {view === "dashboard" && <DashboardView connected={connected} setConnected={setConnected} go={go} />}
              {view === "leistung" && <LeistungView client={client} setClient={setClient} />}
              {view === "integrationen" && <IntegrationenView connected={connected} setConnected={setConnected} />}
              {view === "ki" && <KIView clientName={c.name} />}
              {view === "austausch" && <AustauschView />}
              {view === "dokumente" && <DokumenteView />}
              {view === "kunden" && (
                <KundenView
                  onOpen={(id) => {
                    setClient(id);
                    go("leistung");
                  }}
                />
              )}
              {view === "team" && <TeamView />}
              {view === "projekte" && <ProjekteView />}
              {(view === "hub" || view === "prompts") && <LockedView title={view === "hub" ? "Internal Hub" : t("KI-Prompts", "AI prompts")} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard (Figma "HQ · Dashboard")                                  */
/* ------------------------------------------------------------------ */

type KpiKey = "budget" | "leads" | "cpl" | "kunden";

function useConnect(setConnected: React.Dispatch<React.SetStateAction<Record<IntegrationId, boolean>>>) {
  const [pending, setPending] = useState<IntegrationId | null>(null);
  const connect = (id: IntegrationId, value = true) => {
    setPending(id);
    setTimeout(() => {
      setConnected((s) => ({ ...s, [id]: value }));
      setPending(null);
    }, 900);
  };
  return { pending, connect };
}

function DashboardView({
  connected,
  setConnected,
  go,
}: {
  connected: Record<IntegrationId, boolean>;
  setConnected: React.Dispatch<React.SetStateAction<Record<IntegrationId, boolean>>>;
  go: (v: ViewId) => void;
}) {
  const [month, setMonth] = useState<Month>("September 2026");
  const [menu, setMenu] = useState(false);
  const [kpi, setKpi] = useState<KpiKey>("budget");
  const [hidden, setHidden] = useState<string[]>([]);
  const [shared, flashShared] = useFlash();
  const [tasks, setTasks] = useState(TASKS);
  const { pending, connect } = useConnect(setConnected);
  const locale = useLocale();
  const t = useT();
  const monthLabel = (m: Month) => t(m, MONTH_EN[m]);

  const d = DASH[month];
  const cpl = d.budget.map((b, i) => b / Math.max(0.6, d.leads[i]));

  const chart: ChartSeries[] = useMemo(() => {
    const budget: ChartSeries = { key: "budget", label: t("Werbebudget", "Ad spend"), color: GOLD, values: d.budget, max: 1600, format: (v) => eur(locale, v) };
    const leads: ChartSeries = { key: "leads", label: "Leads", color: TEAL, values: d.leads, max: 70, format: (v) => num(locale, v) };
    if (kpi === "budget") return [{ ...budget, area: true }, leads];
    if (kpi === "leads") return [{ ...leads, area: true }, budget];
    if (kpi === "cpl")
      return [{ key: "cpl", label: t("Kosten je Lead", "Cost per lead"), color: GOLD, values: cpl, area: true, format: (v) => eur(locale, v, 2) }];
    return [{ key: "kunden", label: t("Aktive Kunden", "Active clients"), color: TEAL, values: d.kunden, area: true, max: 12, format: (v) => num(locale, v) }];
  }, [kpi, d, cpl, locale, t]);

  const missing = (["meta", "gads", "ga4"] as IntegrationId[]).filter((id) => !connected[id]);
  const open = tasks.filter((task) => !task.done).length;

  const KPIS: { key: KpiKey; label: string; dot: string }[] = [
    { key: "budget", label: t("Werbebudget verwaltet", "Ad spend managed"), dot: GOLD },
    { key: "leads", label: t("Leads generiert", "Leads generated"), dot: TEAL },
    { key: "cpl", label: t("Kosten je Lead", "Cost per lead"), dot: "#a8a49d" },
    { key: "kunden", label: t("Aktive Kunden", "Active clients"), dot: "#a8a49d" },
  ];

  return (
    <>
      <ViewHeader
        title={t("Willkommen zurück, Ilias", "Welcome back, Ilias")}
        sub={t(`Dein Überblick über alle Kunden · ${month}`, `Your overview of all clients · ${monthLabel(month)}`)}
      >
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenu((m) => !m)}
            className="flex items-center gap-[6.5px] rounded-[8px] border border-[#e2e0dc] bg-white py-[7px] pl-[10.6px] pr-[9px] font-display text-[10.65px] font-medium text-[#5c5954] transition-colors hover:border-[#cbc8c2] hover:text-[#1a1917]"
          >
            <Calendar className="size-3" strokeWidth={1.8} />
            {monthLabel(month)}
            <ChevronDown className={cn("size-[11px] transition-transform", menu && "rotate-180")} />
          </button>
          {menu && (
            <div className="absolute right-0 top-[calc(100%+4px)] z-30 w-full min-w-[140px] overflow-hidden rounded-[10px] border border-[#e2e0dc] bg-white py-1 shadow-[0_16px_30px_-12px_rgba(8,34,44,0.3)] animate-[hqfade_.2s_ease]">
              {MONTHS.map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => {
                    setMonth(m);
                    setMenu(false);
                  }}
                  className="flex w-full items-center justify-between px-2.5 py-1.5 text-left text-[10.6px] text-[#1a1917] hover:bg-[#f6f5f3]"
                >
                  {monthLabel(m)}
                  {m === month && <Check className="size-3 text-[#c08f4b]" />}
                </button>
              ))}
            </div>
          )}
        </div>
        <GoldButton onClick={flashShared}>
          {shared ? (
            <>
              <Check className="size-3" strokeWidth={2.4} /> {t("Link kopiert", "Link copied")}
            </>
          ) : (
            t("Bericht teilen", "Share report")
          )}
        </GoldButton>
      </ViewHeader>

      <div className="flex flex-col gap-[13px] px-3 pb-[26px] pt-[19px] @[560px]:px-[26px]">
        <Panel>
          <div className="grid grid-cols-2 border-b border-[#eeedea] @[640px]:grid-cols-4">
            {KPIS.map((k, i) => {
              const v = d.kpi[k.key];
              const on = kpi === k.key;
              return (
                <button
                  type="button"
                  key={k.key}
                  onClick={() => {
                    setKpi(k.key);
                    setHidden([]);
                  }}
                  className={cn(
                    "group/kpi relative flex flex-col items-start gap-[5.7px] px-4 py-[15.5px] text-left transition-colors duration-200 @[640px]:px-[19.7px]",
                    i % 2 === 1 && "border-l border-[#eeedea]",
                    i >= 2 && "border-t border-[#eeedea] @[640px]:border-t-0",
                    i === 2 && "@[640px]:border-l",
                    on ? "bg-[#f6f5f3]" : "bg-white hover:bg-[#fbfaf9]",
                  )}
                >
                  <span className={cn("absolute inset-x-0 bottom-0 h-[2px] origin-left bg-[#c79a53] transition-transform duration-300", on ? "scale-x-100" : "scale-x-0")} />
                  <span className="flex items-center gap-[5.7px]">
                    <span className="size-[5px] rounded-full" style={{ background: k.dot }} />
                    <Mono>{k.label}</Mono>
                  </span>
                  <span key={month + k.key} className="animate-[hqfade_.4s_ease_both] font-display text-[22px] font-semibold leading-[26px] tracking-[-0.74px] text-[#1a1917]">
                    {figure(locale, v.value)}
                  </span>
                  <span className="flex flex-wrap items-center gap-[5.7px]">
                    <Delta value={figure(locale, v.delta)} down={v.down} />
                    <span className="text-[9.4px] leading-3 text-[#7d7973]">{t("vs. Vormonat", "vs. last month")}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative">
            <div className="absolute left-[23px] top-[5px] z-10 flex items-center gap-[14.75px]">
              {chart.map((s) => {
                const off = hidden.includes(s.key);
                return (
                  <button
                    type="button"
                    key={s.key}
                    onClick={() =>
                      chart.length > 1 &&
                      setHidden((h) => (h.includes(s.key) ? [] : [s.key]))
                    }
                    className={cn("flex items-center gap-[5.7px] text-[9.8px] leading-[13px] text-[#5c5954] transition-opacity", off && "opacity-40")}
                  >
                    <span className="h-[1.6px] w-[11.5px] rounded-full" style={{ background: s.color }} />
                    {s.label}
                  </button>
                );
              })}
            </div>
            <TrendChart series={chart.map((s) => ({ ...s, hidden: hidden.includes(s.key) }))} labels={d.labels.map((l) => axisLabel(locale, l))} />
          </div>
        </Panel>

        <div className="grid grid-cols-1 gap-[13px] @[900px]:grid-cols-2">
          <Panel>
            <PanelHead
              title={missing.length ? t("Integrationen brauchen Aufmerksamkeit", "Integrations need attention") : t("Alle Quellen verbunden", "All sources connected")}
              sub={
                missing.length
                  ? t(
                      `Search Console läuft. ${["", "Eine Quelle fehlt", "Zwei Quellen fehlen", "Drei Quellen fehlen"][missing.length]} noch.`,
                      `Search Console is live. ${["", "One source", "Two sources", "Three sources"][missing.length]} still missing.`,
                    )
                  : t("Meta, Google Ads, GA4 und Search Console liefern Daten.", "Meta, Google Ads, GA4 and Search Console are sending data.")
              }
              action={t("Zu den Integrationen", "Go to integrations")}
              onAction={() => go("integrationen")}
            />
            {(["meta", "gads", "ga4"] as IntegrationId[]).map((id, i) => {
              const it = INTEGRATIONS.find((x) => x.id === id)!;
              const ok = connected[id];
              return (
                <div
                  key={id}
                  className={cn("flex items-start gap-[10.6px] px-4 py-[13px] transition-colors hover:bg-[#fbfaf9]", i > 0 && "border-t border-[#eeedea]")}
                >
                  <span
                    className={cn("h-[34px] w-[2.5px] shrink-0 rounded-[1.6px] transition-colors duration-500", ok ? "bg-[#2f8a5f]" : id === "ga4" ? "bg-[#c08f4b]" : "bg-[#b4502f]")}
                  />
                  <div className="min-w-0 flex-1">
                    <p className={cn("font-mono text-[7.8px] font-medium uppercase leading-[10.6px] tracking-[0.5px]", ok ? "text-[#2f8a5f]" : id === "ga4" ? "text-[#c08f4b]" : "text-[#b4502f]")}>
                      {it.name}
                    </p>
                    <p className="mt-1 font-display text-[11.5px] font-semibold leading-[15.5px] tracking-[-0.16px] text-[#1a1917]">
                      {ok ? t("Verbunden · Daten fließen", "Connected · data flowing") : t("Nicht verbunden", "Not connected")}
                    </p>
                    <p className="mt-1 text-[10.2px] leading-[14.75px] text-[#5c5954]">{t(it.hint, it.en)}</p>
                  </div>
                  <button
                    type="button"
                    disabled={ok || pending === id}
                    onClick={() => connect(id)}
                    className={cn(
                      "flex shrink-0 items-center gap-1 rounded-[7.4px] border px-[9.8px] py-[5.7px] font-display text-[10.2px] font-medium transition-colors",
                      ok
                        ? "border-[#cfe8db] bg-[#e7f4ed] text-[#0e5836]"
                        : "border-[#eeedea] bg-[#f6f5f3] text-[#1a1917] hover:border-[#d1aa71] hover:bg-[#fbf6ee]",
                    )}
                  >
                    {pending === id ? (
                      <LoaderCircle className="size-3 animate-spin" />
                    ) : ok ? (
                      <>
                        <Check className="size-3" strokeWidth={2.4} /> {t("Aktiv", "Active")}
                      </>
                    ) : (
                      t("Verbinden", "Connect")
                    )}
                  </button>
                </div>
              );
            })}
          </Panel>

          <Panel>
            <PanelHead
              title={t("Meine zugewiesene Arbeit", "My assigned work")}
              sub={
                tasks.find((task) => task.blocker && !task.done)
                  ? t(`${open} offen · 1 blockiert die Datenerfassung`, `${open} open · 1 blocking data collection`)
                  : t(`${open} offen`, `${open} open`)
              }
              action={t("Alle Projekte", "All projects")}
              onAction={() => go("projekte")}
            />
            {tasks.map((task, i) => (
              <button
                type="button"
                key={task.id}
                onClick={() => setTasks((ts) => ts.map((x) => (x.id === task.id ? { ...x, done: !x.done } : x)))}
                className={cn("flex w-full items-center gap-[9.8px] px-4 py-[12.3px] text-left transition-colors hover:bg-[#fbfaf9]", i > 0 && "border-t border-[#eeedea]")}
              >
                <span
                  className={cn(
                    "grid size-[14.75px] shrink-0 place-items-center rounded-[5px] border transition-colors duration-200",
                    task.done ? "border-[#c08f4b] bg-[#c08f4b]" : "border-[#cbc8c2] bg-white",
                  )}
                >
                  {task.done && <Check className="size-[9px] text-white" strokeWidth={3} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block truncate font-display text-[11px] font-medium leading-[15.5px] tracking-[-0.16px] transition-colors",
                      task.done ? "text-[#7d7973] line-through" : "text-[#1a1917]",
                    )}
                  >
                    {t(task.title, task.en.title)}
                  </span>
                  <span className="mt-[2.5px] flex items-center gap-[6.5px]">
                    <span className="text-[9.4px] leading-[13px] text-[#7d7973]">{t(task.meta, task.en.meta)}</span>
                    {task.blocker && !task.done && (
                      <span className="rounded-[5px] bg-[rgba(180,80,47,0.1)] px-[5.7px] py-[1.6px] font-mono text-[7.8px] font-medium leading-[10.6px] tracking-[0.33px] text-[#9b4226]">
                        {t("Blockiert Daten", "Blocking data")}
                      </span>
                    )}
                  </span>
                </span>
                <span className="shrink-0 text-[9.4px] text-[#7d7973]">{task.done ? t("erledigt", "done") : t(task.due, task.en.due)}</span>
              </button>
            ))}
          </Panel>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Leistung (performance)                                              */
/* ------------------------------------------------------------------ */

function LeistungView({ client, setClient }: { client: ClientId; setClient: (c: ClientId) => void }) {
  const [range, setRange] = useState<Range>("30 T");
  const [source, setSource] = useState<Source>("sc");
  const [metric, setMetric] = useState<string>("klicks");
  const [exporting, setExporting] = useState<"idle" | "busy" | "done">("idle");
  const locale = useLocale();
  const t = useT();

  const defs = METRICS[source];
  const labels = rangeLabels(range, locale);
  const n = labels.length;
  const bucket = range === "90 T" ? 2 : range === "Jahr" ? 30 : 1;
  const days = range === "7 T" ? 7 : range === "30 T" ? 30 : range === "90 T" ? 90 : 365;
  // narrow spread so every client lands at roughly 500–600 leads a month
  const clientBoost = 0.92 + (CLIENTS.findIndex((x) => x.id === client) % 4) * 0.05;

  const data = useMemo(
    () =>
      defs.map((m) => {
        const vals = series(`${client}-${source}-${m.key}-${range}`, n, m.base * (m.avg ? 1 : bucket * clientBoost));
        const prev = series(`${client}-${source}-${m.key}-${range}-prev`, n, m.base * (m.avg ? 1 : bucket * clientBoost), 0.05);
        const total = m.avg ? vals.reduce((a, b) => a + b, 0) / n : vals.reduce((a, b) => a + b, 0);
        const ptotal = m.avg ? prev.reduce((a, b) => a + b, 0) / n : prev.reduce((a, b) => a + b, 0);
        const delta = ((total - ptotal) / ptotal) * 100;
        return { m, vals, total, delta };
      }),
    [defs, client, source, range, n, bucket, clientBoost],
  );

  const chartable = data.filter((x) => x.m.chart);
  const active = chartable.find((x) => x.m.key === metric) ?? chartable[0];
  const max = niceMax(Math.max(...active.vals) * 1.05);
  const de = (v: number, digits = 0) => num(locale, v, digits);
  const fmt = (v: number, unit?: string, digits = 0) => (unit === "€" ? eur(locale, v, digits) : `${de(v, digits)}${unit ? ` ${unit}` : ""}`);
  const pct = (v: number) => t(`${de(v, 1)} %`, `${de(v, 1)}%`);
  const src = SOURCES.find((s) => s.id === source)!;
  const srcLabel = t(src.label, src.en);

  return (
    <>
      <ViewHeader
        title={t("Leistung", "Performance")}
        sub={t("Kanalübergreifende Ergebnisse für Meta Ads, Google Ads & SEO.", "Cross-channel results for Meta Ads, Google Ads & SEO.")}
      >
        <Segmented options={RANGES} value={range} onChange={setRange} label={(o) => t(o, RANGE_EN[o])} />
        <button
          type="button"
          onClick={() => {
            if (exporting !== "idle") return;
            setExporting("busy");
            setTimeout(() => setExporting("done"), 1100);
            setTimeout(() => setExporting("idle"), 2800);
          }}
          className="flex shrink-0 items-center gap-1.5 rounded-[8px] border border-[#e2e0dc] bg-white px-2.5 py-[6px] font-display text-[10.6px] font-medium text-[#1a1917] transition-colors hover:border-[#cbc8c2]"
        >
          {exporting === "busy" ? (
            <LoaderCircle className="size-3 animate-spin" />
          ) : exporting === "done" ? (
            <Check className="size-3 text-[#2f8a5f]" strokeWidth={2.4} />
          ) : (
            <Download className="size-3" strokeWidth={1.9} />
          )}
          {exporting === "done" ? t("Exportiert", "Exported") : t("PDF exportieren", "Export PDF")}
        </button>
      </ViewHeader>

      <div className="flex flex-col gap-3 px-3 pb-6 pt-4 @[560px]:px-[26px]">
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-[10.3px] text-[#7d7973]">{t("Ansicht:", "View:")}</span>
          <div data-lenis-prevent className="hq-noscrollbar flex gap-1.5 overflow-x-auto">
            {CLIENTS.map((x) => (
              <Chip key={x.id} active={client === x.id} onClick={() => setClient(x.id)}>
                {x.name}
              </Chip>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-[10.3px] text-[#7d7973]">{t("Quelle:", "Source:")}</span>
          <div data-lenis-prevent className="hq-noscrollbar flex gap-1.5 overflow-x-auto">
            {SOURCES.map((s) => (
              <Chip
                key={s.id}
                active={source === s.id}
                onClick={() => {
                  setSource(s.id);
                  setMetric(METRICS[s.id][0].key);
                }}
              >
                {t(s.label, s.en)}
              </Chip>
            ))}
          </div>
        </div>

        <div className="mt-1 grid grid-cols-1 gap-2.5 @[480px]:grid-cols-3">
          {data.map(({ m, total, delta }) => {
            const on = m.chart && active.m.key === m.key;
            const up = m.key === "pos" ? delta < 0 : delta >= 0;
            return (
              <button
                type="button"
                key={m.key}
                disabled={!m.chart}
                onClick={() => setMetric(m.key)}
                className={cn(
                  "group/card rounded-[12px] border bg-white px-3.5 py-3 text-left transition-[border-color,box-shadow,translate] duration-200",
                  on
                    ? "border-[#e3c79e] shadow-[0_0_0_3px_rgba(209,170,113,0.15)]"
                    : "border-[#e2e0dc] enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_10px_22px_-14px_rgba(8,34,44,0.3)]",
                )}
              >
                <span className="flex items-center justify-between">
                  <span className="text-[10.3px] text-[#5c5954]">{t(m.label, m.en)}</span>
                  {m.key !== "pos" && (
                    <span className={cn("flex items-center gap-0.5 text-[10px] font-semibold", up ? "text-[#2f8a5f]" : "text-[#b4502f]")}>
                      {up ? <ArrowUpRight className="size-3" strokeWidth={2.2} /> : <ArrowDown className="size-3" strokeWidth={2.2} />}
                      {delta >= 0 ? "+" : ""}
                      {de(delta, 1)}%
                    </span>
                  )}
                </span>
                <span key={`${client}${source}${range}`} className="mt-1 block animate-[hqfade_.4s_ease_both] font-display text-[19px] font-semibold leading-6 tracking-[-0.5px] text-[#1a1917]">
                  {m.key === "pos" ? de(total, 1) : m.unit === "%" ? pct(total) : fmt(total, m.unit)}
                </span>
                <span className="mt-0.5 block text-[9.4px] text-[#7d7973]">
                  {srcLabel} · {m.avg ? t(`Ø ${days} T`, `avg. ${days} days`) : t(`${days} T`, `${days} days`)}
                </span>
              </button>
            );
          })}
        </div>

        <Panel className="mt-1">
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-3.5">
            <div>
              <p className="font-display text-[12.3px] font-semibold text-[#1a1917]">Trend</p>
              <p className="text-[9.8px] text-[#7d7973]">
                {range === "Jahr"
                  ? t("12 Monate · pro Monat", "12 months · monthly")
                  : t(`${days} T · ${bucket === 2 ? "alle 2 Tage" : "pro Tag"}`, `${days} days · ${bucket === 2 ? "every 2 days" : "daily"}`)}
              </p>
            </div>
            <Segmented
              options={chartable.map((x) => x.m.key)}
              value={active.m.key}
              onChange={setMetric}
              label={(k) => {
                const m = chartable.find((x) => x.m.key === k)!.m;
                return t(m.label, m.en);
              }}
            />
          </div>
          <TrendChart
            height={220}
            labelEvery={n > 20 ? Math.ceil(n / 8) : 1}
            yTicks={[max, max * 0.75, max * 0.5, max * 0.25, 0].map((v) => (v >= 10000 ? `${de(v / 1000)}k` : de(v)))}
            showEndMarker
            series={[
              {
                key: active.m.key,
                label: t(active.m.label, active.m.en),
                color: TEAL,
                values: active.vals,
                area: true,
                max,
                format: (v) => (active.m.unit === "€" ? eur(locale, v) : v < 10 ? de(v, 1) : de(v)),
              },
            ]}
            labels={labels}
          />
        </Panel>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Integrationen                                                       */
/* ------------------------------------------------------------------ */

function IntegrationenView({
  connected,
  setConnected,
}: {
  connected: Record<IntegrationId, boolean>;
  setConnected: React.Dispatch<React.SetStateAction<Record<IntegrationId, boolean>>>;
}) {
  const { pending, connect } = useConnect(setConnected);
  const t = useT();
  const count = Object.values(connected).filter(Boolean).length;
  return (
    <>
      <ViewHeader
        title={t("Integrationen", "Integrations")}
        sub={t("Verbinde deine Datenquellen – den Rest übernehmen wir.", "Connect your data sources – we'll handle the rest.")}
      />
      <div className="px-3 pb-6 pt-4 @[560px]:px-[26px]">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#eeedea]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#e4c79a] to-[#c39a5c] transition-[width] duration-700 ease-out"
              style={{ width: `${(count / INTEGRATIONS.length) * 100}%` }}
            />
          </div>
          <span className="shrink-0 font-mono text-[9.5px] text-[#5c5954]">
            {count} / {INTEGRATIONS.length} {t("verbunden", "connected")}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-2.5 @[520px]:grid-cols-2 @[880px]:grid-cols-3">
          {INTEGRATIONS.map((it) => {
            const ok = connected[it.id];
            return (
              <div
                key={it.id}
                className={cn(
                  "group/int flex flex-col gap-3 rounded-[12px] border bg-white p-3.5 transition-[border-color,box-shadow,translate] duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-16px_rgba(8,34,44,0.35)]",
                  ok ? "border-[#cfe8db]" : "border-[#e2e0dc]",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className="grid size-9 place-items-center rounded-[10px] border border-[#eeedea] bg-[#f6f5f3]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.logo} alt="" className="size-[18px] object-contain" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[12px] font-semibold text-[#1a1917]">{it.name}</p>
                    <p className={cn("flex items-center gap-1 text-[9.6px]", ok ? "text-[#2f8a5f]" : "text-[#7d7973]")}>
                      <span className={cn("size-1.5 rounded-full", ok ? "bg-[#2f8a5f]" : "bg-[#cbc8c2]")} />
                      {ok ? t("Verbunden · Sync vor 4 Min.", "Connected · synced 4 min ago") : t("Nicht verbunden", "Not connected")}
                    </p>
                  </div>
                </div>
                <p className="text-[10.2px] leading-[14.5px] text-[#5c5954]">{t(it.hint, it.en)}</p>
                <button
                  type="button"
                  disabled={pending === it.id}
                  onClick={() => connect(it.id, !ok)}
                  className={cn(
                    "mt-auto flex h-7 items-center justify-center gap-1.5 rounded-[8px] border font-display text-[10.5px] font-medium transition-colors",
                    ok
                      ? "border-[#e2e0dc] bg-white text-[#5c5954] hover:border-[#e6c2b5] hover:text-[#b4502f]"
                      : "border-transparent bg-[#1a1917] text-white hover:bg-[#2b2925]",
                  )}
                >
                  {pending === it.id ? <LoaderCircle className="size-3 animate-spin" /> : ok ? t("Trennen", "Disconnect") : t("Verbinden", "Connect")}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* KI-Tools                                                            */
/* ------------------------------------------------------------------ */

function KIView({ clientName }: { clientName: string }) {
  const [tool, setTool] = useState(KI_TOOLS[0].id);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);
  useEffect(() => () => clearInterval(timer.current), []);
  const t = useT();

  const run = () => {
    const k = KI_TOOLS.find((x) => x.id === tool)!;
    const full = t(k.out, k.en.out)(clientName);
    clearInterval(timer.current);
    setBusy(true);
    setText("");
    let i = 0;
    timer.current = setInterval(() => {
      i += 3;
      setText(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(timer.current);
        setBusy(false);
      }
    }, 18);
  };

  return (
    <>
      <ViewHeader
        title={t("KI-Tools", "AI tools")}
        sub={t(`Markengerechte Texte in deiner Tonalität · ${clientName}`, `On-brand copy in your tone of voice · ${clientName}`)}
      />
      <div className="grid grid-cols-1 gap-3 px-3 pb-6 pt-4 @[640px]:grid-cols-[minmax(0,220px)_minmax(0,1fr)] @[560px]:px-[26px]">
        <div className="grid grid-cols-2 gap-2 @[640px]:grid-cols-1">
          {KI_TOOLS.map((k) => (
            <button
              type="button"
              key={k.id}
              onClick={() => {
                setTool(k.id);
                setText("");
              }}
              className={cn(
                "rounded-[11px] border px-3 py-2.5 text-left transition-[border-color,background-color] duration-200",
                tool === k.id ? "border-[#e3c79e] bg-[#fbf6ee]" : "border-[#e2e0dc] bg-white hover:border-[#cbc8c2]",
              )}
            >
              <p className="flex items-center gap-1.5 font-display text-[11.5px] font-semibold text-[#1a1917]">
                <Sparkles className={cn("size-3", tool === k.id ? "text-[#c08f4b]" : "text-[#a8a49d]")} />
                {t(k.title, k.en.title)}
              </p>
              <p className="mt-0.5 text-[9.6px] text-[#7d7973]">{t(k.desc, k.en.desc)}</p>
            </button>
          ))}
        </div>
        <Panel className="flex min-h-[230px] flex-col">
          <PanelHead title={t("Ergebnis", "Result")} sub={t("Basierend auf deinem Markenprofil", "Based on your brand profile")} />
          <div className="flex-1 px-4 py-3">
            {text ? (
              <p className="whitespace-pre-line text-[11.2px] leading-[18px] text-[#1a1917]">
                {text}
                {busy && <span className="ml-0.5 inline-block h-3 w-[1.5px] translate-y-0.5 animate-pulse bg-[#c08f4b]" />}
              </p>
            ) : (
              <p className="text-[11px] leading-[18px] text-[#a8a49d]">{t("Wähle ein Tool und klicke auf „Generieren“.", "Pick a tool and click “Generate”.")}</p>
            )}
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-[#eeedea] px-3 py-2.5">
            <GoldButton onClick={run}>
              {busy ? <LoaderCircle className="size-3 animate-spin" /> : <Sparkles className="size-3" />}
              {text && !busy ? t("Neu generieren", "Regenerate") : t("Generieren", "Generate")}
            </GoldButton>
          </div>
        </Panel>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Austausch                                                           */
/* ------------------------------------------------------------------ */

type Msg = { from: string; img?: string; text: string; en?: string; time: string; me?: boolean; approval?: boolean };

function AustauschView() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "Lena Brandt", img: "/team/lena-brandt.png", text: "Die neue Meta-Kampagne ist live. Erste Leads kamen heute Morgen rein. 🎉", en: "The new Meta campaign is live. The first leads came in this morning. 🎉", time: "09:12" },
    { from: "Sabine Kraus", img: "/team/sabine-kraus.png", text: "Die Landingpage für die Herbstaktion ist fertig – kannst du sie freigeben?", en: "The landing page for the autumn promo is ready – can you approve it?", time: "10:40", approval: true },
  ]);
  const [approved, setApproved] = useState<null | "ok" | "change">(null);
  const [draft, setDraft] = useState("");
  const list = useRef<HTMLDivElement>(null);
  const t = useT();

  // keep the newest message in view by scrolling the app pane only (never the page)
  useEffect(() => {
    if (msgs.length <= 2) return;
    const pane = list.current?.closest<HTMLElement>("[data-lenis-prevent]");
    pane?.scrollTo({ top: pane.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { from: "Du", text, time: "jetzt", me: true }]);
    setDraft("");
    setTimeout(
      () =>
        setMsgs((m) => [
          ...m,
          { from: "Sabine Kraus", img: "/team/sabine-kraus.png", text: "Danke dir! Ich kümmere mich direkt darum. 👍", en: "Thanks! I'll get on it right away. 👍", time: "jetzt" },
        ]),
      1100,
    );
  };

  return (
    <>
      <ViewHeader
        title={t("Austausch", "Messages")}
        sub={t("Feedback, Freigaben und Updates – direkt beim Projekt.", "Feedback, approvals and updates – right where the project lives.")}
      />
      <div className="flex flex-col gap-3 px-3 pb-4 pt-4 @[560px]:px-[26px]">
        <div ref={list} className="flex flex-col gap-3">
          {msgs.map((m, i) => (
            <div key={i} className={cn("flex items-end gap-2 animate-[hqfade_.35s_ease_both]", m.me && "flex-row-reverse")}>
              {m.img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.img} alt="" className="size-6 shrink-0 rounded-full object-cover" />
              ) : (
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#12313d] font-display text-[9px] font-semibold text-[#e3c79e]">IA</span>
              )}
              <div
                className={cn(
                  "max-w-[78%] rounded-[12px] px-3 py-2",
                  m.me ? "rounded-br-[4px] bg-[#12313d] text-white" : "rounded-bl-[4px] border border-[#eeedea] bg-white text-[#1a1917]",
                )}
              >
                <p className={cn("mb-0.5 text-[9px]", m.me ? "text-white/55" : "text-[#7d7973]")}>
                  {m.me ? t(m.from, "You") : m.from} · {m.time === "jetzt" ? t("jetzt", "now") : m.time}
                </p>
                <p className="text-[11px] leading-[16px]">{m.en ? t(m.text, m.en) : m.text}</p>
                {m.approval && (
                  <div className="mt-2 rounded-[9px] border border-[#eeedea] bg-[#f6f5f3] p-2">
                    <p className="flex items-center gap-1.5 text-[10.3px] font-medium">
                      <FileText className="size-3 text-[#c08f4b]" /> {t("Landingpage · Herbstaktion", "Landing page · Autumn promo")}
                    </p>
                    {approved ? (
                      <p className={cn("mt-1.5 flex items-center gap-1 text-[10px] font-medium", approved === "ok" ? "text-[#2f8a5f]" : "text-[#94713f]")}>
                        <Check className="size-3" strokeWidth={2.4} />
                        {approved === "ok" ? t("Freigegeben", "Approved") : t("Änderung angefragt", "Changes requested")}
                      </p>
                    ) : (
                      <div className="mt-1.5 flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setApproved("ok")}
                          className="rounded-[7px] bg-[#1a1917] px-2 py-1 text-[9.8px] font-medium text-white transition-colors hover:bg-[#2b2925]"
                        >
                          {t("Freigeben", "Approve")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setApproved("change")}
                          className="rounded-[7px] border border-[#e2e0dc] bg-white px-2 py-1 text-[9.8px] font-medium text-[#5c5954] transition-colors hover:text-[#1a1917]"
                        >
                          {t("Änderung anfragen", "Request changes")}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
          className="sticky bottom-0 mt-1 flex items-center gap-2 rounded-[12px] border border-[#e2e0dc] bg-white p-1.5 pl-3 shadow-[0_-8px_20px_-14px_rgba(8,34,44,0.2)]"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t("Nachricht an dein Team …", "Message your team …")}
            className="min-w-0 flex-1 bg-transparent text-[11px] text-[#1a1917] outline-none placeholder:text-[#a8a49d]"
          />
          <button
            type="submit"
            aria-label={t("Senden", "Send")}
            className="grid size-7 place-items-center rounded-[8px] bg-gradient-to-b from-[#e4c79a] to-[#c39a5c] text-[#0f0e0d] transition-[filter] hover:brightness-105"
          >
            <Send className="size-3.5" strokeWidth={2} />
          </button>
        </form>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Dokumente                                                           */
/* ------------------------------------------------------------------ */

function DokumenteView() {
  const [filter, setFilter] = useState("Alle");
  const [got, setGot] = useState<string | null>(null);
  const locale = useLocale();
  const t = useT();
  const rows = DOCS.filter((d) => filter === "Alle" || d.type === filter);
  const icon = (n: string) => (n.endsWith(".xlsx") ? FileSpreadsheet : n.endsWith(".zip") ? FileArchive : FileText);
  const typeLabel = (id: string) => t(id, DOC_TYPES.find((x) => x.id === id)?.en ?? id);
  return (
    <>
      <ViewHeader title={t("Dokumente", "Documents")} sub={t("Verträge, Berichte und Assets an einem Ort.", "Contracts, reports and assets in one place.")} />
      <div className="px-3 pb-6 pt-4 @[560px]:px-[26px]">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {DOC_TYPES.map(({ id: f }) => (
            <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
              {typeLabel(f)}
            </Chip>
          ))}
        </div>
        <Panel>
          {rows.map((d, i) => {
            const Icon = icon(d.name);
            return (
              <button
                type="button"
                key={d.name}
                onClick={() => {
                  setGot(d.name);
                  setTimeout(() => setGot((g) => (g === d.name ? null : g)), 1600);
                }}
                className={cn(
                  "group/doc flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[#fbf6ee] animate-[hqfade_.3s_ease_both]",
                  i > 0 && "border-t border-[#eeedea]",
                )}
                style={{ animationDelay: `${i * 35}ms` }}
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-[8px] bg-[#f6f5f3] text-[#94713f]">
                  <Icon className="size-3.5" strokeWidth={1.8} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[11px] font-medium text-[#1a1917]">{t(d.name, d.en.name)}</span>
                  <span className="block text-[9.4px] text-[#7d7973]">
                    {typeLabel(d.type)} · {figure(locale, d.size)}
                  </span>
                </span>
                <span className="hidden shrink-0 text-[9.4px] text-[#7d7973] @[480px]:block">{t(d.date, d.en.date)}</span>
                <span className="grid size-6 shrink-0 place-items-center rounded-[7px] text-[#7d7973] opacity-60 transition-[opacity,background-color] group-hover/doc:bg-white group-hover/doc:opacity-100">
                  {got === d.name ? <Check className="size-3 text-[#2f8a5f]" strokeWidth={2.4} /> : <Download className="size-3" />}
                </span>
              </button>
            );
          })}
        </Panel>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Kunden / Team / Projekte / locked                                   */
/* ------------------------------------------------------------------ */

function Spark({ seed }: { seed: string }) {
  const v = series(seed, 12, 10, 0.5);
  const max = Math.max(...v);
  const pts = v.map((y, i) => `${(i / 11) * 60},${20 - (y / max) * 18}`).join(" ");
  return (
    <svg width="60" height="22" className="overflow-visible" aria-hidden>
      <polyline points={pts} fill="none" stroke={GOLD} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function KundenView({ onOpen }: { onOpen: (id: ClientId) => void }) {
  const t = useT();
  return (
    <>
      <ViewHeader
        title={t("Kunden", "Clients")}
        sub={t(`${CLIENTS.length} aktive Konten · Klick öffnet die Leistung`, `${CLIENTS.length} active accounts · click to open performance`)}
      />
      <div className="px-3 pb-6 pt-4 @[560px]:px-[26px]">
        <Panel>
          <div className="flex items-center gap-3 border-b border-[#eeedea] px-4 py-2">
            <Mono className="flex-1">{t("Kunde", "Client")}</Mono>
            <Mono className="hidden w-16 @[520px]:block">{t("Paket", "Plan")}</Mono>
            <Mono className="w-20">Status</Mono>
            <Mono className="hidden w-[60px] @[420px]:block">Leads</Mono>
          </div>
          {CLIENTS.map((c, i) => (
            <button
              type="button"
              key={c.id}
              onClick={() => onOpen(c.id)}
              className={cn("group/row flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[#fbf6ee]", i > 0 && "border-t border-[#eeedea]")}
            >
              <span className="flex min-w-0 flex-1 items-center gap-2">
                <span className="grid size-6 shrink-0 place-items-center rounded-[7px] bg-gradient-to-b from-[#17485b] to-[#04161d] font-display text-[8.5px] font-semibold text-[#e3c79e]">
                  {c.init}
                </span>
                <span className="truncate text-[11px] font-medium text-[#1a1917]">{c.name}</span>
                <ChevronRight className="size-3 shrink-0 -translate-x-1 text-[#c08f4b] opacity-0 transition-[opacity,translate] group-hover/row:translate-x-0 group-hover/row:opacity-100" />
              </span>
              <span className="hidden w-16 text-[10.3px] text-[#5c5954] @[520px]:block">{c.paket}</span>
              <span className="w-20">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[9.4px] font-medium",
                    c.status === "aktiv" ? "bg-[#e7f4ed] text-[#0e5836]" : "bg-[#fbf3e4] text-[#94713f]",
                  )}
                >
                  {c.status === "aktiv" ? t("aktiv", "active") : c.status}
                </span>
              </span>
              <span className="hidden w-[60px] @[420px]:block">
                <Spark seed={c.id} />
              </span>
            </button>
          ))}
        </Panel>
      </div>
    </>
  );
}

function TeamView() {
  const t = useT();
  return (
    <>
      <ViewHeader title="Team" sub={t("Feste Ansprechpartner statt Ticket-System.", "Dedicated contacts, not a ticket system.")} />
      <div className="grid grid-cols-2 gap-2.5 px-3 pb-6 pt-4 @[640px]:grid-cols-3 @[560px]:px-[26px]">
        {TEAM.map((m) => (
          <div
            key={m.name}
            className="group/tm flex flex-col items-center rounded-[12px] border border-[#e2e0dc] bg-white px-3 py-4 text-center transition-[translate,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[#e3c79e] hover:shadow-[0_12px_24px_-16px_rgba(8,34,44,0.35)]"
          >
            <span className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.img} alt="" className="size-12 rounded-full object-cover ring-2 ring-white transition-transform duration-300 group-hover/tm:scale-105" />
              <span className={cn("absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-white", m.online ? "bg-[#2f8a5f]" : "bg-[#cbc8c2]")} />
            </span>
            <p className="mt-2 font-display text-[11.5px] font-semibold text-[#1a1917]">{m.name}</p>
            <p className="text-[9.6px] text-[#7d7973]">{t(m.role, m.en)}</p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-[#eeedea] px-2 py-0.5 text-[9.4px] text-[#5c5954] opacity-0 transition-opacity group-hover/tm:opacity-100">
              <MessageCircle className="size-2.5" /> {t("Nachricht", "Message")}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

function ProjekteView() {
  const t = useT();
  return (
    <>
      <ViewHeader title={t("Projekte", "Projects")} sub={t("Alle laufenden Projekte mit Phase und Fortschritt.", "All active projects with phase and progress.")} />
      <div className="flex flex-col gap-2 px-3 pb-6 pt-4 @[560px]:px-[26px]">
        {PROJECTS.map((p, i) => (
          <div
            key={p.name}
            className="group/pj rounded-[12px] border border-[#e2e0dc] bg-white px-4 py-3 transition-[border-color,box-shadow] duration-200 hover:border-[#e3c79e] hover:shadow-[0_10px_22px_-16px_rgba(8,34,44,0.35)]"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="truncate font-display text-[11.5px] font-semibold text-[#1a1917]">{t(p.name, p.en.name)}</p>
              <span className="shrink-0 text-[9.4px] text-[#7d7973]">{t(p.due, p.en.due)}</span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <span className="w-20 shrink-0 rounded-full bg-[#f6f5f3] px-2 py-0.5 text-center text-[9.4px] font-medium text-[#5c5954]">{t(p.phase, p.en.phase)}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#eeedea]">
                <div
                  className="h-full origin-left rounded-full bg-gradient-to-r from-[#e4c79a] to-[#c39a5c] animate-[hqbar_1s_cubic-bezier(.22,1,.36,1)_both]"
                  style={{ width: `${p.progress}%`, animationDelay: `${i * 80}ms` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right font-mono text-[9.5px] text-[#5c5954]">{p.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function LockedView({ title }: { title: string }) {
  const t = useT();
  return (
    <>
      <ViewHeader title={title} sub={t("Nur für das TyloTech-Team sichtbar.", "Only visible to the TyloTech team.")} />
      <div className="grid place-items-center px-6 py-16 text-center">
        <span className="grid size-12 place-items-center rounded-[14px] border border-[#e3c79e] bg-[#fbf6ee] text-[#94713f]">
          <Lock className="size-5" strokeWidth={1.8} />
        </span>
        <p className="mt-3 font-display text-[13px] font-semibold text-[#1a1917]">{t("Interner Bereich", "Internal area")}</p>
        <p className="mt-1 max-w-[260px] text-[10.6px] leading-4 text-[#7d7973]">
          {t(
            "Hier arbeitet unser Team an Prozessen und Vorlagen. Deine Projekte findest du im Arbeitsbereich.",
            "This is where our team works on processes and templates. You'll find your projects in the workspace.",
          )}
        </p>
      </div>
    </>
  );
}
