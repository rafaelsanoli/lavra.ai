import { Database, Lock, Network, Share2, TrendingUp } from 'lucide-react'

export default function TecnologiaPage() {
    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Tecnologia & Diferenciais</h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Entenda a arquitetura proprietária que torna o Lavra.ai único e difícil de replicar.
                </p>
            </div>

            <hr className="border-neutral-200 dark:border-neutral-800" />

            <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Network className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    Efeito de Rede dos Dados (Data Moat)
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Nosso modelo se torna mais preciso a cada novo cliente, criando uma barreira de entrada natural.
                </p>

                <div className="bg-neutral-50 dark:bg-white/5 p-8 rounded-xl border border-neutral-200 dark:border-white/10 flex justify-center">
                    <div className="relative max-w-md w-full text-center space-y-4">
                        <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 mx-auto w-48 font-semibold text-neutral-900 dark:text-white">
                            Mais Clientes
                        </div>
                        <div className="text-neutral-400">↓</div>
                        <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 mx-auto w-64 font-semibold text-neutral-900 dark:text-white">
                            Mais Dados de Decisão × Resultado
                        </div>
                        <div className="text-neutral-400">↓</div>
                        <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 mx-auto w-48 font-semibold text-neutral-900 dark:text-white">
                            Modelo Mais Preciso
                        </div>
                        <div className="text-neutral-400">↓</div>
                        <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 mx-auto w-48 font-semibold text-neutral-900 dark:text-white">
                            Mais Valor Entregue
                        </div>

                        {/* Loop arrow visualization could go here */}
                        <div className="absolute top-1/2 -right-4 h-full w-8 border-r-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-r-full transform -translate-y-1/2 hidden md:block" />
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Share2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    Integrações Externas
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Conectamos fontes de dados globais e locais para alimentar nosso motor de decisão.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-neutral-50 dark:bg-white/5 rounded-lg border border-neutral-200 dark:border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                            <Database className="w-4 h-4 text-brand-500" />
                            <h3 className="font-semibold text-neutral-900 dark:text-white">Dados Climáticos</h3>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">INMET, CPTEC, NASA POWER, Sentinel-2</p>
                    </div>

                    <div className="p-4 bg-neutral-50 dark:bg-white/5 rounded-lg border border-neutral-200 dark:border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <h3 className="font-semibold text-neutral-900 dark:text-white">Mercado Financeiro</h3>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">B3 API (cotações e execução), Bloomberg</p>
                    </div>

                    <div className="p-4 bg-neutral-50 dark:bg-white/5 rounded-lg border border-neutral-200 dark:border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                            <Lock className="w-4 h-4 text-amber-500" />
                            <h3 className="font-semibold text-neutral-900 dark:text-white">Segurança</h3>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Criptografia ponta-a-ponta, Compliance LGPD</p>
                    </div>

                    <div className="p-4 bg-neutral-50 dark:bg-white/5 rounded-lg border border-neutral-200 dark:border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                            <Share2 className="w-4 h-4 text-blue-500" />
                            <h3 className="font-semibold text-neutral-900 dark:text-white">Relatórios de Safra</h3>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">USDA, CONAB, IBGE</p>
                    </div>
                </div>
            </section>
        </div>
    )
}
