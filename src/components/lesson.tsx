import { useState } from "react";
import { Scale } from "lucide-react";

const QUESTIONS = [
  {
    q: "ما القيمة المرجعية التقريبية للسكر الدموي؟",
    options: ["0.1 غ/ل", "1 غ/ل", "5 غ/ل", "10 غ/ل"],
    answer: 1,
    why: "الكتاب يعتمد حوالي 1 غ/ل، ضمن مجال عادٍ يمتد تقريباً من 0.8 إلى 1.2 غ/ل.",
  },
  {
    q: "من يفرز الأنسولين؟",
    options: ["الخلايا α", "الخلايا β", "العنبات البنكرياسية", "الخلايا الكبدية"],
    answer: 1,
    why: "الخلايا β في جزر لانجرهانس تفرز الأنسولين عند ارتفاع الغلوكوز. العنبات تفرز الإنزيمات الهاضمة.",
  },
  {
    q: "ما أثر الأنسولين على الكبد؟",
    options: [
      "يوقف دخول الغلوكوز نهائياً",
      "ينشّط تركيب الغليكوجين ويثبّط إماهته",
      "يحرر غلوكوز العضل إلى الدم",
      "يحوّل الكبد إلى غدة عصبية",
    ],
    answer: 1,
    why: "الأنسولين هرمون خافض للسكر: ادخار وتحفيز الاستعمال، ومنع إنتاج الغلوكوز الكبدي.",
  },
  {
    q: "لماذا لا يرفع غليكوجين العضل سكر الدم؟",
    options: [
      "لأن العضل لا يخزن الغليكوجين",
      "لغياب إنزيم غلوكوز-6-فوسفاتاز",
      "لأن الدم لا يصل إلى العضل",
      "لأن الغلوكاغون يُصنع داخل العضل",
    ],
    answer: 1,
    why: "العضل يهدم غليكوجينه لحاجته. من دون غلوكوز-6-فوسفاتاز لا يستطيع إخراج غلوكوز حر إلى الدم. الكبد يملك هذا الإنزيم.",
  },
  {
    q: "الغلوكاغون يؤثر أساساً في:",
    options: ["الكبد", "هضم النشا في الفم", "إيقاف القلب", "تحرير غلوكوز العضل نحو الدم"],
    answer: 0,
    why: "ينشّط إماهة الغليكوجين الكبدي واستحداث الغلوكوز. ليس له أثر محرّر على مخزون العضل.",
  },
  {
    q: "ما الخلل في الداء السكري من النمط الأول؟",
    options: [
      "مقاومة الخلايا للأنسولين مع خلايا β سليمة",
      "نقص الأنسولين بسبب تخريب الخلايا β",
      "غياب الكبد",
      "ارتفاع السكر لأن الدم يتوقف عن الدوران",
    ],
    answer: 1,
    why: "النمط الأول خلل في اللواقط المفرِزة: الخلايا β تُخرَّب فيقل الأنسولين، والعلاج تعويضه بالحقن. النمط الثاني مقاومة للأنسولين أساساً.",
  },
];

export function Lesson() {
  return (
    <section id="lesson" className="mx-auto max-w-6xl px-5 py-14">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-primary">الدرس</p>
        <h2 className="mt-2 text-3xl text-ink md:text-4xl">ما يُطلب في النمذجة</h2>
        <p className="mt-3 text-muted">
          صياغة وفق مقرر علوم الطبيعة والحياة للسنة الثانية ثانوي، شعبة علوم تجريبية. المقدار المنظَّم يُسمّى أيضاً العامل المراقب.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-line bg-surface p-5">
          <h3 className="text-xl text-ink">عناصر الجهاز</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <Item k="المقدار المنظَّم" v="تركيز الغلوكوز في الدم" />
            <Item k="القيمة المرجعية" v="حوالي 1 غ/ل" />
            <Item k="اللواقط" v="خلايا β وخلايا α" />
            <Item k="الرسالتان" v="أنسولين وغلوكاغون" />
            <Item k="الناقل" v="الدم" />
            <Item k="المنفذات" v="الكبد، العضل، النسيج الدهني" />
            <Item k="التصحيح" v="تنظيم رجعي سالب" />
          </dl>
        </article>
        <article className="min-w-0 rounded-3xl border border-line bg-surface p-5 md:col-span-2">
          <h3 className="text-xl text-ink">الأنسولين مقابل الغلوكاغون</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[32rem] text-right text-sm">
              <thead className="text-muted">
                <tr className="border-b border-line">
                  <th className="py-2 font-medium"> </th>
                  <th className="py-2 font-medium">الأنسولين</th>
                  <th className="py-2 font-medium">الغلوكاغون</th>
                </tr>
              </thead>
              <tbody className="text-ink">
                <Row a="الخلايا المفرِزة" b="β" c="α" />
                <Row a="يُفرز عندما" b="يرتفع السكر" c="ينخفض السكر" />
                <Row a="الأثر على التركيز" b="خافض" c="رافع" />
                <Row a="على الكبد" b="تركيب الغليكوجين" c="إماهة الغليكوجين واستحداث الغلوكوز" />
                <Row a="على العضل" b="دخول الغلوكوز وادخاره" c="لا يحرر مخزون العضل" />
              </tbody>
            </table>
          </div>
        </article>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border border-line bg-surface p-5">
          <h3 className="text-xl text-ink">تجارب تُبنى عليها النمذجة</h3>
          <ol className="mt-4 list-decimal space-y-3 pe-5 text-sm leading-6 text-ink">
            <li>كلود برنار: الكبد المغسول يخلو دمُه من الغلوكوز ثم يعاود تحريره. الكبد مخزن ومصدر.</li>
            <li>فون ميرينغ ومينكوفسكي: استئصال البنكرياس يسبب فرط سكر وبوالاً سكرياً.</li>
            <li>بانتنغ وبست: بعد ضمور العنبات بربط القناة، استُخلص من الجزر هرمون يعيد السكر.</li>
            <li>بنكرياس معزول مروي: يغيّر إفرازه حسب غلوكوز السائل. الجزيرة لاقط ومنفّذ إفرازي.</li>
            <li>قطع التعصيب لا يمنع التصحيح. الرسالة هرمونية ينقلها الدم.</li>
          </ol>
        </article>
        <article className="rounded-3xl border border-line bg-surface p-5">
          <h3 className="text-xl text-ink">حين يختل النموذج</h3>
          <div className="mt-4 space-y-4 text-sm leading-6">
            <p>
              <span className="font-semibold text-ink">النمط الأول. </span>
              <span className="text-muted">تخريب الخلايا β ونقص الأنسولين. السكر يرتفع بعد الوجبة ولا يعود وحده. العلاج تعويض الهرمون بالحقن، مع مراقبة التركيز.</span>
            </p>
            <p>
              <span className="font-semibold text-ink">النمط الثاني. </span>
              <span className="text-muted">الأنسولين قد يكون حاضراً لكن الخلايا المستهدفة تقاومه. يرتبط غالباً بالوزن الزائد وقلة النشاط، ويُدبر بالحمية والدواء وقد يُستعمل الأنسولين.</span>
            </p>
            <p className="text-muted">من علامات الفرط: عطش شديد، بوال، وفي النمط الأول نقص وزن. هذه علامات درس، لا تشخيص.</p>
          </div>
        </article>
      </div>
    </section>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-line pb-2">
      <dt className="text-muted">{k}</dt>
      <dd className="text-end font-medium text-ink">{v}</dd>
    </div>
  );
}

