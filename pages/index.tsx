import Head from "next/head";
import Link from "next/link";
import Layout from "../components/layout";
import Calculator from "../components/Calculator";

export default function Home() {
  // Liste für „Other Calculators“ – leicht erweiterbar
  const tools = [
    {
      href: "/percentage-calculator",
      title: "Percentage Calculator",
      desc: "Quick percent, discounts, increase/decrease.",
      emoji: "🔢",
    },
    {
      href: "/bmi-calculator",
      title: "BMI Calculator",
      desc: "Body mass index with instant result.",
      emoji: "⚖️",
    },
    // später einfach weitere Objekte hinzufügen
  ];

  return (
    <Layout>
      <Head>
        <title>Basic Calculator | Calculator Hub</title>
        <meta
          name="description"
          content="Fast and clean calculators. Start with our basic calculator and explore more tools below."
        />
      </Head>

      {/* Hero + Intro (kurz, damit der Rechner sofort sichtbar bleibt) */}
      <section aria-labelledby="hero-title" className="mb-4">
        <h1 id="hero-title" className="text-xl font-semibold tracking-tight md:text-2xl">
          <Link href="/">Basic Calculator</Link>
        </h1>
        <p className="mt-2 text-sm text-neutral-600 md:text-base">
          Fast, reliable, no sign‑up. Built for quick results.
        </p>
      </section>

      {/* Rechner-Container (nur Umgebung, NICHT der Rechner selbst) */}
      <section
        aria-labelledby="calc-title"
        className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm md:p-5"
      >
        <h2 id="calc-title" className="sr-only">
          Basic Calculator
        </h2>
        <Calculator />
      </section>

      {/* Weitere Rechner */}
      <section aria-labelledby="others-title" className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h3 id="others-title" className="text-lg font-semibold tracking-tight md:text-xl">
              Other Calculators
            </h3>
            <p className="mt-1 text-sm text-neutral-600">
              Popular tools you can use in seconds.
            </p>
          </div>
          <Link
            href="/calculators"
            className="hidden text-sm font-medium text-neutral-900 hover:underline md:inline"
          >
            Browse all
          </Link>
        </div>

        {/* Grid mit Kacheln, mobile-first */}
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <li key={t.href}>
              <Link
                href={t.href}
                className="group block rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
                aria-label={t.title}
              >
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-lg"
                  >
                    {t.emoji}
                  </span>
                  <div className="min-w-0">
                    <h4 className="truncate text-base font-semibold text-neutral-900">
                      {t.title}
                    </h4>
                    <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{t.desc}</p>
                  </div>
                </div>
                <div className="mt-4 text-sm font-medium text-neutral-900 opacity-0 transition group-hover:opacity-100">
                  Open →
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile „Browse all“ Link unten */}
        <div className="mt-6 md:hidden">
          <Link href="/calculators" className="text-sm font-medium text-neutral-900 hover:underline">
            Browse all calculators →
          </Link>
        </div>
      </section>
    </Layout>
  );
}