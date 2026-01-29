import Link from 'next/link'
import { ArrowRight, Book, Cpu, Layers } from 'lucide-react'

export default function DocsPage() {
    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
                    Documentação Lavra.ia
                </h1>
                <p className="text-xl text-neutral-600 dark:text-neutral-400">
                    Bem-vindo à central de conhecimento da Lavra.ia. Aqui você encontra detalhes técnicos, guias de funcionalidades e explicações sobre nossa tecnologia.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Link
                    href="/docs/introducao"
                    className="group p-6 bg-neutral-50 dark:bg-white/5 rounded-xl border border-neutral-200 dark:border-white/10 hover:border-brand-500 dark:hover:border-brand-500 transition-colors"
                >
                    <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Book className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                        Comece aqui
                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                        Entenda a visão, o problema que resolvemos e como a plataforma funciona.
                    </p>
                </Link>

                <Link
                    href="/docs/funcionalidades"
                    className="group p-6 bg-neutral-50 dark:bg-white/5 rounded-xl border border-neutral-200 dark:border-white/10 hover:border-brand-500 dark:hover:border-brand-500 transition-colors"
                >
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                        Funcionalidades
                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                        Explore em detalhes cada módulo: Clima, Mercado e Operações.
                    </p>
                </Link>

                <Link
                    href="/docs/tecnologia"
                    className="group p-6 bg-neutral-50 dark:bg-white/5 rounded-xl border border-neutral-200 dark:border-white/10 hover:border-brand-500 dark:hover:border-brand-500 transition-colors"
                >
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Cpu className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                        Tecnologia
                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                        Mergulhe na arquitetura da nossa IA e integrações de dados.
                    </p>
                </Link>
            </div>
        </div>
    )
}
