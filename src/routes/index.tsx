import { useMemo, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity, Antenna, ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays,
  Check, ChevronDown, CircleDot, Crosshair, Earth, Expand, Focus, Globe2,
  Layers2, LocateFixed, Menu, Moon, Orbit, PanelLeftClose, Radio, Satellite,
  SlidersHorizontal, Sun, Target, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import lunarRim from "@/assets/lunar-south-pole.jpg";
import {
  calculateIllustrativeEphemeris, landingSites, missionDates, telemetrySeries,
  type LandingSite,
} from "@/lib/lunar-math";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lunar Horizon — Mission Intelligence" },
      { name: "description", content: "Explore a lunar south pole mission through an interactive horizon, landing-site atlas, illumination studies and geometric communication windows." },
      { property: "og:title", content: "Lunar Horizon — Mission Intelligence" },
      { property: "og:description", content: "Lunar south pole mission intelligence and exploration workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MissionControl,
});

type View = "Overview" | "Landing sites" | "Horizon simulator" | "Solar analysis" | "Communication windows" | "Mission comparison";

const navItems: { label: View; icon: typeof Orbit; eyebrow?: string }[] = [
  { label: "Overview", icon: Orbit },
  { label: "Landing sites", icon: LocateFixed },
  { label: "Horizon simulator", icon: Moon },
  { label: "Solar analysis", icon: Sun },
  { label: "Communication windows", icon: Antenna },
  { label: "Mission comparison", icon: Layers2 },
];

