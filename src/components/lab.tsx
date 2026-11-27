import { useEffect, useMemo, useState } from "react";
import { Dumbbell, Moon, Pause, Play, RotateCcw, Sun, Syringe, Utensils } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  SCENARIOS,
  STATE_LABEL,
  glycemiaState,
  narrate,
  simulate,
  type BodyMode,
  type Scenario,
} from "@/lib/regulate";

const ICONS = {
  rest: Sun,
  meal: Utensils,
  fast: Moon,
  exercise: Dumbbell,
} as const;

const SLOTS = [
  { id: "param", title: "المقدار المنظَّم", answer: "glycemia" },
  { id: "ref", title: "القيمة المرجعية", answer: "one" },
  { id: "sensor", title: "اللواقط", answer: "islet" },
  { id: "message", title: "الرسالة", answer: "hormones" },
  { id: "carrier", title: "الناقل", answer: "blood" },
  { id: "effector", title: "المنفذات", answer: "liver" },
  { id: "fix", title: "نوع التصحيح", answer: "negative" },
] as const;

const CHIPS = [
  { id: "glycemia", label: "تركيز الغلوكوز في الدم" },
  { id: "one", label: "حوالي 1 غ/ل" },
  { id: "islet", label: "خلايا α و β" },
  { id: "hormones", label: "أنسولين وغلوكاغون" },
  { id: "blood", label: "الدم" },
  { id: "liver", label: "الكبد، ثم العضل والنسيج الدهني" },
  { id: "negative", label: "تنظيم رجعي سالب" },
  { id: "nerve", label: "سيالة عصبية فقط" },
  { id: "ten", label: "10 غ/ل" },
];

