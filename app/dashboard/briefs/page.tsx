import { Sparkles, TrendingUp, Users, ArrowRight } from "lucide-react";

const MOCK_BRIEFS = [
  {
    id: "weekly",
    icon: Sparkles,
    title: "Brief de la semana",
    subtitle: "Del 12 al 18 de mayo",
    summary:
      "Esta semana tuviste 3 interacciones. Samuel Chin fue el contacto más activo. Tu relación con María Tirado necesita atención — llevan 45 días sin hablar.",
    highlight: "3 interacciones registradas",
  },
  {
    id: "pattern",
    icon: TrendingUp,
    title: "Patrón de comunicación",
    subtitle: "Últimos 30 días",
    summary:
      "Tiendes a conectarte más los martes y jueves. El 70% de tus interacciones son mensajes escritos. Considera más llamadas o cafés para fortalecer vínculos.",
    highlight: "Canal preferido: Mensaje",
  },
  {
    id: "opportunity",
    icon: Users,
    title: "Oportunidad de conexión",
    subtitle: "Recomendación IA",
    summary:
      "Javier Méndez y Ana Silva comparten intereses en liderazgo. Una introducción podría fortalecer ambas relaciones y crear valor para tu red de Rotary.",
    highlight: "2 personas para conectar",
  },
];

export default function BriefsPage() {
  return (
    <div className="min-h-screen bg-[#fff8f5] pb-32">
      {/* Header */}
      <header className="bg-[#9c3e21] pt-14 pb-24 px-6 flex flex-col items-center text-white">
        <div className="w-full flex justify-between items-center mb-6">
          <div className="w-10" />
          <div className="text-center">
            <h1 className="text-[32px] font-bold tracking-[-0.02em]">Briefs</h1>
          </div>
          <div className="w-10" />
        </div>
        <p className="text-white/80 text-sm font-medium">Patrones e insights</p>
      </header>

      {/* Content */}
      <main className="bg-[#fff8f5] rounded-t-3xl -mt-12 relative z-10 px-6 pt-8">
        {/* Disclaimer */}
        <div className="bg-[#ffdbd1]/40 border border-[#ffdbd1] rounded-[16px] p-4 mb-6 flex gap-3 items-start">
          <Sparkles className="w-4 h-4 text-[#9c3e21] shrink-0 mt-0.5" strokeWidth={1.5} />
          <p className="text-xs text-[#56423c] leading-relaxed">
            Estos briefs analizan patrones macro de tus relaciones. La versión
            actual muestra ejemplos — la lógica real llega en v2.
          </p>
        </div>

        {/* Brief cards */}
        <div className="flex flex-col gap-4">
          {MOCK_BRIEFS.map((brief) => {
            const Icon = brief.icon;
            return (
              <div
                key={brief.id}
                className="bg-white rounded-[20px] p-6 shadow-sm border border-[#f5ece8]"
              >
                {/* Header row */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#ffdbd1] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#9c3e21]" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#1f1b18] text-base leading-tight">
                      {brief.title}
                    </h3>
                    <p className="text-xs text-[#8a726b] mt-0.5">{brief.subtitle}</p>
                  </div>
                </div>

                {/* Highlight chip */}
                <div className="inline-flex items-center gap-1.5 bg-[#9c3e21]/10 text-[#9c3e21] px-3 py-1.5 rounded-full mb-3">
                  <span className="text-xs font-semibold">{brief.highlight}</span>
                </div>

                {/* Summary */}
                <p className="text-sm text-[#56423c] leading-relaxed mb-4">
                  {brief.summary}
                </p>

                {/* CTA */}
                <button
                  onClick={() => alert("Próximamente en v2")}
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#9c3e21] hover:gap-2.5 transition-all"
                >
                  Ver análisis completo
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Coming soon footer */}
        <div className="mt-6 text-center py-4">
          <p className="text-xs text-[#8a726b]">
            Los briefs automáticos con IA macro llegan en Kindred v2 ✨
          </p>
        </div>
      </main>
    </div>
  );
}
