export type BodyMode = "healthy" | "type1";
export type Scenario = "rest" | "meal" | "fast" | "exercise";

export type Sample = {
  t: number;
  g: number;
  insulin: number;
  glucagon: number;
  liver: number;
  muscle: number;
};

export type SimInput = {
  mode: BodyMode;
  scenario: Scenario;
  minutes?: number;
  shotAt?: number | null;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function round3(value: number) {
  return Math.round(value * 1000) / 1000;
}

export function simulate(input: SimInput): Sample[] {
  const minutes = input.minutes ?? 180;
  const shotAt = input.shotAt ?? null;
  let g = input.scenario === "fast" ? 0.92 : 1;
  let beta = input.mode === "type1" ? 0.04 : 0.32;
  let glucagon = input.scenario === "fast" ? 0.5 : input.scenario === "exercise" ? 0.36 : 0.3;
  let liver = input.scenario === "fast" ? 0.62 : 0.76;
  let muscle = input.scenario === "exercise" ? 0.72 : 0.58;
  const samples: Sample[] = [];

  for (let t = 0; t <= minutes; t += 1) {
    const meal =
      input.scenario === "meal" ? 0.03 * Math.exp(-0.5 * ((t - 34) / 14) ** 2) : 0;
    const exercise = input.scenario === "exercise";
    const since = shotAt == null ? -1 : t - shotAt;
    const injected =
      since < 0 ? 0 : since < 30 ? 0.92 : 0.92 * Math.exp(-(since - 30) / 80);
    const insulin = clamp(beta + injected, 0, 1);

    samples.push({
      t,
      g: round3(g),
      insulin: round3(insulin),
      glucagon: round3(glucagon),
      liver: round3(liver),
      muscle: round3(muscle),
    });

    const error = g - 1;
    let betaTarget = 0.04;
    let glucagonTarget = 0.22;
    if (input.mode === "healthy") {
      betaTarget = clamp(
        0.32 + Math.max(error, 0) * 1.7 + Math.min(error, 0) * 0.4 - (exercise ? 0.1 : 0),
        0.06,
        1,
      );
      glucagonTarget = clamp(0.3 - error * 1.65 + (exercise ? 0.28 : 0), 0.05, 1);
      glucagonTarget *= 1 - 0.35 * Math.max(0, insulin - 0.3);
    } else {
      betaTarget = 0.04;
      glucagonTarget = clamp(0.22 + Math.max(-error, 0) * 0.9, 0.12, 0.75);
    }

    beta = clamp(beta + (betaTarget - beta) * 0.055, 0, 1);
    glucagon = clamp(glucagon + (glucagonTarget - glucagon) * 0.05, 0, 1);

    const liverGate = clamp(0.62 + liver * 0.5, 0.4, 1.2);
    const disposal = (0.00215 + 0.0098 * insulin + (exercise ? 0.0048 : 0)) * clamp(g, 0.3, 3.5);
    const production = 0.0077 * (0.4 + glucagon) * (1.2 - 0.72 * insulin) * liverGate;

    g = clamp(g + meal + production - disposal, 0.35, 3.9);
    liver = clamp(
      liver +
        0.011 * insulin * Math.max(0, g - 1.02) -
        0.007 * glucagon * Math.max(0, 0.98 - g) -
        (input.scenario === "fast" ? 0.0007 : 0) -
        (exercise ? 0.0009 : 0),
      0.08,
      0.96,
    );
    muscle = clamp(
      muscle + 0.0036 * insulin * Math.max(0, g - 0.95) - (exercise ? 0.0025 : 0.00012),
      0.06,
      0.96,
    );
  }

  return samples;
}

export function glycemiaState(g: number): "low" | "normal" | "high" {
  if (g < 0.8) return "low";
  if (g > 1.2) return "high";
  return "normal";
}

export const STATE_LABEL = {
  low: "نقص سكر",
  normal: "ضمن المجال العادي",
  high: "فرط سكر",
} as const;

export function narrate(sample: Sample, mode: BodyMode, scenario: Scenario, shotAt: number | null) {
  const shotActive = shotAt != null && sample.t >= shotAt && sample.t < shotAt + 110;
  if (mode === "healthy" && shotActive && sample.g < 0.85) {
    return "حقن الأنسولين في عضوية ما زالت تفرزه قد يُنزل السكر تحت المجال. خلايا α تتدخل عندها بالغلوكاغون، والكبد يحرر غلوكوزاً للتصحيح.";
  }
  if (mode === "type1" && sample.g > 1.25 && sample.insulin < 0.25) {
    return "خلايا β معطّلة فلا رسالة أنسولين. الغلوكوز الذي يدخل الدم لا يُخزَّن كما ينبغي، ويبقى السكر مرتفعاً. الخلل في اللواقط المفرِزة لا في الدم نفسه.";
  }
  if (shotActive && sample.g > 1.05) {
    return "الأنسولين المحقون يعوّض الهرمون الناقص. الخلايا تسحب الغلوكوز، والكبد يركّب الغليكوجين، فينزل التركيز نحو 1 غ/ل.";
  }
  if (sample.g > 1.2 && sample.insulin >= sample.glucagon) {
    return "ارتفاع السكر تنبّهه الخلايا β في جزر لانجرهانس. الأنسولين، ينقله الدم، فينشّط ادخار الغليكوجين واستعمال الغلوكوز في الكبد والعضل والنسيج الدهني.";
  }
  if (sample.g < 0.8 && sample.glucagon >= sample.insulin) {
    return "انخفاض السكر تنبّهه الخلايا α. الغلوكاغون يصل إلى الكبد فيُماه الغليكوجين ويُستحدث الغلوكوز. غليكوجين العضل لا يخرج إلى الدم.";
  }
  if (scenario === "fast") {
    return "في الصيام لا مدخول غذائياً. الخلايا α تفرز الغلوكاغون، والكبد يُميه الغليكوجين ويستحدث الغلوكوز، فيثبت السكر بينما ينخفض المخزون.";
  }
  if (scenario === "exercise") {
    return "الجهد يستهلك غلوكوز العضل. العضل يهدم غليكوجينه لحاجته، والغلوكاغون يدفع الكبد لدعم الدم. لذلك يبقى السكر قريباً من 1 غ/ل رغم المجهود.";
  }
  if (sample.g >= 0.8 && sample.g <= 1.2) {
    return "التركيز عاد نحو القيمة المرجعية 1 غ/ل. هذا تصحيح بتنظيم رجعي سالب: كل ابتعاد يطلق رسالة تعيد المقدار.";
  }
  return "الجهاز المنظِّم يقارن سكر الدم بالقيمة المرجعية، ثم يرسل أنسوليناً أو غلوكاغوناً عبر الدم.";
}

export const SCENARIOS: { id: Scenario; label: string; hint: string }[] = [
  { id: "rest", label: "راحة", hint: "استهلاك قاعدي وسكر ثابت" },
  { id: "meal", label: "وجبة سكرية", hint: "امتصاص الغلوكوز من المعي" },
  { id: "fast", label: "صيام", hint: "لا مدخول، والكبد يعوّض" },
  { id: "exercise", label: "جهد عضلي", hint: "العضل يستهلك الغلوكوز" },
];
