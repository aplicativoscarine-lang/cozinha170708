import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { api, BRL } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Loader2, Sparkles, ArrowRight, Package, BookOpen, Layers } from "lucide-react";
import { toast } from "sonner";

const PLAN_ICONS = {
  individual: BookOpen,
  combo3: Package,
  library: Layers,
};

export default function Plans() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [plans, setPlans] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("combo3");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    Promise.all([api.get("/plans"), api.get("/courses")]).then(([p, c]) => {
      setPlans(p.data || []);
      // Only combined "super courses" are purchasable — they package 3 modalidades.
      const combos = (c.data || []).filter(
        (x) => Array.isArray(x.combined_from) && x.combined_from.length > 0,
      );
      setCourses(combos);
      const preSlug = searchParams.get("curso");
      if (preSlug && combos.some((x) => x.slug === preSlug)) {
        setSelectedCourses([preSlug]);
        setSelectedPlan("individual");
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [searchParams]);

  const currentPlan = useMemo(
    () => plans.find((p) => p.id === selectedPlan),
    [plans, selectedPlan]
  );

  const requiredPicks = currentPlan?.course_count || 0;
  const needsPicker = selectedPlan === "individual" || selectedPlan === "combo3";
  const isReady = selectedPlan === "library" || selectedCourses.length === requiredPicks;

  const toggleCourse = (slug) => {
    setSelectedCourses((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (requiredPicks && prev.length >= requiredPicks) {
        // rotate out oldest
        return [...prev.slice(1), slug];
      }
      return [...prev, slug];
    });
  };

  const handleCheckout = async () => {
    if (!user) return login();
    if (!isReady) {
      toast.error(`Escolha ${requiredPicks} curso${requiredPicks > 1 ? "s" : ""} para continuar.`);
      return;
    }
    setBuying(true);
    try {
      const slugs = selectedPlan === "library" ? courses.map((c) => c.slug) : selectedCourses;
      const { data } = await api.post("/payments/checkout-plan", {
        plan_id: selectedPlan,
        course_slugs: slugs,
        origin_url: window.location.origin,
      });
      window.location.href = data.url;
    } catch (e) {
      toast.error(e.response?.data?.detail || "Erro ao iniciar pagamento.");
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div data-testid="plans-page" className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
      <div className="mb-14 max-w-3xl">
        <p className="mb-2 text-xs uppercase tracking-[0.25em] font-semibold text-amber-500">
          planos & preços
        </p>
        <h1 className="font-display text-4xl font-black leading-tight text-stone-50 sm:text-5xl lg:text-6xl">
          Escolha seu <span className="italic text-amber-400">acesso.</span>
        </h1>
        <p className="mt-4 max-w-xl text-base text-stone-400">
          Do primeiro curso ao acervo completo. Quanto mais cursos, mais você economiza. E mais
          modelos de negócio pode combinar.
        </p>
      </div>

      {/* PLANS GRID */}
      <div
        data-testid="plans-grid"
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
      >
        {plans.map((p) => {
          const Icon = PLAN_ICONS[p.id] || Package;
          const isSelected = selectedPlan === p.id;
          return (
            <button
              key={p.id}
              type="button"
              data-testid={`plan-card-${p.id}`}
              onClick={() => setSelectedPlan(p.id)}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border p-8 text-left transition-all animate-fade-in-up ${
                isSelected
                  ? "border-amber-500/60 bg-stone-900 shadow-[0_0_40px_rgba(217,119,6,0.25)]"
                  : "border-stone-800 bg-stone-900/60 hover:border-stone-700 hover:bg-stone-900"
              }`}
            >
              {p.highlight && (
                <div className="absolute right-6 top-6 inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  <span className="text-[9px] uppercase tracking-widest text-amber-300 font-bold">
                    popular
                  </span>
                </div>
              )}

              <div
                className={`mb-5 grid h-12 w-12 place-items-center rounded-xl transition-colors ${
                  isSelected ? "bg-amber-600 text-stone-50" : "bg-stone-800 text-amber-400"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="font-display text-2xl font-bold text-stone-50">{p.name}</h3>
              <p className="mt-1 text-xs uppercase tracking-widest text-amber-500 font-semibold">
                {p.tagline}
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-5xl font-black text-amber-400">
                  {BRL(p.price)}
                </span>
              </div>
              <p className="mt-1 text-xs text-stone-500">à vista ou em até 12x no cartão</p>

              <p className="mt-6 text-sm text-stone-300">{p.description}</p>

              <ul className="mt-6 space-y-2.5 border-t border-stone-800 pt-6">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-stone-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div
                className={`mt-8 rounded-full py-2.5 text-center text-sm font-semibold transition-colors ${
                  isSelected
                    ? "bg-amber-600 text-stone-50"
                    : "border border-stone-700 bg-stone-950 text-stone-300 group-hover:border-amber-500/50 group-hover:text-amber-400"
                }`}
              >
                {isSelected ? "Plano selecionado" : "Selecionar"}
              </div>
            </button>
          );
        })}
      </div>

      {/* COURSE PICKER */}
      {needsPicker && (
        <div className="mt-16" data-testid="course-picker">
          <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.25em] font-semibold text-amber-500">
                sua seleção
              </p>
              <h2 className="font-display text-2xl font-bold text-stone-50 sm:text-3xl">
                {selectedPlan === "individual"
                  ? "Escolha o seu curso"
                  : "Escolha 2 cursos que combinam com seu negócio"}
              </h2>
            </div>
            <div className="rounded-full border border-stone-800 bg-stone-900 px-4 py-2">
              <span className="text-xs text-stone-400">Selecionados: </span>
              <span
                data-testid="picker-counter"
                className={`font-display font-black ${
                  isReady ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {selectedCourses.length}
              </span>
              <span className="text-xs text-stone-400"> / {requiredPicks}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => {
              const isSel = selectedCourses.includes(c.slug);
              return (
                <button
                  key={c.slug}
                  type="button"
                  data-testid={`pick-${c.slug}`}
                  onClick={() => toggleCourse(c.slug)}
                  className={`group flex items-center gap-4 rounded-xl border p-3 text-left transition-all ${
                    isSel
                      ? "border-amber-500/50 bg-amber-500/5"
                      : "border-stone-800 bg-stone-900/60 hover:border-stone-700 hover:bg-stone-900"
                  }`}
                >
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={c.cover_image}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    {isSel && (
                      <div className="absolute inset-0 flex items-center justify-center bg-amber-600/70">
                        <Check className="h-6 w-6 text-stone-50" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-bold text-stone-50">
                      {c.title}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-stone-400">{c.tagline}</p>
                  </div>
                  <Checkbox
                    checked={isSel}
                    className="shrink-0 border-stone-600 data-[state=checked]:border-amber-500 data-[state=checked]:bg-amber-600"
                    onCheckedChange={() => toggleCourse(c.slug)}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* CHECKOUT BAR */}
      <div className="mt-16 sticky bottom-4 z-10 rounded-2xl border border-stone-800 bg-stone-900/95 backdrop-blur p-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-stone-500">total</p>
            <p className="font-display text-3xl font-black text-amber-400">
              {currentPlan ? BRL(currentPlan.price) : "-"}
            </p>
            <p className="mt-0.5 text-xs text-stone-500">
              {currentPlan?.name}
              {selectedPlan === "library" && ` · ${courses.length} cursos`}
              {selectedPlan === "combo3" && ` · ${selectedCourses.length}/2 escolhidos`}
              {selectedPlan === "individual" && ` · ${selectedCourses.length}/1 escolhido`}
            </p>
          </div>

          <Button
            data-testid="checkout-plan-btn"
            disabled={buying || !isReady}
            onClick={handleCheckout}
            className="rounded-full bg-amber-600 px-8 py-6 text-base font-semibold text-stone-50 shadow-[0_0_25px_rgba(217,119,6,0.35)] hover:bg-amber-700 disabled:opacity-50 disabled:hover:bg-amber-600"
          >
            {buying ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="ml-2 h-4 w-4 order-2" />
            )}
            {buying ? "Redirecionando…" : !user ? "Entrar com Google para comprar" : "Finalizar compra"}
          </Button>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-stone-500">
        Pagamento seguro processado por Stripe · <Link to="/" className="hover:text-amber-400">Ver todos os cursos</Link>
      </p>
    </div>
  );
}