function Row({ a, b, c }: { a: string; b: string; c: string }) {
  return (
    <tr className="border-b border-line">
      <th className="py-3 font-medium text-muted">{a}</th>
      <td className="py-3">{b}</td>
      <td className="py-3">{c}</td>
    </tr>
  );
}

export function Quiz() {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const question = QUESTIONS[step];

  function choose(index: number) {
    if (picked != null) return;
    setPicked(index);
    if (index === question.answer) setScore((value) => value + 1);
  }

  function next() {
    if (step === QUESTIONS.length - 1) {
      setDone(true);
      return;
    }
    setStep((value) => value + 1);
    setPicked(null);
  }

  return (
    <section id="quiz" className="mx-auto max-w-6xl px-5 py-14">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-primary">المختبر</p>
        <h2 className="mt-2 text-3xl text-ink md:text-4xl">راجع قبل العرض</h2>
      </div>
      <div className="mt-6 max-w-3xl rounded-3xl border border-line bg-surface p-5">
        {done ? (
          <div>
            <p className="font-display text-4xl text-primary">{score} / {QUESTIONS.length}</p>
            <p className="mt-3 text-ink">
              {score >= 5
                ? "المفاهيم الأساسية حاضرة. في العرض الشفهي ابدأ بالقيمة المرجعية، ثم سمِّ اللواقط والرسالتين والمنفّذ، واختم بحلقة التنظيم الرجعي السالب."
                : "أعد المحطتين الثالثة والرابعة، ثم قارن جدول الهرمونين قبل أن تعيد المحاولة."}
            </p>
            <button
              type="button"
              className="btn btn-primary mt-5"
              onClick={() => {
                setStep(0);
                setPicked(null);
                setScore(0);
                setDone(false);
              }}
            >
              إعادة المختبر
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted">سؤال {step + 1} من {QUESTIONS.length}</p>
            <h3 className="mt-2 text-xl text-ink">{question.q}</h3>
            <div className="mt-4 grid gap-2">
              {question.options.map((option, index) => {
                const revealed = picked != null;
                const correct = index === question.answer;
                const mine = index === picked;
                const cls = !revealed
                  ? "btn btn-ghost justify-start"
                  : correct
                    ? "btn btn-on justify-start"
                    : mine
                      ? "btn btn-ghost justify-start border-glucose text-glucose"
                      : "btn btn-ghost justify-start";
                return (
                  <button key={option} type="button" className={cls} onClick={() => choose(index)}>
                    {option}
                  </button>
                );
              })}
            </div>
            {picked != null ? <p className="mt-4 text-sm leading-6 text-muted">{question.why}</p> : null}
            {picked != null ? (
              <button type="button" className="btn btn-primary mt-4" onClick={next}>
                {step === QUESTIONS.length - 1 ? "النتيجة" : "السؤال التالي"}
              </button>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}

export function Close() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-5 py-14">
        <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-fg">
          <Scale className="size-6" />
        </span>
        <p className="text-sm font-semibold text-primary">نهاية الرحلة، بداية السؤال</p>
        <p className="font-display text-3xl text-ink md:text-4xl">كل وجبة امتحان للميزان، وكل ميزان يعيده هرمون.</p>
        <p className="max-w-2xl text-sm leading-6 text-muted">
          مشروع نمذجة لتنظيم نسبة السكر في الدم. المحتوى تعليمي مبسّط لمقرر الثانية ثانوي علوم تجريبية، وليس بديلاً عن الكتاب ولا أداة تشخيص أو علاج.
        </p>
      </div>
    </footer>
  );
}