export function Lab() {
  const [mode, setMode] = useState<BodyMode>("healthy");
  const [scenario, setScenario] = useState<Scenario>("meal");
  const [shotAt, setShotAt] = useState<number | null>(null);
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 2 | 4>(1);
  const [picked, setPicked] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [miss, setMiss] = useState<string | null>(null);

  const samples = useMemo(
    () => simulate({ mode, scenario, shotAt }),
    [mode, scenario, shotAt],
  );
  const now = samples[Math.min(cursor, samples.length - 1)];
  const state = glycemiaState(now.g);
  const shown = samples.filter((sample, index) => {
    if (index > cursor) return false;
    if (index === cursor || index % 2 === 0) return true;
    return shotAt != null && sample.t === shotAt;
  });

  useEffect(() => {
    const start = () => {
      setMode("healthy");
      setScenario("meal");
      setShotAt(null);
      setCursor(0);
      setPlaying(true);
    };
    window.addEventListener("gly:play", start);
    return () => window.removeEventListener("gly:play", start);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const delay = speed === 4 ? 36 : speed === 2 ? 70 : 120;
    const id = window.setInterval(() => {
      setCursor((value) => {
        if (value >= samples.length - 1) {
          setPlaying(false);
          return samples.length - 1;
        }
        return value + 1;
      });
    }, delay);
    return () => window.clearInterval(id);
  }, [playing, speed, samples.length]);

  function place(slotId: string, answer: string) {
    if (placed[slotId]) return;
    if (!picked) return;
    if (picked !== answer) {
      setMiss(slotId);
      window.setTimeout(() => setMiss(null), 700);
      return;
    }
    setPlaced((current) => ({ ...current, [slotId]: picked }));
    setPicked(null);
    setMiss(null);
  }

  const done = SLOTS.every((slot) => placed[slot.id]);
  const tone =
    state === "high" ? "text-glucose" : state === "low" ? "text-primary-deep" : "text-ink";

  return (
    <section id="model" className="mx-auto max-w-6xl px-5 py-14">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-primary">النموذج</p>
        <h2 className="mt-2 text-3xl text-ink md:text-4xl">حلقة تنظيم السكر</h2>
        <p className="mt-3 text-muted">
          نموذج تعليمي مبسّط على ثلاث ساعات. المستويات الهرمونية نسبية داخل النموذج، وليست جرعات طبية ولا تُستخدم للعلاج.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          className={mode === "healthy" ? "btn btn-on" : "btn btn-ghost"}
          onClick={() => {
            setMode("healthy");
            setShotAt(null);
            setCursor(0);
            setPlaying(false);
          }}
        >
          عضوية سليمة
        </button>
        <button
          type="button"
          className={mode === "type1" ? "btn btn-on" : "btn btn-ghost"}
          onClick={() => {
            setMode("type1");
            setShotAt(null);
            setCursor(0);
            setPlaying(false);
          }}
        >
          سكري نمط 1
        </button>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-4">
        {SCENARIOS.map((item) => {
          const Icon = ICONS[item.id];
          const on = scenario === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setScenario(item.id);
                setShotAt(null);
                setCursor(0);
                setPlaying(true);
              }}
              className={on ? "btn btn-on h-auto flex-col items-start py-3 text-start" : "btn btn-ghost h-auto flex-col items-start py-3 text-start"}
            >
              <span className="flex items-center gap-2">
                <Icon className="size-4" />
                {item.label}
              </span>
              <span className="text-xs font-medium text-muted">{item.hint}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" className="btn btn-primary" onClick={() => setPlaying((value) => !value)}>
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          {playing ? "إيقاف" : "تشغيل"}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setCursor(0);
            setShotAt(null);
            setPlaying(false);
          }}
        >
          <RotateCcw className="size-4" />
          إعادة
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={shotAt != null}
          onClick={() => {
            setShotAt(now.t);
            setPlaying(true);
          }}
        >
          <Syringe className="size-4" />
          {shotAt == null ? "حقن أنسولين" : `حُقن عند ${shotAt} د`}
        </button>
        {([1, 2, 4] as const).map((value) => (
          <button
            key={value}
            type="button"
            className={speed === value ? "btn btn-on" : "btn btn-ghost"}
            onClick={() => setSpeed(value)}
          >
            {value}×
          </button>
        ))}
      </div>

      <label className="mt-4 block text-sm text-muted">
        الزمن: {now.t} دقيقة
        <input
          className="mt-2 w-full accent-primary"
          type="range"
          min={0}
          max={samples.length - 1}
          value={cursor}
          onChange={(event) => {
            setCursor(Number(event.target.value));
            setPlaying(false);
          }}
        />
      </label>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="rounded-3xl border border-line bg-surface p-4" dir="ltr">
          <div className="grid grid-cols-3 gap-3">
            <div />
            <Node
              title="البنكرياس"
              detail="لواقط α و β"
              meter={Math.max(now.insulin, now.glucagon)}
              note={`β ${Math.round(now.insulin * 100)} · α ${Math.round(now.glucagon * 100)}`}
            />
            <div />
            <Node title="العضل" detail="يستهلك ولا يحرر" meter={now.muscle} note="غليكوجين عضلي" />
            <div className="flex flex-col items-center justify-center rounded-2xl bg-bg px-3 py-4 text-center">
              <p className="text-xs font-semibold text-muted">سكر الدم</p>
              <p className={`mt-1 font-display text-4xl font-semibold tabular-nums ${tone}`}>{now.g.toFixed(2)}</p>
              <p className="text-sm text-muted">غ/ل</p>
              <p className={`mt-2 text-sm font-semibold ${tone}`}>{STATE_LABEL[state]}</p>
            </div>
            <Node title="الكبد" detail="المنفّذ الرئيس" meter={now.liver} note="مخزون الغليكوجين" />
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-surface p-4">
          <p className="text-sm leading-6 text-ink">{narrate(now, mode, scenario, shotAt)}</p>
          <div className="mt-3 h-64" dir="ltr">
            <Chart data={shown} shotAt={shotAt} />
          </div>
          <p className="mt-2 text-xs text-muted">
            الشريط الأخضر: المجال العادي 0.8–1.2 غ/ل. الخط المتقطع: القيمة المرجعية 1 غ/ل.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-line bg-surface p-5">
        <h3 className="text-2xl text-ink">ركّب الجهاز المنظِّم</h3>
        <p className="mt-2 text-sm text-muted">اختر بطاقة ثم اضغط الخانة التي تناسبها. البطاقتان الزائدتان لا مكان لهما في هذا النموذج.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {CHIPS.map((chip) => {
            const used = Object.values(placed).includes(chip.id);
            return (
              <button
                key={chip.id}
                type="button"
                disabled={used}
                onClick={() => setPicked(chip.id)}
                className={picked === chip.id ? "btn btn-on" : "btn btn-ghost"}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {SLOTS.map((slot) => {
            const chip = CHIPS.find((item) => item.id === placed[slot.id]);
            const bad = miss === slot.id;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => place(slot.id, slot.answer)}
                className={
                  bad
                    ? "rounded-2xl border border-glucose bg-glucose-soft px-4 py-3 text-start"
                    : "rounded-2xl border border-line bg-bg px-4 py-3 text-start"
                }
              >
                <span className="block text-sm text-muted">{slot.title}</span>
                <span className="mt-1 block font-semibold text-ink">{chip ? chip.label : "ضع البطاقة هنا"}</span>
              </button>
            );
          })}
        </div>
        {done ? (
          <p className="mt-4 rounded-2xl bg-primary-soft px-4 py-3 text-sm leading-6 text-primary-deep">
            النموذج مكتمل. المقدار المنظَّم هو سكر الدم، والقيمة المرجعية 1 غ/ل. الخلايا α و β لاقطات، والدم ناقل لرسالتين متعاكستين، والكبد المنفّذ الأهم. كل ابتعاد يُصحَّح بتنظيم رجعي سالب.
          </p>
        ) : null}
      </div>
    </section>
  );
}

function Node({ title, detail, meter, note }: { title: string; detail: string; meter: number; note: string }) {
  return (
    <div className="rounded-2xl border border-line bg-bg p-3 text-right" dir="rtl">
      <p className="font-semibold text-ink">{title}</p>
      <p className="text-xs text-muted">{detail}</p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface">
        <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round(meter * 100)}%` }} />
      </div>
      <p className="mt-2 text-xs text-muted">{note}</p>
    </div>
  );
}

function Chart({ data, shotAt }: { data: { t: number; g: number }[]; shotAt: number | null }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <div className="h-full rounded-2xl bg-bg" />;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="var(--color-line)" vertical={false} />
        <XAxis dataKey="t" tick={{ fill: "var(--color-muted)", fontSize: 12 }} unit=" د" />
        <YAxis domain={[0.4, 2.5]} tick={{ fill: "var(--color-muted)", fontSize: 12 }} width={36} />
        <Tooltip
          formatter={(value) => [`${Number(value).toFixed(2)} غ/ل`, "السكر"]}
          labelFormatter={(label) => `${label} دقيقة`}
        />
        <ReferenceArea y1={0.8} y2={1.2} fill="var(--color-primary)" fillOpacity={0.12} />
        <ReferenceLine y={1} stroke="var(--color-primary)" strokeDasharray="4 4" />
        {shotAt != null ? <ReferenceLine x={shotAt} stroke="var(--color-glucose)" strokeDasharray="3 3" /> : null}
        <Line type="monotone" dataKey="g" name="السكر" stroke="var(--color-glucose)" strokeWidth={2.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
