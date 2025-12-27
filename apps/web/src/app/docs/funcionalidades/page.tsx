import { CheckCircle, AlertTriangle, TrendingUp, Shield } from 'lucide-react'

export default function FuncionalidadesPage() {
    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Funcionalidades Core</h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    O Lavra.ai não é apenas um dashboard. É um sistema complexo de inteligência de decisão. Abaixo detalhamos os módulos principais que compõem a plataforma.
                </p>
            </div>

            <hr className="border-neutral-200 dark:border-neutral-800" />

            <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="p-2 bg-brand-100 dark:bg-brand-900/30 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                    </div>
                    1. Motor de Simulação de Cenários
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    O coração da plataforma. Calcula cenários combinando clima, produção e mercado para gerar recomendações financeiras precisas.
                </p>

                <div className="bg-neutral-900 rounded-xl overflow-hidden shadow-lg border border-neutral-800">
                    <div className="px-4 py-2 bg-neutral-800 border-b border-neutral-700 flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <span className="text-xs text-neutral-400 font-mono ml-2">simulacao_cenario.ts</span>
                    </div>
                    <div className="p-6 overflow-x-auto">
                        <pre className="text-sm font-mono text-neutral-300 leading-relaxed">
                            {`interface SimulacaoCenario {
  cenarioClimatico: {
    probabilidadeChuva: number;      // próximos 90 dias
    deficitHidrico: number;          // mm
    riscoPraga: number;              // baseado em umidade/temp
  };
  impactoProducao: {
    produtividadeEstimada: number;   // sacas/hectare
    variacaoPossivel: [number, number]; // min-max
  };
  decisaoFinanceira: {
    precoOtimoVenda: number;         // R$/saca
    momentoIdealVenda: Date;
    volumeRecomendadoHedge: number;  // % da produção
    lucroProjetado: number;          // R$ total
    riscoMaximo: number;             // R$ em risco
  };
}`}
                        </pre>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    2. Precificação Dinâmica de Risco
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Cada talhão da fazenda recebe um <strong>&quot;Score de Risco Financeiro&quot;</strong> que muda diariamente baseado em variáveis agronômicas e climáticas.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-neutral-50 dark:bg-white/5 rounded-xl border border-neutral-200 dark:border-white/10">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-mono font-bold text-neutral-900 dark:text-white">TALHÃO A-01 (320 ha)</h3>
                            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold rounded">SCORE: 72/100</span>
                        </div>
                        <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                            <li className="flex items-center gap-2 text-red-500">
                                <span>↓</span> Solo argiloso (-5)
                            </li>
                            <li className="flex items-center gap-2 text-green-500">
                                <span>↑</span> Exposição norte (+3)
                            </li>
                            <li className="flex items-center gap-2 text-red-500">
                                <span>↓</span> Veranico previsto (-8)
                            </li>
                        </ul>
                        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                            <p className="text-xs text-neutral-500 mb-1">Valor em Risco</p>
                            <p className="text-lg font-mono font-bold text-neutral-900 dark:text-white">R$ 387.000</p>
                        </div>
                    </div>

                    <div className="p-6 bg-neutral-50 dark:bg-white/5 rounded-xl border border-neutral-200 dark:border-white/10">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-mono font-bold text-neutral-900 dark:text-white">TALHÃO B-03 (180 ha)</h3>
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded">SCORE: 94/100</span>
                        </div>
                        <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                            <li className="flex items-center gap-2 text-green-500">
                                <span>↑</span> Irrigação pivot (+15)
                            </li>
                            <li className="flex items-center gap-2 text-green-500">
                                <span>↑</span> Histórico excelente (+10)
                            </li>
                            <li className="flex items-center gap-2 text-green-500">
                                <span>↑</span> Variedade resistente (+5)
                            </li>
                        </ul>
                        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                            <p className="text-xs text-neutral-500 mb-1">Valor em Risco</p>
                            <p className="text-lg font-mono font-bold text-neutral-900 dark:text-white">R$ 52.000</p>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    3. Integração e Execução
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    O produtor pode executar ordens diretamente pela plataforma, conectando a decisão à ação.
                </p>
                <ul className="grid sm:grid-cols-2 gap-4">
                    {[
                        "Conexão com B3 (contratos futuros)",
                        "Integração com tradings (Cargill, Bunge)",
                        "Cotações em tempo real",
                        "Execução de hedge com um clique"
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-white/5 rounded-lg border border-neutral-200 dark:border-white/10">
                            <CheckCircle className="w-5 h-5 text-brand-500 flex-shrink-0" />
                            <span className="text-sm font-medium text-neutral-900 dark:text-white">{item}</span>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    )
}