function MissionControl() {
  const [view, setView] = useState<View>("Overview");
  const [activeSiteId, setActiveSiteId] = useState(landingSites[0].id);
  const [compareSiteId, setCompareSiteId] = useState(landingSites[1].id);
  const [missionDate, setMissionDate] = useState(missionDates[0].value);
  const [minuteOfDay, setMinuteOfDay] = useState(9 * 60 + 20);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [tracking, setTracking] = useState(false);

  const activeSite = landingSites.find((site) => site.id === activeSiteId) ?? landingSites[0];
  const compareSite = landingSites.find((site) => site.id === compareSiteId) ?? landingSites[1];
  const eph = useMemo(
    () => calculateIllustrativeEphemeris(activeSite, minuteOfDay, missionDate),
    [activeSite, minuteOfDay, missionDate],
  );
  const compareEph = useMemo(
    () => calculateIllustrativeEphemeris(compareSite, minuteOfDay, missionDate),
    [compareSite, minuteOfDay, missionDate],
  );

  const show = (next: View) => {
    setView(next);
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mission-topline sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b border-border/80 bg-background/95 px-4 backdrop-blur-xl sm:px-6 lg:hidden">
        <Wordmark />
        <div className="flex items-center gap-2">
          <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline">MISSION CONTROL</span>
          <Button size="icon" variant="outline" aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"} onClick={() => setMobileNavOpen((open) => !open)}>
            {mobileNavOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </header>

      {mobileNavOpen && <button className="fixed inset-0 z-40 bg-background/75 lg:hidden" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}

      <div className="mx-auto min-h-screen max-w-[1760px] lg:grid lg:grid-cols-[232px_minmax(0,1fr)]">
        <aside className={`mission-sidebar fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-border/80 bg-sidebar px-4 pb-5 pt-6 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:w-auto lg:translate-x-0 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="px-2"><Wordmark /></div>
          <div className="mx-2 mt-8 border-y border-border/80 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
            <div className="flex items-center justify-between"><span>Mission telemetry</span><span className="flex items-center gap-1.5 text-emerald-300"><span className="live-dot" /> Nominal</span></div>
            <div className="mt-2 flex justify-between"><span>Flight day</span><span className="text-foreground">SIM · 04</span></div>
          </div>
          <p className="mb-2 mt-8 px-3 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Mission systems</p>
          <nav aria-label="Mission control" className="flex flex-col gap-1">
            {navItems.map(({ label, icon: Icon }) => {
              const selected = view === label;
              return <button key={label} onClick={() => show(label)} aria-current={selected ? "page" : undefined} className={`group flex min-h-11 items-center gap-3 border-l-2 px-3 text-left text-[13px] transition-colors ${selected ? "border-lunar-blue bg-accent/75 text-foreground" : "border-transparent text-muted-foreground hover:border-border hover:bg-secondary/70 hover:text-foreground"}`}><Icon className={`size-4 shrink-0 ${selected ? "text-lunar-blue" : "text-muted-foreground group-hover:text-foreground"}`} strokeWidth={1.6} /><span className="flex-1">{label}</span>{selected && <span className="size-1 rounded-full bg-lunar-blue shadow-[0_0_8px_var(--lunar-blue)]" />}</button>;
            })}
          </nav>

          <div className="mt-auto space-y-4">
            <div className="sidebar-track instrument-grid border border-border/80 p-3">
              <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground"><span>Deep space link</span><Satellite className="size-3.5 text-lunar-blue" /></div>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-foreground"><span className="live-dot" /> DSN · Goldstone <span className="ml-auto font-mono text-emerald-300">READY</span></div>
              <div className="mt-2 h-px bg-border"><div className="h-px w-[77%] bg-lunar-blue" /></div>
            </div>
            <div className="flex items-center gap-2 px-2 font-mono text-[9px] text-muted-foreground"><span>HORIZON SIM V.01</span><span className="ml-auto">◈ &nbsp; EST 2026</span></div>
          </div>
        </aside>

        <main className="min-w-0 px-4 pb-10 sm:px-6 lg:px-8 xl:px-10">
          <div className="hidden h-14 items-center justify-between border-b border-border/60 lg:flex">
            <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground"><span className="text-foreground">MISSION CONTROL</span><span>/</span><span className="text-lunar-blue">{view.toUpperCase()}</span></div>
            <div className="flex items-center gap-4 font-mono text-[10px] text-muted-foreground"><span>EARTH UTC</span><span className="text-foreground">{missionDate.split("-").reverse().join(" · ")} &nbsp; {formatTime(minuteOfDay)}:00</span><span className="flex items-center gap-1.5 text-emerald-300"><span className="live-dot" /> ALL SYSTEMS NOMINAL</span></div>
          </div>

          {view === "Overview" && <OverviewHero onExplore={() => document.getElementById("primary-instruments")?.scrollIntoView({ behavior: "smooth" })} />}

          <div className="flex flex-wrap items-center justify-between gap-4 py-5">
            <div><div className="font-mono text-[9px] uppercase tracking-[0.19em] text-lunar-blue">{view === "Overview" ? "LIVE MISSION TELEMETRY" : "MISSION SYSTEMS / LIVE TELEMETRY"}</div><h1 className="mt-1.5 font-mono text-xl font-medium tracking-normal sm:text-2xl">{view === "Overview" ? "South pole overview" : view}</h1></div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex h-9 items-center gap-2 border border-border bg-card px-3"><CalendarDays className="size-3.5 text-muted-foreground" /><select aria-label="Mission date" value={missionDate} onChange={(event) => setMissionDate(event.target.value)} className="max-w-[132px] cursor-pointer appearance-none bg-transparent font-mono text-[10px] text-foreground outline-none">{missionDates.map((date) => <option key={date.value} value={date.value} className="bg-card">{date.label}</option>)}</select><ChevronDown className="size-3 text-muted-foreground" /></label>
              <label className="flex h-9 items-center gap-2 border border-border bg-card px-3"><Target className="size-3.5 text-lunar-blue" /><select aria-label="Selected landing site" value={activeSiteId} onChange={(event) => setActiveSiteId(event.target.value)} className="max-w-[146px] cursor-pointer appearance-none bg-transparent font-mono text-[10px] text-foreground outline-none">{landingSites.map((site) => <option key={site.id} value={site.id} className="bg-card">{site.name}</option>)}</select><ChevronDown className="size-3 text-muted-foreground" /></label>
            </div>
          </div>

          <EstimateNote />

          <div id="primary-instruments" className="scroll-mt-20">
            {view === "Overview" && <OverviewInstruments site={activeSite} eph={eph} time={minuteOfDay} setTime={setMinuteOfDay} onOpen={show} tracking={tracking} setTracking={setTracking} />}
            {view === "Horizon simulator" && <HorizonView site={activeSite} eph={eph} time={minuteOfDay} setTime={setMinuteOfDay} />}
            {view === "Landing sites" && <LandingSitesView active={activeSite} onSelect={setActiveSiteId} eph={eph} />}
            {view === "Solar analysis" && <SolarView site={activeSite} eph={eph} time={minuteOfDay} setTime={setMinuteOfDay} />}
            {view === "Communication windows" && <CommunicationView site={activeSite} eph={eph} time={minuteOfDay} setTime={setMinuteOfDay} />}
            {view === "Mission comparison" && <CompareView primary={activeSite} secondary={compareSite} secondaryId={compareSiteId} onSecondary={setCompareSiteId} primaryEph={eph} secondaryEph={compareEph} time={minuteOfDay} setTime={setMinuteOfDay} />}
          </div>

          <footer className="mt-10 flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-4 font-mono text-[9px] text-muted-foreground"><span>LUNAR HORIZON · SOUTH POLAR MISSION INTELLIGENCE</span><span>ILLUSTRATIVE SIMULATION · NOT FLIGHT NAVIGATION DATA</span></footer>
        </main>
      </div>
    </div>
  );
}

function Wordmark() {
  return <div className="flex items-center gap-3"><div className="relative grid size-9 place-items-center border border-lunar-blue/30 bg-accent/50"><Moon className="size-5 text-lunar-blue" strokeWidth={1.3} /><span className="absolute -right-0.5 top-0.5 size-1.5 rounded-full bg-solar-amber shadow-[0_0_8px_var(--solar-amber)]" /></div><div><div className="font-mono text-[12px] font-medium tracking-[0.08em]">LUNAR<span className="text-lunar-blue"> / </span>HORIZON</div><div className="mt-0.5 font-mono text-[8px] tracking-[0.15em] text-muted-foreground">MISSION INTELLIGENCE</div></div></div>;
}

function OverviewHero({ onExplore }: { onExplore: () => void }) {
  return <section className="overview-hero relative mt-5 flex min-h-[300px] items-center overflow-hidden border border-border sm:min-h-[326px]" aria-label="Lunar South Pole">
    <img src={lunarRim} alt="Sunlit crater rim and rugged lunar south pole regolith with Earth above the horizon" width={1536} height={1024} fetchPriority="high" className="absolute inset-0 size-full object-cover object-[center_55%]" />
    <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/72 to-background/10" /><div className="absolute inset-0 bg-gradient-to-t from-background/75 via-transparent to-background/15" />
    <div className="absolute inset-0 instrument-grid opacity-30" />
    <div className="relative z-10 grid w-full grid-cols-1 items-end gap-6 p-5 sm:grid-cols-[minmax(0,1fr)_230px] sm:items-center sm:p-8 lg:p-9">
      <div className="max-w-[540px]"><div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.19em] text-lunar-blue"><span className="live-dot" /> Artemis exploration · phase II</div><h2 className="mt-3 font-mono text-3xl font-medium leading-tight tracking-normal sm:text-[42px]">LUNAR<br /><span className="text-foreground">HORIZON</span></h2><p className="mt-3 max-w-[360px] text-sm text-foreground/75">Lunar South Pole Mission Intelligence</p><Button onClick={onExplore} className="mt-5 h-10 rounded-none bg-lunar-blue px-4 font-mono text-[10px] tracking-[0.04em] text-primary-foreground shadow-[0_0_24px_color-mix(in_oklab,var(--lunar-blue)_25%,transparent)] hover:bg-lunar-blue/85">Explore Mission Dashboard <ArrowRight className="size-3.5" /></Button></div>
      <div className="hero-status panel-edge bg-background/75 p-3.5 backdrop-blur-md sm:mb-1">
        <div className="flex items-center justify-between border-b border-border pb-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground"><span>Site acquisition</span><Crosshair className="size-3.5 text-lunar-blue" /></div>
        <div className="mt-3 font-mono text-[12px] text-foreground">NOBILE RIM 01</div><div className="mt-1 font-mono text-[9px] text-muted-foreground">85°12′ S&nbsp; / &nbsp;31°26′ E</div>
        <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3"><div><div className="text-[9px] text-muted-foreground">SOLAR ELEVATION</div><div className="mt-1 font-mono text-[13px] text-solar-amber">+08.1°</div></div><div><div className="text-[9px] text-muted-foreground">EARTH VISIBLE</div><div className="mt-1 flex items-center gap-1 font-mono text-[11px] text-lunar-blue"><Earth className="size-3" /> GEOMETRIC</div></div></div>
      </div>
    </div>
    <div className="absolute bottom-2 right-3 font-mono text-[8px] uppercase tracking-[0.1em] text-foreground/55">South polar highlands · illustrative terrain</div>
  </section>;
}

function EstimateNote() {
  return <div className="mb-4 flex items-start gap-2 border-l-2 border-solar-amber/70 bg-solar-amber/5 px-3 py-2 font-mono text-[9px] leading-relaxed text-muted-foreground"><Activity className="mt-px size-3.5 shrink-0 text-solar-amber" /><span><strong className="font-medium text-solar-amber">ILLUSTRATIVE SAMPLE ESTIMATES</strong><span> &nbsp; Visibility and illumination are schematic only; they are not validated ephemeris, elevation models or operational link predictions.</span></span></div>;
}

type Eph = ReturnType<typeof calculateIllustrativeEphemeris>;

function OverviewInstruments({ site, eph, time, setTime, onOpen, tracking, setTracking }: { site: LandingSite; eph: Eph; time: number; setTime: (time: number) => void; onOpen: (view: View) => void; tracking: boolean; setTracking: (value: boolean) => void }) {
  return <>
    <div className="instrument-layout grid gap-3 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,.8fr)]">
      <HorizonInstrument site={site} eph={eph} time={time} setTime={setTime} onExpand={() => onOpen("Horizon simulator")} />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-2">
        <TelemetryCard icon={<Sun />} label="SOLAR ELEVATION" value={`${signed(eph.solarElevation)}°`} qualifier={`AZ ${padAngle(eph.solarAzimuth)}°`} color="amber" trend={eph.solarElevation >= 0 ? <ArrowUpRight /> : <ArrowDownRight />} />
        <TelemetryCard icon={<Earth />} label="EARTH ELEVATION" value={`+${eph.earthElevation.toFixed(1)}°`} qualifier={`AZ ${padAngle(eph.earthAzimuth)}°`} color="blue" trend={<ArrowUpRight />} />
        <IlluminationCard value={eph.illumination} />
        <TelemetryCard icon={<Radio />} label="LINK GEOMETRY" value={eph.earthVisible ? "VISIBLE" : "OCCULTED"} qualifier={eph.earthVisible ? "POTENTIAL LoS" : "BELOW HORIZON"} color={eph.earthVisible ? "blue" : "violet"} trend={<span className="link-signal">▮▮▮<span>▮</span></span>} compact />
      </div>
    </div>

    <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1.45fr)_minmax(290px,.8fr)]">
      <SolarChartPanel time={time} setTime={setTime} />
      <section className="mission-summary panel-edge flex flex-col justify-between bg-card p-4 sm:p-5">
        <div><div className="flex items-center justify-between"><SectionLabel>MISSION OVERVIEW</SectionLabel><SlidersHorizontal className="size-3.5 text-muted-foreground" /></div><div className="mt-4 flex items-start justify-between gap-2"><div><h3 className="font-mono text-sm">{site.name}</h3><p className="mt-1 text-[11px] text-muted-foreground">{site.region}</p></div><span className="border border-lunar-blue/25 bg-accent/50 px-2 py-1 font-mono text-[8px] uppercase text-lunar-blue">Candidate</span></div>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-border py-3 text-[10px]"><Detail label="COORDINATES" value={`${Math.abs(site.latitude).toFixed(2)}° S · ${site.longitude.toFixed(2)}° E`} /><Detail label="LOCAL ELEVATION" value={`+${site.elevation} m`} /><Detail label="SOLAR AVAILABILITY" value={`~${site.illumination}%`} /><Detail label="CURRENT TIME" value={`${formatTime(time)} LST`} /></div></div>
        <div className="mt-4 flex flex-wrap gap-2"><Button variant="outline" onClick={() => onOpen("Landing sites")} className="h-9 rounded-none border-border font-mono text-[9px]">Explore landing sites <ArrowRight className="size-3" /></Button><Button variant="ghost" onClick={() => setTracking(!tracking)} className={`h-9 rounded-none font-mono text-[9px] ${tracking ? "text-lunar-blue" : "text-muted-foreground"}`}>{tracking ? <Check /> : <CircleDot />}{tracking ? "Site tracked" : "Track site"}</Button></div>
      </section>
    </div>

    <div className="mt-3 grid gap-3 md:grid-cols-3">
      <BriefPanel icon={<Satellite />} title="COMMUNICATION GEOMETRY" accent="blue" value="EARTH LINE-OF-SIGHT" detail="Geometric visibility only — no link budget or DSN pass is implied." button="View windows" onClick={() => onOpen("Communication windows")} />
      <BriefPanel icon={<Sun />} title="POLAR ILLUMINATION" accent="amber" value="INTERMITTENT SUNLIGHT" detail={`Site reference: approximately ${site.illumination}% illumination in this sample model.`} button="Inspect solar analysis" onClick={() => onOpen("Solar analysis")} />
      <BriefPanel icon={<Layers2 />} title="SITE TRADE STUDY" accent="violet" value="3 SITES IN CATALOG" detail="Compare elevation, modeled sunlight, and Earth visibility side by side." button="Compare sites" onClick={() => onOpen("Mission comparison")} />
    </div>
  </>;
}

function SectionLabel({ children }: { children: ReactNode }) { return <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">{children}</span>; }

function HorizonInstrument({ site, eph, time, setTime, onExpand }: { site: LandingSite; eph: Eph; time: number; setTime: (time: number) => void; onExpand: () => void }) {
  const sunX = 28 + (eph.solarAzimuth / 360) * 46;
  const earthX = 27 + (eph.earthAzimuth / 360) * 47;
  const sunY = Math.max(21, Math.min(58, 49 - eph.solarElevation * 1.42));
  const earthY = Math.max(21, Math.min(58, 48 - eph.earthElevation * 1.45));
  return <section className="horizon-instrument panel-edge overflow-hidden bg-card">
    <div className="flex items-center justify-between gap-2 px-4 py-3"><div><SectionLabel>HORIZON SIMULATOR</SectionLabel><h2 className="mt-1 font-mono text-xs">SOUTH POLAR SKY · {site.name.toUpperCase()}</h2></div><Button size="icon" variant="ghost" aria-label="Expand horizon simulator" onClick={onExpand}><Expand className="size-4" /></Button></div>
    <div className="sim-image relative h-[260px] overflow-hidden sm:h-[315px]">
      <img src={lunarRim} alt="Rugged south polar lunar crater ridge beneath a deep-space sky" width={1536} height={1024} loading="lazy" className="absolute inset-0 size-full object-cover object-[center_67%]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/5 to-background/75" />
      <svg viewBox="0 0 800 360" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-label={`Sun at ${signed(eph.solarElevation)} degrees, Earth at plus ${eph.earthElevation} degrees`} role="img">
        <defs><radialGradient id="sunHalo"><stop stopColor="var(--solar-amber)" stopOpacity=".35" /><stop offset="1" stopColor="var(--solar-amber)" stopOpacity="0" /></radialGradient><radialGradient id="earthHalo"><stop stopColor="var(--lunar-blue)" stopOpacity=".35" /><stop offset="1" stopColor="var(--lunar-blue)" stopOpacity="0" /></radialGradient></defs>
        <path d="M120 315 Q 400 145 680 315" fill="none" stroke="var(--lunar-blue)" strokeOpacity=".42" strokeWidth="1" /><path d="M178 315 Q 400 195 622 315" fill="none" stroke="var(--foreground)" strokeOpacity=".18" strokeWidth="1" /><path d="M240 316 Q 400 242 560 316" fill="none" stroke="var(--foreground)" strokeOpacity=".15" strokeWidth="1" />
        <path d="M80 305H720 M123 278H677 M190 251H610" stroke="var(--foreground)" strokeOpacity=".12" strokeDasharray="4 7" />
        <path d="M400 132V318 M246 172L301 318 M554 172L499 318 M159 225L250 318 M641 225L550 318" stroke="var(--foreground)" strokeOpacity=".11" strokeDasharray="3 7" />
        {[-45, -22, 0, 22, 45].map((degrees, i) => { const x = 400 + degrees * 5.6; const y = 322 - Math.sqrt(Math.max(0, 2500 - degrees * degrees)) * 2.15; return <g key={degrees}><circle cx={x} cy={y} r="1.5" fill="var(--foreground)" fillOpacity=".56" /><text x={x} y="345" textAnchor="middle" fill="var(--foreground)" fillOpacity=".57" fontSize="9" fontFamily="JetBrains Mono">{["270°", "315°", "000°", "045°", "090°"][i]}</text></g>; })}
        <circle cx={`${sunX}%`} cy={`${sunY}%`} r="44" fill="url(#sunHalo)" className="celestial-drift" /><circle cx={`${sunX}%`} cy={`${sunY}%`} r="8" fill="var(--solar-amber)" className="celestial-drift" /><circle cx={`${sunX}%`} cy={`${sunY}%`} r="13" fill="none" stroke="var(--solar-amber)" strokeOpacity=".62" />
        <circle cx={`${earthX}%`} cy={`${earthY}%`} r="40" fill="url(#earthHalo)" className="celestial-drift" /><circle cx={`${earthX}%`} cy={`${earthY}%`} r="7" fill="var(--lunar-blue)" className="celestial-drift" /><circle cx={`${earthX}%`} cy={`${earthY}%`} r="11" fill="none" stroke="var(--lunar-blue)" strokeOpacity=".8" />
        <path d="M400 331L396 339H404Z" fill="var(--lunar-blue)" />
      </svg>
      <div className="absolute left-3 top-3 flex gap-2 font-mono text-[8px]"><span className="border border-solar-amber/30 bg-background/75 px-2 py-1 text-solar-amber">✦ &nbsp; SUN &nbsp; {signed(eph.solarElevation)}° / AZ {padAngle(eph.solarAzimuth)}°</span><span className="border border-lunar-blue/30 bg-background/75 px-2 py-1 text-lunar-blue">◉ &nbsp; EARTH &nbsp; +{eph.earthElevation}°</span></div>
      <div className="absolute bottom-9 left-3 font-mono text-[8px] uppercase tracking-[.12em] text-foreground/75">Local horizon / south polar reference</div>
      <Compass />
      <div className="absolute bottom-2 right-3 font-mono text-[8px] text-foreground/70">SIM AZIMUTH · 000° / N</div>
    </div>
    <TimeControl time={time} setTime={setTime} />
  </section>;
}

function Compass() {
  return <div className="absolute right-3 top-3 grid size-10 place-items-center rounded-full border border-foreground/25 bg-background/55 font-mono text-[8px] text-foreground/80 backdrop-blur"><span className="absolute -top-3">N</span><span className="absolute -bottom-3">S</span><span className="absolute -left-2">W</span><span className="absolute -right-2">E</span><span className="text-lunar-blue">✦</span></div>;
}

function TimeControl({ time, setTime }: { time: number; setTime: (time: number) => void }) {
  const marks = [0, 360, 720, 1080, 1439];
  return <div className="border-t border-border bg-background/60 px-4 pb-3 pt-2.5"><div className="mb-2 flex items-center justify-between"><label htmlFor="mission-time" className="font-mono text-[9px] uppercase tracking-[.1em] text-muted-foreground">Mission local time</label><span className="font-mono text-[11px] text-foreground"><span className="text-lunar-blue">{formatTime(time)}</span> LST</span></div><input id="mission-time" aria-label="Mission local time" type="range" min="0" max="1439" step="10" value={time} onChange={(event) => setTime(Number(event.target.value))} className="lunar-slider w-full cursor-pointer" /><div className="mt-1 flex justify-between font-mono text-[8px] text-muted-foreground">{marks.map((minute) => <span key={minute}>{formatTime(minute)}</span>)}</div></div>;
}

function TelemetryCard({ icon, label, value, qualifier, color, trend, compact = false }: { icon: ReactNode; label: string; value: string; qualifier: string; color: "blue" | "amber" | "violet"; trend: ReactNode; compact?: boolean }) {
  return <section className="telemetry-card panel-edge flex min-h-[126px] flex-col justify-between bg-card p-3.5 sm:p-4" aria-label={`${label}: ${value}`}><div className="flex items-start justify-between"><span className="text-muted-foreground [&_svg]:size-4 [&_svg]:stroke-[1.6]">{icon}</span><span className="font-mono text-[8px] text-muted-foreground">{trend}</span></div><div><div className={`font-mono ${compact ? "text-[13px]" : "text-[22px]"} leading-tight text-${color === "amber" ? "solar-amber" : color === "violet" ? "lunar-violet" : "lunar-blue"}`}>{value}</div><div className="mt-1 font-mono text-[8px] uppercase tracking-[.12em] text-muted-foreground">{label}</div><div className="mt-1 text-[9px] text-muted-foreground">{qualifier}</div></div></section>;
}

function IlluminationCard({ value }: { value: number }) {
  const circumference = 2 * Math.PI * 18;
  return <section className="telemetry-card panel-edge flex min-h-[126px] items-center justify-between bg-card p-3.5 sm:p-4" aria-label={`Site illumination, illustrative estimate ${value} percent`}><div><div className="font-mono text-[8px] uppercase tracking-[.12em] text-muted-foreground">SITE ILLUMINATION</div><div className="mt-2 font-mono text-2xl text-lunar-violet">{value}<span className="text-sm">%</span></div><div className="mt-1 text-[9px] text-muted-foreground">Modeled sunlight fraction</div></div><svg viewBox="0 0 48 48" className="size-12 -rotate-90"><circle cx="24" cy="24" r="18" fill="none" stroke="var(--border)" strokeWidth="4" /><circle cx="24" cy="24" r="18" fill="none" stroke="var(--lunar-violet)" strokeWidth="4" strokeDasharray={`${(value / 100) * circumference} ${circumference}`} strokeLinecap="square" /></svg></section>;
}

function SolarChartPanel({ time, setTime, large = false }: { time: number; setTime: (time: number) => void; large?: boolean }) {
  const w = 760; const h = large ? 245 : 178; const left = 35; const right = 12; const top = 16; const bottom = 27;
  const plotW = w - left - right; const plotH = h - top - bottom;
  const toY = (value: number) => top + ((16 - value) / 25) * plotH;
  const linePath = telemetrySeries.map((point, index) => `${index === 0 ? "M" : "L"}${(left + (index / 24) * plotW).toFixed(1)},${toY(point.solar).toFixed(1)}`).join(" ");
  const currentHour = Math.floor(time / 60);
  const cursorX = left + (currentHour / 24) * plotW;
  return <section className="panel-edge min-w-0 bg-card p-4 sm:p-5">
    <div className="flex flex-wrap items-center justify-between gap-2"><div><SectionLabel>POLAR SOLAR PROFILE</SectionLabel><h2 className="mt-1 font-mono text-xs">SUN ELEVATION / 24 HOUR LOCAL SOL</h2></div><div className="flex items-center gap-3 font-mono text-[8px] text-muted-foreground"><span className="flex items-center gap-1.5"><span className="size-1.5 bg-solar-amber" />SUN</span><span>FIELD SAMPLE</span></div></div>
    <div className="mt-4 overflow-hidden"><svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Illustrative solar elevation throughout the 24 hour local day" className="h-auto w-full overflow-visible">
      {[12, 6, 0, -6].map((value) => <g key={value}><line x1={left} x2={w - right} y1={toY(value)} y2={toY(value)} stroke="var(--border)" strokeDasharray={value === 0 ? "0" : "3 6"} strokeOpacity={value === 0 ? ".9" : ".6"} /><text x="0" y={toY(value) + 3} fill="var(--muted-foreground)" fontSize="9" fontFamily="JetBrains Mono">{value}°</text></g>)}
      <path d={`M${left},${toY(0)} ${linePath.slice(1)} L${w-right},${toY(0)}`} fill="var(--solar-amber)" fillOpacity=".07" /><path d={linePath} fill="none" stroke="var(--solar-amber)" strokeWidth="2" />
      <line x1={cursorX} x2={cursorX} y1={top} y2={h-bottom} stroke="var(--lunar-blue)" strokeDasharray="3 4" strokeOpacity=".8" /><circle cx={cursorX} cy={toY(telemetrySeries[currentHour]?.solar ?? 0)} r="4" fill="var(--solar-amber)" stroke="var(--card)" strokeWidth="2" />
      {[0,4,8,12,16,20,24].map((hour) => <text key={hour} x={left + (hour / 24) * plotW} y={h - 5} fill="var(--muted-foreground)" fontSize="9" textAnchor={hour === 0 ? "start" : hour === 24 ? "end" : "middle"} fontFamily="JetBrains Mono">{String(hour).padStart(2, "0")}</text>)}
      {telemetrySeries.slice(0, 24).map((point) => <rect key={point.hour} x={left + (point.hour / 24) * plotW} y={top} width={plotW / 24} height={plotH} fill="transparent" onClick={() => setTime(point.hour * 60)} className="cursor-crosshair"><title>{point.time} — modeled solar elevation {signed(point.solar)}°</title></rect>)}
    </svg></div>
    <div className="mt-1 flex items-center justify-between gap-2 border-t border-border pt-2 font-mono text-[8px] text-muted-foreground"><span>−90° TO +90° AZIMUTH COVERAGE</span><span className="text-solar-amber">SELECTED {formatTime(time)} · {signed(telemetrySeries[currentHour]?.solar ?? 0)}°</span></div>
  </section>;
}

function Detail({ label, value }: { label: string; value: string }) { return <div><div className="font-mono text-[8px] tracking-[.1em] text-muted-foreground">{label}</div><div className="mt-1 font-mono text-[10px] text-foreground">{value}</div></div>; }

function BriefPanel({ icon, title, value, detail, button, onClick, accent }: { icon: ReactNode; title: string; value: string; detail: string; button: string; onClick: () => void; accent: string }) {
  return <section className="panel-edge flex min-h-[164px] flex-col bg-card p-4"><div className="flex items-center justify-between"><SectionLabel>{title}</SectionLabel><span className={`text-${accent === "amber" ? "solar-amber" : accent === "violet" ? "lunar-violet" : "lunar-blue"} [&_svg]:size-4`}>{icon}</span></div><div className="mt-4 font-mono text-[11px]">{value}</div><p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">{detail}</p><Button variant="ghost" onClick={onClick} className="mt-auto h-8 justify-start rounded-none px-0 pt-3 font-mono text-[9px] text-lunar-blue hover:bg-transparent hover:text-foreground">{button}<ArrowRight className="size-3" /></Button></section>;
}

function HorizonView({ site, eph, time, setTime }: { site: LandingSite; eph: Eph; time: number; setTime: (time: number) => void }) {
  return <div className="space-y-3"><div className="grid gap-3 xl:grid-cols-[minmax(0,1.6fr)_minmax(250px,.7fr)]"><HorizonInstrument site={site} eph={eph} time={time} setTime={setTime} onExpand={() => {}} /><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1"><section className="panel-edge bg-card p-5"><SectionLabel>SELECTED CELESTIAL GEOMETRY</SectionLabel><h2 className="mt-3 font-mono text-base">{formatTime(time)} <span className="text-muted-foreground">LST</span></h2><div className="mt-4 space-y-4 border-t border-border pt-4"><Detail label="SUN · ALT / AZ" value={`${signed(eph.solarElevation)}° / ${padAngle(eph.solarAzimuth)}°`} /><Detail label="EARTH · ALT / AZ" value={`+${eph.earthElevation}° / ${padAngle(eph.earthAzimuth)}°`} /><Detail label="SITE ELEVATION" value={`+${site.elevation} m · illustrative catalog`} /></div></section><section className="panel-edge bg-card p-5"><SectionLabel>POLAR HORIZON REFERENCE</SectionLabel><div className="mt-4 grid grid-cols-3 gap-2">{[["000°","N"],["090°","E"],["180°","S"],["270°","W"],[["SUN",padAngle(eph.solarAzimuth)+"°"].join(" · "),"AZ"],["LOCAL","LST","FRAME"]].map((cell) => <div key={cell[0]} className="border border-border bg-background/55 p-2 text-center"><div className="font-mono text-[9px] text-foreground">{cell[0]}</div><div className="mt-1 font-mono text-[8px] text-muted-foreground">{cell[1]}</div></div>)}</div><p className="mt-4 text-[10px] leading-relaxed text-muted-foreground">Angular guides show an illustrative local sky projection, not an instrument-calibrated topographic horizon profile.</p></section></div></div><SolarChartPanel time={time} setTime={setTime} /></div>;
}

function LandingSitesView({ active, onSelect, eph }: { active: LandingSite; onSelect: (id: string) => void; eph: Eph }) {
  const positions = [{ left: "30%", top: "57%" }, { left: "67%", top: "42%" }, { left: "76%", top: "70%" }];
  return <div className="grid gap-3 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,.75fr)]"><section className="panel-edge overflow-hidden bg-card"><div className="flex items-center justify-between gap-2 px-4 py-3"><div><SectionLabel>SOUTH POLAR SITE ATLAS</SectionLabel><h2 className="mt-1 font-mono text-xs">ILLUSTRATIVE TERRAIN / RELATIVE SITE INDEX</h2></div><span className="font-mono text-[8px] text-muted-foreground">SELECT A MARKER</span></div><div className="site-map relative min-h-[400px] overflow-hidden sm:min-h-[500px]"><img src={lunarRim} alt="Shaded relief of a lunar south polar crater with highlands, slopes and shadow" width={1536} height={1024} loading="lazy" className="absolute inset-0 size-full object-cover" /><div className="absolute inset-0 bg-background/35" /><svg className="absolute inset-0 size-full" preserveAspectRatio="none" viewBox="0 0 800 520" aria-hidden="true"><defs><pattern id="siteGrid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M50 0H0V50" fill="none" stroke="var(--lunar-blue)" strokeOpacity=".12" strokeWidth=".7" /></pattern></defs><rect width="800" height="520" fill="url(#siteGrid)" /><ellipse cx="430" cy="255" rx="268" ry="155" fill="none" stroke="var(--foreground)" strokeOpacity=".31" strokeDasharray="3 5" /><ellipse cx="430" cy="255" rx="195" ry="108" fill="none" stroke="var(--foreground)" strokeOpacity=".25" strokeDasharray="3 5" /><ellipse cx="430" cy="255" rx="101" ry="55" fill="none" stroke="var(--solar-amber)" strokeOpacity=".3" strokeDasharray="2 5" /><path d="M42 120Q210 75 330 124T790 132 M18 380Q190 317 386 374T785 362 M110 475Q200 420 355 453T761 455" fill="none" stroke="var(--lunar-blue)" strokeOpacity=".22" strokeWidth="1" /></svg><div className="absolute left-4 top-4 border border-border/80 bg-background/75 px-3 py-2 font-mono text-[8px] leading-relaxed backdrop-blur"><span className="text-lunar-blue">ILLUSTRATIVE SHADED RELIEF</span><br />SOUTH POLAR REGION<br /><span className="text-muted-foreground">Not an authoritative lunar basemap</span></div>{landingSites.map((site, index) => <button key={site.id} onClick={() => onSelect(site.id)} aria-label={`Select ${site.name}`} aria-pressed={active.id === site.id} className={`site-marker absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 font-mono text-[9px] transition-transform hover:scale-105 ${active.id === site.id ? "z-10 text-lunar-blue" : "text-foreground/85"}`} style={{ left: positions[index]?.left ?? "50%", top: positions[index]?.top ?? "50%" }}><span className={`grid size-6 place-items-center rounded-full border ${active.id === site.id ? "border-lunar-blue bg-accent/90 shadow-[0_0_18px_color-mix(in_oklab,var(--lunar-blue)_40%,transparent)]" : "border-foreground/60 bg-background/75"}`}><span className="size-1.5 rounded-full bg-current" /></span><span className="border border-border/60 bg-background/80 px-2 py-1 backdrop-blur">{site.name}</span></button>)}<div className="absolute bottom-3 left-4 right-4 flex justify-between font-mono text-[8px] text-foreground/70"><span>85°00′ S &nbsp; · &nbsp; SAMPLE COORDINATE FRAME</span><span>RELIEF / CRATER RIMS / SLOPE</span></div></div></section><section className="panel-edge flex flex-col bg-card p-5"><div className="flex items-center justify-between"><SectionLabel>SELECTED LANDING ZONE</SectionLabel><LocateFixed className="size-4 text-lunar-blue" /></div><h2 className="mt-5 font-mono text-lg">{active.name}</h2><p className="mt-1 text-[11px] text-muted-foreground">{active.region}</p><div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-5 border-y border-border py-4"><Detail label="LATITUDE" value={`${Math.abs(active.latitude).toFixed(2)}° S`} /><Detail label="LONGITUDE" value={`${active.longitude.toFixed(2)}° E`} /><Detail label="SAMPLE ELEVATION" value={`+${active.elevation} m`} /><Detail label="MODELED SUNLIGHT" value={`~${active.illumination}%`} /><Detail label="SUN ELEVATION" value={`${signed(eph.solarElevation)}°`} /><Detail label="EARTH VISIBILITY" value="GEOMETRIC SAMPLE" /></div><div className="mt-4 border-l border-solar-amber px-3 py-2 text-[10px] leading-relaxed text-muted-foreground">Site labels and topography are illustrative examples. Elevations and illumination figures require validation against authoritative lunar datasets.</div><div className="mt-auto pt-5"><SectionLabel>CATALOG / {landingSites.length} SAMPLE SITES</SectionLabel></div></section></div>;
}

function SolarView({ site, eph, time, setTime }: { site: LandingSite; eph: Eph; time: number; setTime: (time: number) => void }) {
  const sunrise = telemetrySeries.find((point) => point.hour > 3 && point.solar >= 0)?.time ?? "08:00";
  const shadow = telemetrySeries.find((point) => point.hour > 12 && point.solar < 0)?.time ?? "21:00";
  return <div className="space-y-3"><div className="grid grid-cols-2 gap-3 lg:grid-cols-4"><CompactMetric title="CURRENT SUN ANGLE" value={`${signed(eph.solarElevation)}°`} tint="amber" icon={<Sun />} caption={`AZIMUTH ${padAngle(eph.solarAzimuth)}°`} /><CompactMetric title="MODELED ILLUMINATION" value={`${eph.illumination}%`} tint="violet" icon={<Activity />} caption={`${site.name.toUpperCase()}`} /><CompactMetric title="SUN ABOVE HORIZON" value={`${Math.round(site.illumination * .23)}.4 h`} tint="blue" icon={<Orbit />} caption="SAMPLE ESTIMATE" /><CompactMetric title="ILLUSTRATIVE SUNRISE" value={sunrise} tint="amber" icon={<ArrowUpRight />} caption={`SHADOW ${shadow}`} /></div><SolarChartPanel time={time} setTime={setTime} large /><div className="grid gap-3 md:grid-cols-2"><TimelineBlock title="MODELED ILLUMINATION WINDOWS" data={telemetrySeries.map((point) => point.illumination)} tone="amber" selectedHour={Math.floor(time / 60)} /><section className="panel-edge bg-card p-5"><SectionLabel>ENERGY HARVEST / SCHEMATIC</SectionLabel><h2 className="mt-2 font-mono text-base">Relative solar availability</h2><p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">Estimated site illumination is shown as an illustrative sunlight fraction, not a solar-power budget. Terrain masking, season, hardware, attitude, and validated ephemeris are not modeled.</p><div className="mt-4 flex items-center justify-between border-t border-border pt-3 font-mono text-[9px]"><span className="text-muted-foreground">REFERENCE SITE</span><span>{site.name.toUpperCase()}</span></div></section></div></div>;
}

function CommunicationView({ site, eph, time, setTime }: { site: LandingSite; eph: Eph; time: number; setTime: (time: number) => void }) {
  const earthX = 27 + (eph.earthAzimuth / 360) * 47;
  return <div className="space-y-3"><section className="panel-edge relative grid min-h-[272px] overflow-hidden bg-card md:grid-cols-[minmax(0,1.3fr)_minmax(280px,.7fr)]"><div className="communication-sky instrument-grid relative min-h-[260px] overflow-hidden"><div className="absolute inset-0 bg-gradient-to-br from-accent/25 to-transparent" /><div className="absolute inset-0 flex items-center justify-center"><div className="earth-orbit grid size-44 place-items-center rounded-full border border-lunar-blue/20 sm:size-56"><div className="absolute size-32 rounded-full border border-lunar-blue/25 sm:size-40" /><div className="earth-disc grid size-24 place-items-center rounded-full bg-gradient-to-br from-lunar-blue/80 via-lunar-blue/25 to-background shadow-[0_0_52px_color-mix(in_oklab,var(--lunar-blue)_32%,transparent)] sm:size-28"><Globe2 className="size-9 text-foreground/80" strokeWidth={1} /></div><div className="absolute inset-2 rounded-full border border-dashed border-muted-foreground/25" /></div><div className="absolute bottom-8 left-[50%] h-16 w-40 -translate-x-1/2 border-t border-dashed border-muted-foreground/50" /><div className="absolute bottom-4 left-[calc(50%-3px)] size-1.5 rounded-full bg-solar-amber shadow-[0_0_12px_var(--solar-amber)]" /></div><div className="absolute left-4 top-4 font-mono text-[8px] uppercase tracking-[.14em] text-lunar-blue">EARTH-SPACECRAFT GEOMETRY</div><div className="absolute bottom-3 right-4 font-mono text-[8px] text-muted-foreground">NOBILE RIM → EARTH · SCHEMATIC</div></div><div className="flex flex-col justify-center border-t border-border p-5 md:border-l md:border-t-0"><div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.13em] text-muted-foreground"><Antenna className="size-4 text-lunar-blue" /> CURRENT GEOMETRY</div><div className="mt-4 flex items-center gap-2"><span className={`live-dot ${eph.earthVisible ? "" : "!bg-muted-foreground"}`} /><span className={`font-mono text-lg ${eph.earthVisible ? "text-lunar-blue" : "text-muted-foreground"}`}>{eph.earthVisible ? "EARTH VISIBLE" : "BELOW HORIZON"}</span></div><div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-y border-border py-4"><Detail label="EARTH ELEVATION" value={`+${eph.earthElevation.toFixed(1)}°`} /><Detail label="EARTH AZIMUTH" value={`${padAngle(eph.earthAzimuth)}°`} /><Detail label="LOCAL TIME" value={`${formatTime(time)} LST`} /><Detail label="SITE" value={site.name.toUpperCase()} /></div></div></section><div className="grid gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]"><section className="panel-edge bg-card p-4 sm:p-5"><div className="flex flex-wrap items-center justify-between gap-2"><div><SectionLabel>GEOMETRIC LINE-OF-SIGHT WINDOWS</SectionLabel><h2 className="mt-1 font-mono text-xs">24 HOUR LOCAL COMMUNICATION GEOMETRY</h2></div><span className="flex items-center gap-1.5 font-mono text-[8px] text-lunar-blue"><span className="size-1.5 bg-lunar-blue" /> POTENTIAL VISIBILITY</span></div><div className="mt-6"><TimelineBlock title="EARTH ABOVE THE ILLUSTRATIVE HORIZON" data={telemetrySeries.map((point) => point.earth)} tone="blue" selectedHour={Math.floor(time / 60)} height={42} onSelectHour={(hour) => setTime(hour * 60)} /></div><TimeControl time={time} setTime={setTime} /></section><section className="panel-edge bg-card p-5"><SectionLabel>LINK STATUS / LIMITATIONS</SectionLabel><h2 className="mt-3 font-mono text-sm">Geometry ≠ operational link</h2><p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">Visibility here represents a simple modeled Earth elevation. It does not guarantee a communications link. Antenna pointing, terrain occultation, spacecraft attitude, link budget, ground-station schedule, and DSN availability are not included.</p><div className="mt-4 flex items-center gap-2 border-t border-border pt-4 text-[10px]"><Satellite className="size-4 shrink-0 text-lunar-blue" /><span className="text-muted-foreground">No real pass schedule or station assignment is implied.</span></div></section></div></div>;
}

function CompareView({ primary, secondary, secondaryId, onSecondary, primaryEph, secondaryEph, time, setTime }: { primary: LandingSite; secondary: LandingSite; secondaryId: string; onSecondary: (id: string) => void; primaryEph: Eph; secondaryEph: Eph; time: number; setTime: (time: number) => void }) {
  const headers = [{ title: "ELEVATION", a: `+${primary.elevation} m`, b: `+${secondary.elevation} m`, unit: "SAMPLE SITE VALUE" }, { title: "SITE ILLUMINATION", a: `~${primary.illumination}%`, b: `~${secondary.illumination}%`, unit: "REFERENCE FRACTION" }, { title: "SUN ELEVATION", a: `${signed(primaryEph.solarElevation)}°`, b: `${signed(secondaryEph.solarElevation)}°`, unit: `AT ${formatTime(time)} LST` }, { title: "EARTH ELEVATION", a: `+${primaryEph.earthElevation.toFixed(1)}°`, b: `+${secondaryEph.earthElevation.toFixed(1)}°`, unit: "GEOMETRIC ESTIMATE" }];
  return <div className="space-y-3"><section className="panel-edge bg-card p-4 sm:p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><SectionLabel>SYNCHRONIZED SITE TRADE STUDY</SectionLabel><h2 className="mt-1 font-mono text-xs">SIDE-BY-SIDE · NO RANKING</h2></div><label className="flex h-9 items-center gap-2 border border-border bg-background px-3"><Layers2 className="size-3.5 text-lunar-blue" /><select aria-label="Comparison landing site" value={secondaryId} onChange={(event) => onSecondary(event.target.value)} className="max-w-44 cursor-pointer appearance-none bg-transparent font-mono text-[9px] outline-none">{landingSites.filter((site) => site.id !== primary.id).map((site) => <option key={site.id} value={site.id} className="bg-card">{site.name}</option>)}</select><ChevronDown className="size-3" /></label></div><div className="mt-5 grid grid-cols-[minmax(0,1fr)_minmax(54px,.4fr)_minmax(0,1fr)] gap-x-2 border-b border-border pb-3"><div><div className="font-mono text-[10px] text-lunar-blue">SITE A · PRIMARY</div><div className="mt-1 font-mono text-xs">{primary.name}</div><div className="mt-1 text-[9px] text-muted-foreground">{primary.region}</div></div><div /><div><div className="font-mono text-[10px] text-lunar-violet">SITE B · COMPARISON</div><div className="mt-1 font-mono text-xs">{secondary.name}</div><div className="mt-1 text-[9px] text-muted-foreground">{secondary.region}</div></div></div>{headers.map((metric) => <div key={metric.title} className="comparison-row grid grid-cols-[minmax(0,1fr)_minmax(54px,.4fr)_minmax(0,1fr)] items-center gap-x-2 border-b border-border/75 py-4"><div className="font-mono text-sm text-foreground">{metric.a}</div><div className="text-center font-mono text-[8px] text-muted-foreground">{metric.title}</div><div className="text-right font-mono text-sm text-foreground">{metric.b}</div><div className="col-span-3 mt-1 font-mono text-[8px] text-muted-foreground">{metric.unit}</div></div>)}<div className="mt-4 grid gap-2 sm:grid-cols-2"><TimeControl time={time} setTime={setTime} /><div className="flex items-center gap-2 border border-border/70 px-3 font-mono text-[8px] text-muted-foreground"><Focus className="size-3.5 shrink-0 text-lunar-blue" /> TIME SELECTION SYNCHRONIZED ACROSS BOTH SITES</div></div></section><div className="grid gap-3 xl:grid-cols-2"><SolarChartPanel time={time} setTime={setTime} /><SolarChartPanel time={time} setTime={setTime} /></div><p className="px-1 font-mono text-[9px] text-muted-foreground">Comparisons use illustrative examples only. Metrics are not validated terrain products, flight recommendations, or site rankings.</p></div>;
}

function TimelineBlock({ title, data, tone, selectedHour, height = 60, onSelectHour }: { title: string; data: number[]; tone: "amber" | "blue"; selectedHour: number; height?: number; onSelectHour?: (hour: number) => void }) {
  const reference = tone === "amber" ? 0 : 0;
  const isOpen = (value: number) => tone === "amber" ? value > 69 : value >= reference;
  return <div><div className="mb-2 flex items-center justify-between"><SectionLabel>{title}</SectionLabel><span className="font-mono text-[8px] text-muted-foreground">ILLUSTRATIVE SAMPLE</span></div><div className="flex h-[55px] gap-[2px]" role="img" aria-label={title}>
    {data.map((value, index) => { const open = isOpen(value); const bg = !open ? "bg-secondary" : tone === "amber" ? "bg-solar-amber/70" : "bg-lunar-blue/70"; return <button key={index} aria-label={`${String(index).padStart(2, "0")}:00 ${open ? "potentially above horizon" : "below modeled threshold"}`} title={`${String(index).padStart(2, "0")}:00`} onClick={() => onSelectHour?.(index)} disabled={!onSelectHour} className={`relative min-w-0 flex-1 transition-opacity ${bg} ${index === selectedHour ? "opacity-100" : "opacity-65 hover:opacity-100"}`} style={{ height: `${Math.max(28, Math.min(100, 34 + Math.abs(value) * .9))}%`, alignSelf: "flex-end" }}>{index === selectedHour && <span className="absolute -top-2 left-1/2 size-1.5 -translate-x-1/2 bg-foreground" />}</button>; })}
  </div><div className="mt-2 flex justify-between font-mono text-[8px] text-muted-foreground">{["00:00", "06:00", "12:00", "18:00", "24:00"].map((label) => <span key={label}>{label}</span>)}</div><div className="sr-only">{data.length} hourly values; illustrative horizon calculation.</div>{height !== 60 && <div className="sr-only">Requested timeline height {height}</div>}</div>;
}

function CompactMetric({ title, value, tint, icon, caption }: { title: string; value: string; tint: string; icon: ReactNode; caption: string }) {
  const colorClass = tint === "amber" ? "text-solar-amber" : tint === "violet" ? "text-lunar-violet" : "text-lunar-blue";
  return <section className="panel-edge min-w-0 bg-card p-4"><div className="flex items-center justify-between gap-1"><SectionLabel>{title}</SectionLabel><span className={`${colorClass} [&_svg]:size-4`}>{icon}</span></div><div className={`mt-4 font-mono text-xl ${colorClass}`}>{value}</div><div className="mt-1 truncate font-mono text-[8px] text-muted-foreground">{caption}</div></section>;
}

function formatTime(minute: number) { return `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`; }
function signed(value: number) { return `${value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(1)}`; }
function padAngle(value: number) { return String(value).padStart(3, "0"); }