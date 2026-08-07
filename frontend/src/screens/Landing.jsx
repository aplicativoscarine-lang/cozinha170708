import React, { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { NAV_GROUPS } from "@/lib/nav-groups";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ArrowRight,
  Check,
  GraduationCap,
  Calculator,
  Store,
  ShieldCheck,
  Loader2,
} from "lucide-react";

// ---------- Configuração comercial única ----------
const PRICE_TOTAL = 57;
const PRICE_INSTALLMENTS = 12;
const PRICE_INSTALLMENT_VALUE = 5.70; // 12x de R$ 5,70
const STRIPE_LOOKUP_KEY = "cozinha_lucrativa_57";

// Ícone visual do topo de cada card — reforça a "capitânia" da coluna
const PILLAR_ICONS = {
  aprender: GraduationCap,
  vender: Calculator,
  marca: Store,
};

// 8 produtos-destaque (grid compacto — foco em conversão, sem trilhas)
const PRODUCTS = [
  { slug: "bolos-caseiros",     label: "Bolos Caseiros",         image: "/images/bolo-caseiro.jpg" },
  { slug: "iogurtes-gourmet",   label: "Iogurtes Gourmet",       image: "/images/iogurtes-gourmet.png" },
  { slug: "brigadeiro-gourmet", label: "Brigadeiro Gourmet",     image: "/images/brigadeiro-gourmet.png" },
  { slug: "geladinhos",         label: "Geladinhos Gourmet",     image: "/images/geladinho.jpg" },
  { slug: "kids",               label: "Lanches Kids",           image: "/images/alimento-saudavel.png" },
  { slug: "pascoa",             label: "Ovos & Chocolates",      image: "/images/ovo-pascoa.jpg" },
  { slug: "sem-lactose",        label: "Sem Lactose",            image: "/images/sem-lactose.png" },
  { slug: "sem-gluten",         label: "Sem Glúten",             image: "/images/sem-gluten.jpg" },
];

const CHECKLIST = [
  "10 especialidades + 2 cursos bônus",
  "Mais de 120 aulas passo a passo",
  "Calculadora de Lucro por produto",
  "Vitrine profissional com link único",
  "Painel de encomendas e clientes",
  "Caderno de anotações com IA",
  "Kit de marketing e scripts de WhatsApp",
  "Acesso liberado por 12 meses sem mensalidade",
];

function formatBRL(v) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function useCheckout() {
  const [loading, setLoading] = useState(false);
  const start = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await api.post("/payments/checkout", {
        lookup_key: STRIPE_LOOKUP_KEY,
        origin_url: window.location.origin,
      });
      if (!data?.checkout_url) throw new Error("checkout_url ausente");
      window.location.assign(data.checkout_url);
    } catch (err) {
      setLoading(false);
      const msg =
        err?.response?.data?.detail ||
        "Não conseguimos abrir o pagamento agora. Tente novamente em instantes.";
      toast.error(msg);
    }
  };
  return { start, loading };
}

function CTAButton({ testId, size = "md", start, loading, label = "Quero Começar Agora" }) {
  const sizeCls =
    size === "lg"
      ? "px-10 py-7 text-base"
      : size === "sm"
        ? "px-6 py-4 text-xs"
        : "px-8 py-6 text-sm";
  return (
    <Button
      data-testid={testId}
      onClick={start}
      disabled={loading}
      className={`group rounded-full font-bold uppercase tracking-[0.18em] text-white shadow-[0_12px_40px_rgba(217,119,6,0.45)] transition-all hover:shadow-[0_18px_60px_rgba(217,119,6,0.65)] disabled:cursor-progress disabled:opacity-90 ${sizeCls}`}
      style={{ background: "linear-gradient(135deg,#D97706,#A24D2A)" }}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Abrindo pagamento…
        </>
      ) : (
        <>
          {label}
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </>
      )}
    </Button>
  );
}

