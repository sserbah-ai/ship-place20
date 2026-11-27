import { useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, RotateCcw } from "lucide-react";
import { ClayStage } from "@/components/clay-stage";
import { STAGES, type StageId } from "@/lib/stages";

export function Journey() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(STAGES[0].spots[0].id);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState<{ x: number; y: number; px: number; py: number } | null>(null);
  const stage = STAGES[index];
  const spot = stage.spots.find((item) => item.id === selected) ?? stage.spots[0];

  function go(next: number) {
    const safe = (next + STAGES.length) % STAGES.length;
    setIndex(safe);
    setSelected(STAGES[safe].spots[0].id);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }

  return (
    <section id="journey" className="mx-auto max-w-6xl px-5 py-14">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-primary">الرحلة</p>
        <h2 className="mt-2 text-3xl text-ink md:text-4xl">من العضوية إلى جزيء الغليكوجين</h2>
        <p className="mt-3 text-muted">
          اضغط البقع كما في مجسم يُدار باليد. كل محطة تقرّبك من مكان اتخاذ القرار: قياس السكر، ثم الرسالة، ثم أثرها في الكبد.
        </p>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {STAGES.map((item, itemIndex) => (
          <button
            key={item.id}
            type="button"
            onClick={() => go(itemIndex)}
            className={itemIndex === index ? "btn btn-on shrink-0" : "btn btn-ghost shrink-0"}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="mt-4 grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.8fr)]">
        <div className="overflow-hidden rounded-3xl border border-line bg-surface">
          <div
            className="relative aspect-square"
            onPointerDown={(event) => {
              if (event.pointerType === "touch") return;
              const target = event.target as HTMLElement;
              if (target.closest("button")) return;
              event.currentTarget.setPointerCapture(event.pointerId);
              setDrag({ x: pan.x, y: pan.y, px: event.clientX, py: event.clientY });
            }}
            onPointerMove={(event) => {
              if (!drag) return;
              setPan({
                x: drag.x + event.clientX - drag.px,
                y: drag.y + event.clientY - drag.py,
              });
            }}
            onPointerUp={() => setDrag(null)}
          >
            <div
              className="h-full w-full origin-center"
              style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
            >
              <ClayStage stage={stage.id as StageId} selected={spot.id} label={stage.title} />
              {stage.spots.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={item.title}
                  onClick={() => setSelected(item.id)}
                  className="absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
                  style={{ left: `${item.x * 100}%`, top: `${item.y * 100}%` }}
                >
                  <span className="size-3 rounded-full bg-primary" />
                </button>
              ))}
            </div>
            <div className="absolute bottom-3 left-3 flex gap-2">
              <button type="button" className="btn btn-ghost size-11 px-0" aria-label="تكبير" onClick={() => setZoom((value) => Math.min(1.8, value + 0.2))}>
                <Plus className="size-4" />
              </button>
              <button type="button" className="btn btn-ghost size-11 px-0" aria-label="تصغير" onClick={() => setZoom((value) => Math.max(1, value - 0.2))}>
                <Minus className="size-4" />
              </button>
              <button
                type="button"
                className="btn btn-ghost size-11 px-0"
                aria-label="إعادة وضع المجسم"
                onClick={() => {
                  setZoom(1);
                  setPan({ x: 0, y: 0 });
                }}
              >
                <RotateCcw className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <aside className="flex flex-col rounded-3xl border border-line bg-surface p-5">
          <p className="text-sm font-semibold text-primary">{stage.kicker}</p>
          <h3 className="mt-2 text-2xl text-ink">{stage.title}</h3>
          <p className="mt-3 text-sm leading-6 text-muted">{stage.lede}</p>
          <div className="mt-5 rounded-2xl bg-primary-soft p-4">
            <p className="text-sm font-semibold text-primary-deep">{spot.title}</p>
            <p className="mt-2 text-sm leading-6 text-ink">{spot.text}</p>
          </div>
          <div className="mt-4 grid gap-2">
            {stage.spots.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected(item.id)}
                className={item.id === spot.id ? "btn btn-on justify-start" : "btn btn-ghost justify-start"}
              >
                {item.title}
              </button>
            ))}
          </div>
          <div className="mt-auto flex gap-2 pt-5">
            <button type="button" className="btn btn-ghost flex-1" onClick={() => go(index - 1)}>
              <ChevronRight className="size-4" />
              السابقة
            </button>
            {index === STAGES.length - 1 ? (
              <a className="btn btn-primary flex-1" href="#model">
                إلى النموذج
                <ChevronLeft className="size-4" />
              </a>
            ) : (
              <button type="button" className="btn btn-primary flex-1" onClick={() => go(index + 1)}>
                التالية
                <ChevronLeft className="size-4" />
              </button>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
