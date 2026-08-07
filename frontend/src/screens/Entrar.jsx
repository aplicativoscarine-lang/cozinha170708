import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  ChefHat,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Lock,
  Heart,
  Cookie,
  UtensilsCrossed,
  Cake,
} from "lucide-react";

/**
 * Entrar — capa branded que antecede o consentimento Google
 * (auth.emergentagent.com/oauth/consent/?app_slug=kitchen-app-18).
 *
 * Objetivo: enquadrar a confeiteira no universo Cozinha Lucrativa antes
 * de aparecer a tela genérica de consentimento. Layout de duas colunas
 * responsivo — visual afetivo à esquerda, ação (com garantias) à direita.
 */

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Login em 1 clique",
    text: "Usamos o Google via consentimento seguro. Nenhuma senha extra pra decorar.",
  },
  {
    icon: Lock,
    title: "Seus dados só seus",
    text: "Guardamos apenas nome, e-mail e foto do Google. Sem espiar suas conversas.",
  },
  {
    icon: Heart,
    title: "Acesso liberado por 12 meses",
    text: "Quando entrar, seus cursos, receitas e caderno estarão te esperando.",
  },
];

const CHIPS = [
  { icon: Cake, label: "Bolos caseiros" },
  { icon: UtensilsCrossed, label: "Encomendas" },
  { icon: Cookie, label: "Doces autorais" },
];

