export default function IntroducaoPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Introdução</h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    A Lavra.ai é uma plataforma de <strong>Inteligência Preditiva para Gestão de Risco Climático e Financeiro Integrado</strong> voltada para o produtor rural brasileiro.
                </p>
            </div>

            <hr className="border-neutral-200 dark:border-neutral-800" />

            <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">O Problema</h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    O produtor rural brasileiro, especialmente no Centro-Oeste, enfrenta um problema crítico que nenhuma solução atual resolve de forma integrada: <strong>a desconexão entre decisões agronômicas, risco climático e impacto financeiro em tempo real.</strong>
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    Hoje, o produtor usa sistemas fragmentados:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400">
                    <li>Um sistema para gestão da fazenda</li>
                    <li>Outro para previsão do tempo</li>
                    <li>Outro para cotações de commodities</li>
                    <li>Planilhas para tentar conectar tudo</li>
                    <li>E a intuição para tomar decisões de milhões</li>
                </ul>
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg">
                    <p className="text-red-800 dark:text-red-200 text-sm font-medium">
                        O Resultado: Decisões fragmentadas que custam entre 15-30% da rentabilidade potencial.
                    </p>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">A Solução</h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    O Lavra.ai é uma plataforma de <strong>Inteligência de Decisão Integrada</strong> que transforma dados em decisões financeiras acionáveis. Nós respondemos a pergunta mais importante do produtor:
                </p>

                <div className="bg-neutral-900 text-neutral-200 p-6 rounded-xl font-mono text-sm leading-relaxed shadow-lg">
                    <p className="mb-4 text-neutral-400">{'//'} O GAP de Mercado</p>
                    <p className="mb-2"><span className="text-purple-400">DADO</span> o clima previsto para os próximos 90 dias,</p>
                    <p className="mb-2"><span className="text-purple-400">DADO</span> meu estágio atual de lavoura,</p>
                    <p className="mb-2"><span className="text-purple-400">DADO</span> meu custo de produção,</p>
                    <p className="mb-4"><span className="text-purple-400">DADO</span> o mercado futuro de commodities,</p>

                    <p className="mb-2 text-green-400">➜ QUANDO devo vender?</p>
                    <p className="mb-2 text-green-400">➜ QUANTO devo travar de preço?</p>
                    <p className="text-green-400">➜ QUANTO VOU GANHAR/PERDER com cada decisão?</p>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Visão e Missão</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-neutral-50 dark:bg-white/5 rounded-xl border border-neutral-200 dark:border-white/10">
                        <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Visão</h3>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                            Ser a plataforma de inteligência de decisão mais confiável do agronegócio brasileiro, transformando dados em lucro para o produtor rural.
                        </p>
                    </div>
                    <div className="p-6 bg-neutral-50 dark:bg-white/5 rounded-xl border border-neutral-200 dark:border-white/10">
                        <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Missão</h3>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                            Conectar clima, mercado e operação em decisões financeiras acionáveis, eliminando a fragmentação que custa milhões aos produtores.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
