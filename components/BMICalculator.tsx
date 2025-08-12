// components/BMICalculator.tsx
import { useState, useMemo } from "react";
import Link from "next/link";

type UnitSystem = "metric" | "imperial";

const BMICalculator = () => {
  const [unit, setUnit] = useState<UnitSystem>("metric");

  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weightLb, setWeightLb] = useState("");
  const [touched, setTouched] = useState(false);

  const ftInToMeters = (ft: number, inch: number) => ((ft * 12 + inch) * 2.54) / 100;
  const lbToKg = (lb: number) => lb * 0.45359237;

  const parsedH = useMemo(() => {
    if (unit === "metric") {
      const cm = parseFloat(heightCm);
      if (!Number.isFinite(cm)) return NaN;
      return cm / 100;
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      if (ft <= 0 && inch <= 0) return NaN;
      return ftInToMeters(ft, inch);
    }
  }, [unit, heightCm, heightFt, heightIn]);

  const parsedW = useMemo(() => {
    if (unit === "metric") {
      const kg = parseFloat(weightKg);
      if (!Number.isFinite(kg)) return NaN;
      return kg;
    } else {
      const lb = parseFloat(weightLb);
      if (!Number.isFinite(lb)) return NaN;
      return lbToKg(lb);
    }
  }, [unit, weightKg, weightLb]);

  const isValid =
    Number.isFinite(parsedH) &&
    Number.isFinite(parsedW) &&
    parsedH > 0 &&
    parsedW > 0 &&
    parsedH < 3 &&
    parsedW < 400;

  const bmi = useMemo(() => {
    if (!isValid) return null;
    const v = parsedW / (parsedH * parsedH);
    return Math.round(v * 100) / 100;
  }, [isValid, parsedH, parsedW]);

  const category = (val: number | null) => {
    if (val == null) return "";
    if (val < 18.5) return "Underweight";
    if (val < 25) return "Normal weight";
    if (val < 30) return "Overweight";
    return "Obesity";
  };

  const error =
    touched && !isValid
      ? unit === "metric"
        ? "Please enter a realistic height (cm) and weight (kg)."
        : "Please enter a realistic height (ft/in) and weight (lb)."
      : "";

  const switchTo = (next: UnitSystem) => {
    setUnit(next);
    setTouched(false);
  };

  return (
    <>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-3 text-sm text-neutral-600">
        <ol className="inline-flex items-center gap-2">
          <li><Link href="/" className="hover:underline">Home</Link></li>
          <li aria-hidden>›</li>
          <li className="text-neutral-900 font-medium">BMI Calculator</li>
        </ol>
      </nav>

      <section aria-labelledby="bmi-title" className="mb-4">
        <h1 id="bmi-title" className="text-xl font-semibold tracking-tight md:text-2xl">
          BMI Calculator
        </h1>
        <p className="mt-2 text-sm text-neutral-600 md:text-base">
          Quick result. Mobile-first. No distractions.
        </p>
      </section>

      <section
        aria-label="BMI form"
        className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm md:p-6"
      >
        {/* Unit Toggle */}
        <div className="mb-4 inline-flex rounded-xl border border-neutral-200 p-1">
          <button
            type="button"
            onClick={() => switchTo("metric")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              unit === "metric" ? "bg-neutral-900 text-white" : "text-neutral-700 hover:bg-neutral-100"
            }`}
            aria-pressed={unit === "metric"}
          >
            cm / kg
          </button>
          <button
            type="button"
            onClick={() => switchTo("imperial")}
            className={`ml-1 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              unit === "imperial" ? "bg-neutral-900 text-white" : "text-neutral-700 hover:bg-neutral-100"
            }`}
            aria-pressed={unit === "imperial"}
          >
            ft/in / lb
          </button>
        </div>

        <form
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
          onSubmit={(e) => e.preventDefault()}
          onChange={() => setTouched(true)}
        >
          {unit === "metric" ? (
            <div className="flex flex-col">
              <label htmlFor="heightCm" className="text-sm font-medium text-neutral-800">Height</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  id="heightCm" inputMode="decimal" type="number" placeholder="e.g. 175"
                  value={heightCm} onChange={(e) => setHeightCm(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-neutral-900 outline-none ring-neutral-900/10 placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2"
                  aria-describedby="heightCm-help"
                />
                <span className="text-sm text-neutral-600">cm</span>
              </div>
              <p id="heightCm-help" className="mt-1 text-xs text-neutral-500">Enter height in centimeters.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-neutral-800">Height</span>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <input
                    id="heightFt" inputMode="numeric" type="number" placeholder="e.g. 5"
                    value={heightFt} onChange={(e) => setHeightFt(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-neutral-900 outline-none ring-neutral-900/10 placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2"
                  />
                  <label htmlFor="heightFt" className="text-sm text-neutral-600">ft</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="heightIn" inputMode="decimal" type="number" placeholder="e.g. 9"
                    value={heightIn} onChange={(e) => setHeightIn(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-neutral-900 outline-none ring-neutral-900/10 placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2"
                  />
                  <label htmlFor="heightIn" className="text-sm text-neutral-600">in</label>
                </div>
              </div>
              <p className="mt-1 text-xs text-neutral-500">Enter feet and inches.</p>
            </div>
          )}

          {unit === "metric" ? (
            <div className="flex flex-col">
              <label htmlFor="weightKg" className="text-sm font-medium text-neutral-800">Weight</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  id="weightKg" inputMode="decimal" type="number" placeholder="e.g. 70"
                  value={weightKg} onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-neutral-900 outline-none ring-neutral-900/10 placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2"
                />
                <span className="text-sm text-neutral-600">kg</span>
              </div>
              <p className="mt-1 text-xs text-neutral-500">Enter weight in kilograms.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              <label htmlFor="weightLb" className="text-sm font-medium text-neutral-800">Weight</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  id="weightLb" inputMode="decimal" type="number" placeholder="e.g. 154"
                  value={weightLb} onChange={(e) => setWeightLb(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-neutral-900 outline-none ring-neutral-900/10 placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2"
                />
                <span className="text-sm text-neutral-600">lb</span>
              </div>
              <p className="mt-1 text-xs text-neutral-500">Enter weight in pounds.</p>
            </div>
          )}

          <div className="md:col-span-2">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-sm text-neutral-600">Your BMI</p>
                  <p className="mt-1 text-2xl font-semibold text-neutral-900">{bmi ?? "—"}</p>
                </div>
                <div className="text-sm">
                  <span className="text-neutral-600">Category:</span>{" "}
                  <span className="font-medium text-neutral-900">{category(bmi)}</span>
                </div>
              </div>
              {error ? (
                <p className="mt-3 text-sm text-red-600">{error}</p>
              ) : (
                <p className="mt-3 text-sm text-neutral-600">BMI = weight ÷ (height in meters)²</p>
              )}
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default BMICalculator;
