import { Scale } from "lucide-react";

const LINKS = [
  { href: "#top", label: "الرئيسية" },
  { href: "#journey", label: "الرحلة" },
  { href: "#model", label: "النموذج" },
  { href: "#lesson", label: "الدرس" },
  { href: "#quiz", label: "المختبر" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <a href="#top" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-fg">
            <Scale className="size-5" />
          </span>
          <span>
            <span className="block font-display text-base font-semibold leading-5">ميزان السكر</span>
            <span className="block text-xs text-muted">نمذجة تنظيم الغلوكوز</span>
          </span>
        </a>
        <nav className="flex min-w-0 flex-1 justify-end gap-1 overflow-x-auto text-sm">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="shrink-0 rounded-full px-3 py-2 text-ink hover:bg-primary-soft">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <section id="top" className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-20">
      <div>
        <p className="text-sm font-semibold text-primary">السنة الثانية ثانوي · علوم تجريبية</p>
        <h1 className="mt-3 text-4xl leading-tight text-ink md:text-6xl">ثبات السكر في الدم</h1>
        <p className="mt-4 text-lg leading-8 text-muted">
          موقع تفاعلي على نسق رحلة الاستكشاف: من الدم إلى البنكرياس، ثم إلى الرسالتين، ثم إلى الخلية الكبدية. بعده نموذج يتحرك: وجبة، صيام، جهد، أو سكري.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a className="btn btn-primary" href="#journey">
            ابدأ الرحلة
          </a>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              document.getElementById("model")?.scrollIntoView({ behavior: "smooth" });
              window.dispatchEvent(new Event("gly:play"));
            }}
          >
            شغّل النموذج
          </button>
        </div>
      </div>
      <Gauge />
    </section>
  );
}

function polar(cx: number, cy: number, r: number, angle: number) {
  const rad = (angle * Math.PI) / 180;
  return [cx + Math.cos(rad) * r, cy + Math.sin(rad) * r];
}

function arc(start: number, end: number) {
  const [x1, y1] = polar(140, 140, 96, start);
  const [x2, y2] = polar(140, 140, 96, end);
  const large = end - start > 180 ? 1 : 0;
  return `M ${Math.round(x1)} ${Math.round(y1)} A 96 96 0 ${large} 1 ${Math.round(x2)} ${Math.round(y2)}`;
}

function Gauge() {
  const start = 150;
  const sweep = 240;
  const at = (value: number) => start + ((value - 0.4) / 1.6) * sweep;
  const [nx, ny] = polar(140, 140, 72, at(1));
  const x2 = Math.round(nx);
  const y2 = Math.round(ny);
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-surface p-6">
      <svg viewBox="0 0 280 230" className="mx-auto w-full max-w-sm" role="img" aria-label="مؤشر عند القيمة المرجعية 1 غرام في اللتر">
        <path d={arc(start, start + sweep)} className="fill-none stroke-line" strokeWidth="16" strokeLinecap="round" />
        <path d={arc(at(0.8), at(1.2))} className="fill-none stroke-primary" strokeWidth="16" strokeLinecap="round" />
        <line x1="140" y1="140" x2={x2} y2={y2} className="stroke-glucose" strokeWidth="4" strokeLinecap="round" />
        <circle cx="140" cy="140" r="7" className="fill-glucose" />
        <text x="140" y="172" textAnchor="middle" fontSize="28" fontFamily="var(--font-display)" className="fill-ink">
          1.00
        </text>
        <text x="140" y="194" textAnchor="middle" fontSize="14" fontFamily="var(--font-sans)" className="fill-muted">
          غ/ل
        </text>
      </svg>
      <p className="text-center text-sm text-muted">القيمة المرجعية في الراحة، والمجال الأخضر هو 0.8 إلى 1.2 غ/ل.</p>
    </div>
  );
}
