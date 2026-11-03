"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  FileText,
  Home,
  Inbox,
  LayoutGrid,
  LineChart,
  Link2,
  MessageCircle,
  Phone,
  Plug,
  Send,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import TrendChart from "@/components/tylohq/TrendChart";
import { reducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/* Interactive TyloHQ demo for the Handwerk landing page: the same screen as the Figma
   "HQ · Dashboard" (Nouh-Wehres, requests instead of ad KPIs), built in HTML so it is
   sharp and clickable. Desktop: browser-style dashboard. Phones: the TyloHQ app. */

type Status = "neu" | "zugewiesen" | "termin" | "erledigt";
type Req = { id: number; title: string; meta: string; status: Status };

const SEED: Req[] = [
  { id: 1, title: "Badsanierung, Düsseldorf-Bilk", meta: "vor 4 Minuten", status: "neu" },
  { id: 2, title: "Notdienst, Flingern", meta: "vor 12 Minuten", status: "neu" },
  { id: 3, title: "Badsanierung, Neuss", meta: "heute, 07:55", status: "neu" },
  { id: 4, title: "Heizung, Oberkassel", meta: "heute, 08:40, M. Weber", status: "zugewiesen" },
  { id: 5, title: "Wärmepumpe, Meerbusch", meta: "heute, 09:10, S. Klein", status: "zugewiesen" },
  { id: 6, title: "Gäste-WC, Flingern", meta: "heute, 09:30, M. Weber", status: "zugewiesen" },
  { id: 7, title: "Komplettbad, Neuss", meta: "Freitag, 10:00 Uhr", status: "termin" },
];
const INCOMING = ["Gäste-WC, Pempelfort", "Barrierefreies Bad, Kaarst", "Heizungstausch, Golzheim", "Badsanierung, Benrath", "Rohrbruch, Derendorf"];

export const BADGE: Record<Status, { label: string; cls: string; dot: string }> = {
  neu: { label: "Neu", cls: "bg-[#e7f4ed] text-[#1e7a52]", dot: "bg-[#1e7a52]" },
  zugewiesen: { label: "Zugewiesen", cls: "bg-[#fbf3e4] text-[#94713f]", dot: "bg-[#c79a53]" },
  termin: { label: "Termin", cls: "bg-[#f1f0ee] text-[#5c5954]", dot: "bg-[#7d7973]" },
  erledigt: { label: "Erledigt", cls: "bg-[#eef3f5] text-[#2b5563]", dot: "bg-[#2b5563]" },
};

const PERIODS = {
  sep: {
    label: "September 2026",
    labels: ["26.8", "29.8", "1.9", "4.9", "6.9", "9.9", "12.9", "15.9", "18.9", "21.9", "24.9"],
    anfragen: [3, 4, 3, 5, 4, 6, 7, 6, 8, 9, 11],
    termine: [4, 4.4, 4.2, 3.8, 4, 3.6, 3.8, 3.4, 3.2, 3.1, 3],
    kpi: { heute: 7, woche: 31, termine: 12, reaktion: "4 Min", d: ["+101,8 %", "+100 %", "−24,6 %", "−1 Min"] },
  },
  aug: {
    label: "August 2026",
    labels: ["27.7", "30.7", "2.8", "5.8", "8.8", "11.8", "14.8", "17.8", "20.8", "23.8", "26.8"],
    anfragen: [2, 2, 3, 2, 3, 3, 4, 3, 4, 4, 3],
    termine: [3, 3.2, 3.6, 3.4, 3.8, 4, 4.2, 4.4, 4.1, 4.3, 4],
    kpi: { heute: 3, woche: 15, termine: 16, reaktion: "5 Min", d: ["+12 %", "+20 %", "+8 %", "−2 Min"] },
  },
} as const;
type PeriodId = keyof typeof PERIODS;

type View = "dashboard" | "leistung" | "integrationen" | "ki" | "austausch" | "dokumente";
const NAV: { id: View; label: string; icon: typeof LayoutGrid }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { id: "leistung", label: "Leistung", icon: LineChart },
  { id: "integrationen", label: "Integrationen", icon: Link2 },
  { id: "ki", label: "KI-Tools", icon: Sparkles },
  { id: "austausch", label: "Austausch", icon: MessageCircle },
  { id: "dokumente", label: "Dokumente", icon: FileText },
];