function PriceBlock({ testId }) {
  return (
    <div data-testid={testId} className="mt-6 flex flex-wrap items-baseline gap-3">
      <span className="font-display text-5xl font-black text-[#2E1B12] sm:text-6xl">
        {formatBRL(PRICE_TOTAL)}
      </span>
      <span className="text-sm font-semibold uppercase tracking-widest text-[#5F4A3F]">
        à vista
      </span>
      <span className="w-full text-sm text-[#5F4A3F]">
        ou <strong>{PRICE_INSTALLMENTS}x de {formatBRL(PRICE_INSTALLMENT_VALUE)}</strong>
      </span>
    </div>
  );
}

export default function Landing() {
  const { start, loading } = useCheckout();

  // Pré-carrega config Stripe (útil para diagnósticos e para “aquecer” a rota).
  useEffect(() => {
    api.get("/payments/config").catch(() => {});
  }, []);

  // Se o usuário voltou de um checkout cancelado, mostra um aviso amistoso.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "cancelled") {
      toast("Pagamento cancelado — quando quiser é só clicar em Quero Começar Agora.", {
        icon: "🍰",
      });
      params.delete("payment");
      const clean = window.location.pathname + (params.toString() ? "?" + params.toString() : "");
      window.history.replaceState({}, "", clean);
    }
  }, []);

  const quickChecks = useMemo(
    () => ["Acesso imediato", "12 meses de acesso", "Pagamento único", "Sem renovação automática"],
    []
  );

  return (
    <div data-testid="landing-page" className="text-[#2E1B12]" style={{ backgroundColor: "#FAF6F0" }}>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden">
        {/* Camada de imagem */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("/images/hero.png")',
            backgroundSize: "cover",
            backgroundPosition: "center right",
          }}
        />
        {/* Overlay creme para o texto ficar legível */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(250,246,240,0.97) 0%, rgba(250,246,240,0.92) 40%, rgba(250,246,240,0.55) 65%, rgba(250,246,240,0.15) 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute -top-32 -right-24 h-[520px] w-[520px] rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(216,154,91,0.45), rgba(216,154,91,0))",
          }}
        />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 py-16 md:py-24 lg:px-12 lg:py-32">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#EED3C3] bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#8A3F21] shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              Pagamento único · Stripe seguro
            </div>

            <h1
              className="font-display text-4xl leading-[1.05] text-[#2E1B12] sm:text-5xl lg:text-6xl"
              data-testid="hero-title"
            >
              Transforme sua cozinha em uma{" "}
              <span
                className="italic"
                style={{
                  background: "linear-gradient(135deg,#C96A3D 0%,#8A3F21 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                nova fonte de renda
              </span>
              .
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#4A3529] sm:text-lg">
              Um único aplicativo para <strong>aprender</strong> receitas
              profissionais, <strong>vender</strong> com lucro e cuidar da{" "}
              <strong>sua marca</strong> como uma profissional.
            </p>

            <PriceBlock testId="hero-price" />

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <CTAButton testId="hero-cta" size="lg" start={start} loading={loading} />
            </div>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#4A3529]">
              {quickChecks.map((c) => (
                <li key={c} className="inline-flex items-center gap-2">
                  <Check className="h-4 w-4" style={{ color: "#8A3F21" }} strokeWidth={2.6} />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- 3 PILARES ---------- */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#8A3F21]">
          o método
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl leading-tight text-[#2E1B12] sm:text-4xl">
          Aprender, vender e cuidar da sua marca — no mesmo app.
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {NAV_GROUPS.map((group) => {
            const Icon = PILLAR_ICONS[group.id];
            return (
              <div
                key={group.id}
                data-testid={`pillar-${group.id}`}
                className="group flex flex-col rounded-3xl border border-[#EED3C3] bg-white/70 p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(138,63,33,0.35)]"
              >
                {/* Cabeçalho do card — ícone + label do menu + subtitle */}
                <div className="flex items-start gap-3">
                  <div
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-white shadow-md"
                    style={{ background: "linear-gradient(135deg,#C96A3D 0%,#8A3F21 100%)" }}
                    aria-hidden
                  >
                    {Icon ? <Icon className="h-5 w-5" strokeWidth={2.2} /> : null}
                  </div>
                  <div className="leading-tight">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8A3F21]">
                      {group.subtitle}
                    </p>
                    <h3 className="mt-0.5 font-display text-xl font-black text-[#2E1B12]">
                      {group.label}
                    </h3>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-[#5F4A3F]">
                  {group.tagline}
                </p>

                <div className="mt-5 h-px w-full bg-[#EED3C3]" />

                {/* Lista de itens — emoji + label + description (igual header) */}
                <ul className="mt-5 space-y-4">
                  {group.items.map((it) => (
                    <li
                      key={it.to}
                      data-testid={`pillar-${group.id}-item-${it.testId}`}
                      className="flex items-start gap-3"
                    >
                      <span
                        aria-hidden
                        className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl text-lg shadow-inner"
                        style={{ backgroundColor: "#F4E1D5" }}
                      >
                        {it.emoji}
                      </span>
                      <div className="leading-snug">
                        <p className="text-[13px] font-bold text-[#2E1B12]">{it.label}</p>
                        <p className="mt-0.5 text-[12px] leading-relaxed text-[#5F4A3F]">
                          {it.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- GRID COMPACTO DE PRODUTOS ---------- */}
      <section className="border-y border-[#EED3C3]/70 bg-[#F4E1D5]/40">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#8A3F21]">
                o que você vai vender
              </p>
              <h2 className="mt-3 font-display text-3xl leading-tight text-[#2E1B12] sm:text-4xl">
                8 vitrines de renda em um só acesso.
              </h2>
            </div>
            <p className="max-w-sm text-sm text-[#5F4A3F]">
              Cada especialidade tem receitas testadas, tabela de custos e sugestões de venda.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {PRODUCTS.map((p) => (
              <div
                key={p.slug}
                data-testid={`product-${p.slug}`}
                className="group overflow-hidden rounded-2xl border border-[#EED3C3] bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="relative h-32 overflow-hidden sm:h-36">
                  <img
                    src={p.image}
                    alt={p.label}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-16"
                    style={{
                      background:
                        "linear-gradient(180deg,rgba(46,27,18,0) 0%,rgba(46,27,18,0.55) 100%)",
                    }}
                  />
                </div>
                <p className="px-3 py-3 text-center text-[13px] font-bold leading-tight text-[#2E1B12]">
                  {p.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CHECKLIST + CTA FINAL ---------- */}
      <section className="mx-auto max-w-4xl px-6 py-20 lg:py-28">
        <div className="rounded-[32px] border border-[#EED3C3] bg-white/85 p-8 shadow-[0_30px_80px_-30px_rgba(138,63,33,0.35)] backdrop-blur sm:p-12">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.28em] text-[#8A3F21]">
            tudo incluso · sem mensalidade
          </p>
          <h2 className="mt-3 text-center font-display text-3xl leading-tight text-[#2E1B12] sm:text-4xl">
            Um único pagamento de{" "}
            <span
              className="italic"
              style={{
                background: "linear-gradient(135deg,#C96A3D 0%,#8A3F21 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {formatBRL(PRICE_TOTAL)}
            </span>
            .
          </h2>

          <ul className="mx-auto mt-8 grid max-w-2xl gap-x-8 gap-y-3 sm:grid-cols-2">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-[#2E1B12]">
                <span
                  aria-hidden
                  className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white"
                  style={{ backgroundColor: "#8A3F21" }}
                >
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5F4A3F]">
              investimento único · 12x de {formatBRL(PRICE_INSTALLMENT_VALUE)} sem juros
            </p>
            <CTAButton testId="footer-cta" size="lg" start={start} loading={loading} />
            <p className="text-[11px] text-[#5F4A3F]">
              Acesso por 12 meses · sem renovação automática · pagamento Stripe
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