export default function Entrar() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const [ticking, setTicking] = useState(false);

  // Se já está logada, manda direto para a área de aluna
  useEffect(() => {
    if (!loading && user) navigate("/meus-cursos", { replace: true });
  }, [loading, user, navigate]);

  const nextUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/meus-cursos`;
  }, []);

  const handleContinue = () => {
    setTicking(true);
    // Pequeno delay para o feedback visual antes do redirect externo
    setTimeout(() => login(), 260);
  };

  return (
    <div
      data-testid="entrar-page"
      className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden"
      style={{ backgroundColor: "#FAF6F0" }}
    >
      {/* Textura decorativa: círculos suaves de fundo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 h-[520px] w-[520px] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(216,154,91,0.35), rgba(216,154,91,0))",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-32 h-[560px] w-[560px] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(162,77,42,0.28), rgba(162,77,42,0))",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col px-6 py-10 md:py-16 lg:px-12">
        {/* Voltar */}
        <Link
          to="/"
          data-testid="entrar-back-home"
          className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-[#EED3C3]/70 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#5F4A3F] backdrop-blur transition-colors hover:border-[#D89A5B] hover:text-[#8A3F21]"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.4} />
          Voltar ao início
        </Link>

        {/* Grid principal */}
        <div className="grid flex-1 gap-10 md:gap-16 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          {/* Coluna esquerda — narrativa da marca */}
          <section className="relative">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#EED3C3] bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#8A3F21] shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Bem-vinda de volta
            </div>

            <h1
              className="font-display text-4xl leading-[1.05] text-[#2E1B12] sm:text-5xl lg:text-6xl"
              data-testid="entrar-title"
            >
              A sua cozinha
              <br />
              está te{" "}
              <span
                className="italic"
                style={{
                  background:
                    "linear-gradient(135deg,#C96A3D 0%,#8A3F21 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                esperando
              </span>
              .
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-[#4A3529] sm:text-lg">
              Continue com o seu Google para abrir seus cursos, sua calculadora
              de lucro, sua vitrine e o Caderno de Anotações — do jeitinho que
              você deixou.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {CHIPS.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-[#EED3C3] bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#4A3529] shadow-sm"
                >
                  <Icon className="h-3.5 w-3.5" style={{ color: "#8A3F21" }} />
                  {label}
                </span>
              ))}
            </div>

            {/* Card visual afetivo (imagem hero) — some no mobile pra caber a ação */}
            <div className="mt-10 hidden overflow-hidden rounded-[28px] border border-[#EED3C3] bg-white/60 p-2 shadow-[0_20px_60px_-25px_rgba(138,63,33,0.35)] backdrop-blur md:block">
              <div
                className="relative flex h-64 items-end overflow-hidden rounded-[20px]"
                style={{
                  backgroundImage: 'url("/images/hero.png")',
                  backgroundSize: "cover",
                  backgroundPosition: "center 40%",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg,rgba(46,27,18,0) 30%,rgba(46,27,18,0.75) 100%)",
                  }}
                />
                <div className="relative p-6 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] opacity-90">
                    Plataforma Elevare
                  </p>
                  <p className="mt-1 font-display text-2xl leading-tight">
                    Onde a sua receita vira{" "}
                    <span className="italic">renda</span>.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Coluna direita — cartão de ação */}
          <section
            className="relative rounded-[28px] border border-[#EED3C3] bg-white/85 p-7 shadow-[0_30px_80px_-30px_rgba(138,63,33,0.35)] backdrop-blur-xl sm:p-9"
            data-testid="entrar-card"
          >
            {/* Selo topo */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="grid h-10 w-10 place-items-center rounded-xl text-white shadow-md"
                  style={{
                    background: "linear-gradient(135deg,#A24D2A 0%,#8A3F21 100%)",
                  }}
                >
                  <ChefHat className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <div className="leading-tight">
                  <p className="font-display text-lg font-black text-[#2E1B12]">
                    Cozinha Lucrativa
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8A3F21]">
                    entrar · consentimento seguro
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F4E1D5] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#8A3F21]">
                <ShieldCheck className="h-3 w-3" strokeWidth={2.6} />
                SSL
              </span>
            </div>

            <h2 className="font-display text-2xl leading-tight text-[#2E1B12] sm:text-3xl">
              Continuar como você
            </h2>
            <p className="mt-2 text-sm text-[#5F4A3F]">
              Vamos te levar até a página de consentimento oficial do Google —
              é rápido e ninguém digita senha por aqui.
            </p>

            {/* CTA principal — “Google style” com brand da casa */}
            <button
              type="button"
              onClick={handleContinue}
              disabled={ticking}
              data-testid="entrar-continuar-google"
              className="group mt-7 flex w-full items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left text-white shadow-[0_14px_40px_-12px_rgba(138,63,33,0.55)] transition-all hover:shadow-[0_18px_50px_-12px_rgba(138,63,33,0.75)] disabled:cursor-progress disabled:opacity-80"
              style={{
                background: "linear-gradient(135deg,#C96A3D 0%,#8A3F21 100%)",
              }}
            >
              <span className="flex items-center gap-3">
                <span
                  className="grid h-9 w-9 place-items-center rounded-xl bg-white shadow-inner"
                  aria-hidden
                >
                  {/* Logo do Google em SVG (colorido) */}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </svg>
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-90">
                    Consentimento seguro
                  </span>
                  <span className="text-base font-bold">
                    {ticking ? "Abrindo Google…" : "Continuar com Google"}
                  </span>
                </span>
              </span>
              <ArrowRight
                className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1"
                strokeWidth={2.6}
              />
            </button>

            {/* Path visual do fluxo */}
            <div
              aria-hidden
              className="mt-5 flex items-center justify-between rounded-2xl border border-dashed border-[#EED3C3] bg-[#FAF6F0] p-3 text-[11px] font-semibold text-[#5F4A3F]"
            >
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="grid h-6 w-6 place-items-center rounded-full text-white"
                  style={{ backgroundColor: "#8A3F21" }}
                >
                  1
                </span>
                Cozinha
              </span>
              <span className="mx-1 h-px flex-1" style={{ background: "repeating-linear-gradient(90deg,#D89A5B 0 4px,transparent 4px 8px)" }} />
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="grid h-6 w-6 place-items-center rounded-full border border-[#EED3C3] bg-white text-[#8A3F21]"
                >
                  2
                </span>
                Google
              </span>
              <span className="mx-1 h-px flex-1" style={{ background: "repeating-linear-gradient(90deg,#D89A5B 0 4px,transparent 4px 8px)" }} />
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="grid h-6 w-6 place-items-center rounded-full border border-[#EED3C3] bg-white text-[#8A3F21]"
                >
                  3
                </span>
                Meus cursos
              </span>
            </div>

            {/* Benefícios */}
            <ul className="mt-6 space-y-3">
              {BENEFITS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full"
                    style={{ backgroundColor: "#F4E1D5", color: "#8A3F21" }}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2.4} />
                  </span>
                  <div className="leading-snug">
                    <p className="text-sm font-bold text-[#2E1B12]">{title}</p>
                    <p className="text-xs text-[#5F4A3F]">{text}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Rodapé de compliance */}
            <p className="mt-7 text-center text-[11px] leading-relaxed text-[#5F4A3F]">
              Ao continuar você concorda com os nossos{" "}
              <Link
                to="/termos"
                className="font-semibold text-[#8A3F21] underline-offset-2 hover:underline"
                data-testid="entrar-link-termos"
              >
                Termos
              </Link>{" "}
              e{" "}
              <Link
                to="/privacidade"
                className="font-semibold text-[#8A3F21] underline-offset-2 hover:underline"
                data-testid="entrar-link-privacidade"
              >
                Política de Privacidade
              </Link>
              .
            </p>

            {/* Info técnica discreta (mostra o destino) */}
            <div
              className="mt-4 truncate rounded-lg border border-[#EED3C3] bg-[#FAF6F0] px-3 py-2 text-[10px] font-mono text-[#5F4A3F]"
              title={nextUrl}
              data-testid="entrar-redirect-hint"
            >
              → depois do consentimento, você volta para{" "}
              <span className="font-bold text-[#8A3F21]">/meus-cursos</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