function Badge({ s, small }: { s: Status; small?: boolean }) {
  const b = BADGE[s];
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full font-medium uppercase tracking-[0.3px]", small ? "px-1.5 py-px text-[8.5px]" : "px-2 py-0.5 text-[10px]", b.cls)}>
      <span className={cn("rounded-full", small ? "size-1" : "size-1.5", b.dot)} />
      {b.label}
    </span>
  );
}

/** New requests keep arriving while the demo is on screen. */
function useLiveRequests(active: boolean) {
  const [reqs, setReqs] = useState<Req[]>(SEED);
  const n = useRef(0);
  useEffect(() => {
    if (!active || reducedMotion()) return;
    const id = window.setInterval(() => {
      const title = INCOMING[n.current++ % INCOMING.length];
      setReqs((r) => [{ id: Date.now(), title, meta: "gerade eben", status: "neu" as Status }, ...r].slice(0, 10));
    }, 6000);
    return () => window.clearInterval(id);
  }, [active]);
  const setStatus = (id: number, status: Status) => setReqs((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
  return { reqs, setStatus };
}

function useOnScreen<T extends Element>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, on] as const;
}

/* ------------------------------------------------------------------ */
/* Desktop dashboard                                                    */
/* ------------------------------------------------------------------ */

export function HQDashboard() {
  const [ref, on] = useOnScreen<HTMLDivElement>();
  const { reqs, setStatus } = useLiveRequests(on);
  const [view, setView] = useState<View>("dashboard");
  const [period, setPeriod] = useState<PeriodId>("sep");
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const flash = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 2200);
  };

  return (
    <div ref={ref} className="relative flex h-[498px] overflow-hidden rounded-[24px] bg-white text-left text-[#1a1917]">
      <aside className="flex w-[194px] shrink-0 flex-col border-r border-[#eeedea] px-3 pb-3 pt-4">
        <div className="flex items-center justify-between px-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/tylotech-logo.svg" alt="TyloTech" className="h-[22px] w-auto" />
          <span className="relative">
            <Bell className="size-[15px] text-[#7d7973]" strokeWidth={1.8} />
            <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-[#d14b3a]" />
          </span>
        </div>
        <button type="button" className="mt-4 flex items-center gap-2 rounded-[10px] border border-[#eeedea] bg-[#f6f5f3] px-2 py-1.5 text-left">
          <span className="grid size-6 place-items-center rounded-[6px] bg-[#0f0e0d] text-[8px] font-semibold text-white">NW</span>
          <span className="min-w-0 flex-1">
            <span className="block font-mono text-[7.5px] uppercase tracking-[0.4px] text-[#7d7973]">Betrieb</span>
            <span className="block truncate text-[11px] font-medium">Nouh-Wehres</span>
          </span>
          <ChevronDown className="size-3 text-[#7d7973]" />
        </button>
        <p className="mt-4 px-1 text-[9.5px] text-[#7d7973]">Arbeitsbereich</p>
        <nav className="mt-1.5 flex flex-col gap-0.5">
          {NAV.map((it) => (
            <button
              key={it.id}
              type="button"
              onClick={() => setView(it.id)}
              className={cn(
                "flex items-center gap-2.5 rounded-[8px] px-2.5 py-[7px] text-[11.5px] transition-colors",
                view === it.id ? "bg-[#fbf6ee] font-medium text-[#1a1917]" : "text-[#5c5954] hover:bg-[#f6f5f3] hover:text-[#1a1917]",
              )}
            >
              <it.icon className={cn("size-[14px]", view === it.id ? "text-[#b98f53]" : "text-[#7d7973]")} strokeWidth={1.8} />
              {it.label}
              {it.id === "austausch" && <span className="ml-auto grid h-[14px] min-w-[14px] place-items-center rounded-full bg-[#c79a53] px-1 font-mono text-[8px] text-white">2</span>}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col bg-[#f6f5f3]">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[#eeedea] bg-white px-5 py-3.5">
          <div className="min-w-0">
            <p className="font-display text-[15px] font-semibold tracking-[-0.3px]">Willkommen zurück, Nouh-Wehres</p>
            <p className="text-[10.5px] text-[#7d7973]">Deine Anfragen in Düsseldorf, diese Woche</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenu((m) => !m)}
                aria-expanded={menu}
                className="flex items-center gap-1.5 rounded-[8px] border border-[#e2e0dc] bg-white px-2.5 py-1.5 text-[10.5px] text-[#1a1917] hover:border-[#cbc8c2]"
              >
                <CalendarDays className="size-3 text-[#7d7973]" />
                {PERIODS[period].label}
                <ChevronDown className={cn("size-3 text-[#7d7973] transition-transform", menu && "rotate-180")} />
              </button>
              {menu && (
                <div className="absolute right-0 top-[calc(100%+4px)] z-10 w-[150px] rounded-[10px] border border-[#eeedea] bg-white p-1 shadow-[0_12px_30px_-12px_rgba(8,34,44,0.3)]">
                  {(Object.keys(PERIODS) as PeriodId[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setPeriod(p);
                        setMenu(false);
                      }}
                      className="flex w-full items-center justify-between rounded-[7px] px-2.5 py-1.5 text-left text-[10.5px] hover:bg-[#f6f5f3]"
                    >
                      {PERIODS[p].label}
                      {p === period && <Check className="size-3 text-[#94713f]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => flash(`Export bereit: anfragen-${PERIODS[period].label.toLowerCase().replace(" ", "-")}.csv`)}
              className="rounded-[8px] px-3 py-1.5 text-[10.5px] font-semibold text-[#1a1917] shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_2px_8px_rgba(168,127,69,0.3)] [background:linear-gradient(90deg,#efdcbc_0%,#d8b681_45%,#b4894d_100%)] hover:brightness-105"
            >
              Anfragen exportieren
            </button>
          </div>
        </header>

        <div data-lenis-prevent className="hq-noscrollbar min-h-0 flex-1 overflow-y-auto p-4">
          <div key={view} className="animate-[hqview_.45s_cubic-bezier(.22,1,.36,1)_both]">
            {view === "dashboard" && <DashView period={period} reqs={reqs} setStatus={setStatus} />}
            {view === "leistung" && <LeistungView />}
            {view === "integrationen" && <IntegrationenView flash={flash} />}
            {view === "ki" && <KIView />}
            {view === "austausch" && <AustauschView />}
            {view === "dokumente" && <DokumenteView flash={flash} />}
          </div>
        </div>
      </div>

      {toast && (
        <div role="status" className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#0f0e0d] px-4 py-2 text-[11px] text-white shadow-lg animate-[hqview_.35s_ease_both]">
          <Check className="size-3.5 text-[#d8b682]" /> {toast}
        </div>
      )}
    </div>
  );
}

function Kpi({ label, value, delta, down, dot }: { label: string; value: string | number; delta: string; down?: boolean; dot: string }) {
  return (
    <div className="flex-1 px-4 py-3.5">
      <p className="flex items-center gap-1.5 font-mono text-[8.5px] uppercase tracking-[0.4px] text-[#7d7973]">
        <span className={cn("size-1.5 rounded-full", dot)} />
        {label}
      </p>
      <p className="mt-1.5 font-display text-[22px] font-semibold leading-7 tracking-[-0.6px] tabular-nums">{value}</p>
      <p className="mt-1 flex items-center gap-1.5 text-[9.5px] text-[#7d7973]">
        <span className={cn("rounded-[4px] px-1.5 py-px font-mono", down ? "bg-[#eef3f5] text-[#2b5563]" : "bg-[#e7f4ed] text-[#1e7a52]")}>{delta}</span>
        vs. Vormonat
      </p>
    </div>
  );
}

function DashView({ period, reqs, setStatus }: { period: PeriodId; reqs: Req[]; setStatus: (id: number, s: Status) => void }) {
  const p = PERIODS[period];
  const [show, setShow] = useState({ anfragen: true, termine: true });
  const [open, setOpen] = useState<"rueckruf" | "team" | null>(null);
  const newCount = reqs.filter((r) => r.status === "neu").length;
  const callback = reqs.filter((r) => r.status === "neu").slice(0, 3);
  const series = useMemo(
    () => [
      { key: "anfragen", label: "Anfragen", color: "#c79a53", values: [...p.anfragen], area: true, hidden: !show.anfragen, format: (v: number) => `${Math.round(v)}` },
      { key: "termine", label: "Termine", color: "#1f5d73", values: [...p.termine], hidden: !show.termine, max: 6, format: (v: number) => `${Math.round(v)}` },
    ],
    [p, show],
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-[14px] border border-[#eeedea] bg-white">
        <div className="flex divide-x divide-[#eeedea] border-b border-[#eeedea]">
          <Kpi label="Neue Anfragen heute" value={p.kpi.heute + Math.max(0, newCount - 3)} delta={p.kpi.d[0]} dot="bg-[#c79a53]" />
          <Kpi label="Anfragen diese Woche" value={p.kpi.woche + Math.max(0, newCount - 3)} delta={p.kpi.d[1]} dot="bg-[#1f5d73]" />
          <Kpi label="Termine vereinbart" value={p.kpi.termine} delta={p.kpi.d[2]} down dot="bg-[#7d7973]" />
          <Kpi label="Ø Reaktionszeit" value={p.kpi.reaktion} delta={p.kpi.d[3]} down dot="bg-[#7d7973]" />
        </div>
        <div className="px-3 pt-2.5">
          <div className="flex items-center gap-4 px-1 text-[10px] text-[#5c5954]">
            {(["anfragen", "termine"] as const).map((k) => (
              <button key={k} type="button" onClick={() => setShow((s) => ({ ...s, [k]: !s[k] }))} className={cn("flex items-center gap-1.5 transition-opacity", !show[k] && "opacity-40")}>
                <span className={cn("h-[2px] w-3 rounded-full", k === "anfragen" ? "bg-[#c79a53]" : "bg-[#1f5d73]")} />
                {k === "anfragen" ? "Anfragen" : "Termine"}
              </button>
            ))}
          </div>
          <TrendChart series={series} labels={[...p.labels]} height={196} padX={12} showEndMarker />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[14px] border border-[#eeedea] bg-white">
          <button type="button" onClick={() => setOpen(open === "rueckruf" ? null : "rueckruf")} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
            <span>
              <span className="block text-[11.5px] font-semibold">{callback.length} Anfragen warten auf Rückruf</span>
              <span className="block text-[9.5px] text-[#7d7973]">Zwei davon seit heute Morgen, eine aus Neuss.</span>
            </span>
            <span className="flex items-center gap-0.5 text-[10px] text-[#5c5954]">
              Alle Anfragen <ChevronRight className={cn("size-3 transition-transform", open === "rueckruf" && "rotate-90")} />
            </span>
          </button>
          {open === "rueckruf" && (
            <ul className="border-t border-[#eeedea] px-2 py-1.5">
              {callback.length === 0 && <li className="px-2 py-2 text-[10.5px] text-[#7d7973]">Alle Rückrufe erledigt.</li>}
              {callback.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-2 rounded-[8px] px-2 py-1.5 hover:bg-[#f6f5f3]">
                  <span className="min-w-0 truncate text-[10.5px]">{r.title}</span>
                  <button type="button" onClick={() => setStatus(r.id, "zugewiesen")} className="flex shrink-0 items-center gap-1 rounded-full bg-[#0f0e0d] px-2 py-0.5 text-[9.5px] text-white hover:bg-[#2a2926]">
                    <Phone className="size-2.5" /> Anrufen
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-[14px] border border-[#eeedea] bg-white">
          <button type="button" onClick={() => setOpen(open === "team" ? null : "team")} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
            <span>
              <span className="block text-[11.5px] font-semibold">Heute zugewiesen</span>
              <span className="block text-[9.5px] text-[#7d7973]">{reqs.filter((r) => r.status === "zugewiesen").length} offen · 2 Termine heute Nachmittag</span>
            </span>
            <span className="flex items-center gap-0.5 text-[10px] text-[#5c5954]">
              Team-Ansicht <ChevronRight className={cn("size-3 transition-transform", open === "team" && "rotate-90")} />
            </span>
          </button>
          {open === "team" && (
            <ul className="border-t border-[#eeedea] px-2 py-1.5">
              {reqs
                .filter((r) => r.status === "zugewiesen" || r.status === "termin")
                .slice(0, 4)
                .map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-2 rounded-[8px] px-2 py-1.5 hover:bg-[#f6f5f3]">
                    <span className="min-w-0 truncate text-[10.5px]">{r.title}</span>
                    <button type="button" onClick={() => setStatus(r.id, "erledigt")} className="shrink-0">
                      <Badge s={r.status} small />
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

const CHANNELS = [
  { name: "Google Suche", share: 46, n: 143 },
  { name: "KI-Suche (ChatGPT, Gemini)", share: 21, n: 65 },
  { name: "Meta Ads", share: 19, n: 59 },
  { name: "Google Unternehmensprofil", share: 14, n: 43 },
];

function LeistungView() {
  return (
    <div className="rounded-[14px] border border-[#eeedea] bg-white p-4">
      <p className="text-[12px] font-semibold">Anfragen nach Kanal</p>
      <p className="text-[10px] text-[#7d7973]">Letzte 90 Tage · 310 Anfragen</p>
      <ul className="mt-4 flex flex-col gap-3.5">
        {CHANNELS.map((c, i) => (
          <li key={c.name}>
            <div className="flex justify-between text-[10.5px]">
              <span>{c.name}</span>
              <span className="tabular-nums text-[#5c5954]">
                {c.n} · {c.share} %
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#f1f0ee]">
              <div className="h-full origin-left rounded-full bg-[linear-gradient(90deg,#d8b681,#b4894d)] animate-[hqbar_1s_cubic-bezier(.22,1,.36,1)_both]" style={{ width: `${c.share * 2}%`, animationDelay: `${i * 90}ms` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function IntegrationenView({ flash }: { flash: (m: string) => void }) {
  const [on, setOn] = useState<Record<string, boolean>>({ "Google Unternehmensprofil": true, "Meta Lead Ads": true, Website: true, WhatsApp: false, Kalender: false });
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {Object.keys(on).map((k) => (
        <div key={k} className="flex items-center justify-between rounded-[12px] border border-[#eeedea] bg-white px-3.5 py-3">
          <span className="flex items-center gap-2 text-[11px]">
            <Plug className="size-3.5 text-[#b98f53]" /> {k}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={on[k]}
            onClick={() => {
              setOn((o) => ({ ...o, [k]: !o[k] }));
              flash(on[k] ? `${k} getrennt` : `${k} verbunden`);
            }}
            className={cn("relative h-4 w-7 rounded-full transition-colors", on[k] ? "bg-[#1e7a52]" : "bg-[#cbc8c2]")}
          >
            <span className={cn("absolute top-0.5 size-3 rounded-full bg-white transition-[left]", on[k] ? "left-[14px]" : "left-0.5")} />
          </button>
        </div>
      ))}
    </div>
  );
}

const REPLY = "Guten Tag Frau Becker, danke für Ihre Anfrage zur Badsanierung in Bilk. Wir können am Donnerstag um 14 Uhr für ein kostenloses Aufmaß vorbeikommen. Passt Ihnen das?";
function KIView() {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const write = () => {
    if (busy) return;
    setBusy(true);
    setText("");
    let i = 0;
    const id = window.setInterval(() => {
      i += 3;
      setText(REPLY.slice(0, i));
      if (i >= REPLY.length) {
        window.clearInterval(id);
        setBusy(false);
      }
    }, 18);
  };
  return (
    <div className="rounded-[14px] border border-[#eeedea] bg-white p-4">
      <p className="text-[12px] font-semibold">Antwort-Assistent</p>
      <p className="text-[10px] text-[#7d7973]">Anfrage: Badsanierung, Düsseldorf-Bilk</p>
      <div className="mt-3 min-h-[86px] rounded-[10px] bg-[#f6f5f3] p-3 text-[11px] leading-[17px] text-[#1a1917]">{text || <span className="text-[#a8a49d]">Noch keine Antwort erstellt.</span>}</div>
      <button type="button" onClick={write} className="mt-3 flex items-center gap-1.5 rounded-full bg-[#0f0e0d] px-3 py-1.5 text-[10.5px] text-white hover:bg-[#2a2926]">
        <Sparkles className="size-3 text-[#d8b682]" /> {busy ? "Schreibt …" : "Antwort vorschlagen"}
      </button>
    </div>
  );
}

function AustauschView() {
  const [msgs, setMsgs] = useState([
    { me: false, t: "Kampagne für Wärmepumpen läuft ab Montag auch in Neuss." },
    { me: true, t: "Super, wir haben nächste Woche zwei Monteure frei." },
  ]);
  const [v, setV] = useState("");
  return (
    <div className="flex h-[360px] flex-col rounded-[14px] border border-[#eeedea] bg-white p-4">
      <p className="text-[12px] font-semibold">Austausch mit TyloTech</p>
      <div className="mt-3 flex flex-1 flex-col gap-2 overflow-y-auto">
        {msgs.map((m, i) => (
          <p key={i} className={cn("max-w-[75%] rounded-[12px] px-3 py-2 text-[11px] leading-4", m.me ? "self-end bg-[#0f0e0d] text-white" : "self-start bg-[#f6f5f3]")}>
            {m.t}
          </p>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!v.trim()) return;
          setMsgs((m) => [...m, { me: true, t: v.trim() }]);
          setV("");
          window.setTimeout(() => setMsgs((m) => [...m, { me: false, t: "Danke, ist notiert. Wir melden uns heute noch." }]), 900);
        }}
        className="mt-2 flex gap-2"
      >
        <input value={v} onChange={(e) => setV(e.target.value)} placeholder="Nachricht schreiben …" aria-label="Nachricht" className="h-8 flex-1 rounded-full border border-[#e2e0dc] px-3 text-[11px] outline-none focus:border-[#b98f53]" />
        <button type="submit" aria-label="Senden" className="grid size-8 place-items-center rounded-full bg-[#c79a53] text-white hover:brightness-105">
          <Send className="size-3.5" />
        </button>
      </form>
    </div>
  );
}

function DokumenteView({ flash }: { flash: (m: string) => void }) {
  const docs = ["Angebot Badsanierung Bilk.pdf", "Monatsbericht September.pdf", "Aufmaß Komplettbad Neuss.pdf", "Vertrag TyloTech.pdf"];
  return (
    <ul className="flex flex-col gap-2">
      {docs.map((d) => (
        <li key={d}>
          <button type="button" onClick={() => flash(`${d} geöffnet`)} className="flex w-full items-center gap-3 rounded-[12px] border border-[#eeedea] bg-white px-3.5 py-3 text-left text-[11px] hover:border-[#e3c79e]">
            <FileText className="size-4 text-[#b98f53]" /> {d}
            <ChevronRight className="ml-auto size-3.5 text-[#a8a49d]" />
          </button>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Phone: the TyloHQ app                                                */
/* ------------------------------------------------------------------ */

type Tab = "start" | "anfragen" | "termine" | "profil";
const TABS: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "start", label: "Start", icon: Home },
  { id: "anfragen", label: "Anfragen", icon: Inbox },
  { id: "termine", label: "Termine", icon: CalendarDays },
  { id: "profil", label: "Profil", icon: User },
];

export function HQPhone() {
  const [ref, on] = useOnScreen<HTMLDivElement>();
  const { reqs, setStatus } = useLiveRequests(on);
  const [tab, setTab] = useState<Tab>("start");
  const [filter, setFilter] = useState<Status | "alle">("alle");
  const newCount = reqs.filter((r) => r.status === "neu").length;

  return (
    <div ref={ref} className="mx-auto w-full max-w-[320px]">
      <div className="relative rounded-[46px] bg-[#0f0e0d] p-[10px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6),inset_0_0_0_1.5px_rgba(255,255,255,0.12)]">
        <div className="relative flex h-[600px] flex-col overflow-hidden rounded-[37px] bg-[#f6f5f3] text-left text-[#1a1917]">
          {/* status bar + dynamic island */}
          <div className="relative flex h-11 shrink-0 items-center justify-between bg-white px-6 pt-1 text-[12px] font-semibold">
            <span>9:41</span>
            <span className="absolute left-1/2 top-2.5 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-[#0f0e0d]" />
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-4 rounded-[3px] border border-[#1a1917] p-px">
                <span className="block h-full w-3/4 rounded-[1px] bg-[#1a1917]" />
              </span>
            </span>
          </div>
          <div className="flex shrink-0 items-center justify-between border-b border-[#eeedea] bg-white px-4 pb-3 pt-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/tylotech-logo.svg" alt="TyloHQ" className="h-5 w-auto" />
            <button type="button" onClick={() => setTab("anfragen")} className="relative" aria-label={`${newCount} neue Anfragen`}>
              <Bell className="size-[18px] text-[#5c5954]" strokeWidth={1.8} />
              {newCount > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#d14b3a] px-1 text-[9px] font-semibold text-white">{newCount}</span>}
            </button>
          </div>

          <div data-lenis-prevent className="hq-noscrollbar min-h-0 flex-1 overflow-y-auto px-4 py-4">
            <div key={tab} className="animate-[hqview_.4s_cubic-bezier(.22,1,.36,1)_both]">
              {tab === "start" && (
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-[11px] text-[#7d7973]">Guten Morgen</p>
                    <p className="font-display text-[19px] font-semibold tracking-[-0.4px]">Nouh-Wehres</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { l: "Neu heute", v: 7 + Math.max(0, newCount - 3), d: "+101 %" },
                      { l: "Diese Woche", v: 31 + Math.max(0, newCount - 3), d: "+100 %" },
                      { l: "Termine", v: 12, d: "diese Woche" },
                      { l: "Reaktionszeit", v: "4 Min", d: "Ø" },
                    ].map((k) => (
                      <div key={k.l} className="rounded-[14px] border border-[#eeedea] bg-white px-3 py-2.5">
                        <p className="font-mono text-[8.5px] uppercase tracking-[0.4px] text-[#7d7973]">{k.l}</p>
                        <p className="mt-0.5 font-display text-[20px] font-semibold tabular-nums tracking-[-0.5px]">{k.v}</p>
                        <p className="text-[9.5px] text-[#1e7a52]">{k.d}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-[12px] font-semibold">Neueste Anfragen</p>
                    <button type="button" onClick={() => setTab("anfragen")} className="text-[10.5px] text-[#94713f]">
                      Alle
                    </button>
                  </div>
                  <ReqList reqs={reqs.slice(0, 3)} setStatus={setStatus} />
                </div>
              )}
              {tab === "anfragen" && (
                <div className="flex flex-col gap-3">
                  <p className="font-display text-[17px] font-semibold tracking-[-0.3px]">Anfragen</p>
                  <div className="hq-noscrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4">
                    {(["alle", "neu", "zugewiesen", "termin", "erledigt"] as const).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFilter(f)}
                        className={cn("shrink-0 rounded-full border px-3 py-1 text-[10.5px] capitalize transition-colors", filter === f ? "border-[#e3c79e] bg-[#fbf6ee] text-[#1a1917]" : "border-[#e2e0dc] bg-white text-[#5c5954]")}
                      >
                        {f === "alle" ? "Alle" : BADGE[f].label}
                      </button>
                    ))}
                  </div>
                  <ReqList reqs={filter === "alle" ? reqs : reqs.filter((r) => r.status === filter)} setStatus={setStatus} />
                </div>
              )}
              {tab === "termine" && (
                <div className="flex flex-col gap-3">
                  <p className="font-display text-[17px] font-semibold tracking-[-0.3px]">Termine</p>
                  {[
                    { d: "Heute", t: "14:00", w: "Aufmaß Badsanierung, Bilk" },
                    { d: "Heute", t: "16:30", w: "Beratung Wärmepumpe, Meerbusch" },
                    { d: "Freitag", t: "10:00", w: "Komplettbad, Neuss" },
                  ].map((x) => (
                    <div key={x.w} className="flex items-center gap-3 rounded-[14px] border border-[#eeedea] bg-white px-3 py-2.5">
                      <span className="grid w-11 shrink-0 place-items-center rounded-[10px] bg-[#fbf6ee] py-1.5 text-center">
                        <span className="text-[8.5px] uppercase text-[#94713f]">{x.d}</span>
                        <span className="text-[12px] font-semibold">{x.t}</span>
                      </span>
                      <span className="text-[11.5px]">{x.w}</span>
                    </div>
                  ))}
                </div>
              )}
              {tab === "profil" && (
                <div className="flex flex-col items-center gap-2 pt-4 text-center">
                  <span className="grid size-14 place-items-center rounded-full bg-[#0f0e0d] text-[15px] font-semibold text-white">NW</span>
                  <p className="font-display text-[16px] font-semibold">Nouh-Wehres GmbH</p>
                  <p className="text-[11px] text-[#7d7973]">SHK-Meisterbetrieb · Düsseldorf & Neuss</p>
                  <p className="mt-3 rounded-full bg-[#e7f4ed] px-3 py-1 text-[10.5px] text-[#1e7a52]">Exklusiv in deiner Stadt</p>
                </div>
              )}
            </div>
          </div>

          <nav className="flex shrink-0 border-t border-[#eeedea] bg-white px-2 pb-5 pt-2">
            {TABS.map((t) => (
              <button key={t.id} type="button" onClick={() => setTab(t.id)} className={cn("relative flex flex-1 flex-col items-center gap-0.5 py-1 text-[9.5px]", tab === t.id ? "text-[#94713f]" : "text-[#7d7973]")}>
                <t.icon className="size-[18px]" strokeWidth={tab === t.id ? 2.1 : 1.7} />
                {t.label}
                {t.id === "anfragen" && newCount > 0 && <span className="absolute right-[22%] top-0 size-1.5 rounded-full bg-[#d14b3a]" />}
              </button>
            ))}
          </nav>
          <span className="pointer-events-none absolute bottom-1.5 left-1/2 h-1 w-[110px] -translate-x-1/2 rounded-full bg-[#1a1917]" />
        </div>
      </div>
    </div>
  );
}

function ReqList({ reqs, setStatus }: { reqs: Req[]; setStatus: (id: number, s: Status) => void }) {
  const next: Record<Status, Status> = { neu: "zugewiesen", zugewiesen: "termin", termin: "erledigt", erledigt: "erledigt" };
  if (!reqs.length) return <p className="py-6 text-center text-[11px] text-[#7d7973]">Keine Anfragen in diesem Status.</p>;
  return (
    <ul className="flex flex-col gap-2">
      {reqs.map((r) => (
        <li key={r.id} className="flex items-center gap-2.5 rounded-[14px] border border-[#eeedea] bg-white px-3 py-2.5 animate-[hqview_.45s_cubic-bezier(.22,1,.36,1)_both]">
          <span className="grid size-8 shrink-0 place-items-center rounded-[9px] bg-[#fbf6ee]">
            <Zap className="size-[15px] text-[#c79a53]" strokeWidth={1.8} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[11.5px] font-medium">{r.title}</span>
            <span className="block text-[9.5px] text-[#7d7973]">{r.meta}</span>
          </span>
          <button type="button" onClick={() => setStatus(r.id, next[r.status])} aria-label={`Status ändern: ${BADGE[r.status].label}`}>
            <Badge s={r.status} small />
          </button>
        </li>
      ))}
    </ul>
  );
}
