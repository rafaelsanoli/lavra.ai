import { Cabecalho } from '@/components/layout'
import { DocsSidebar } from '@/components/docs/DocsSidebar'

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
            <Cabecalho />

            <div className="flex pt-16 container-main">
                <DocsSidebar />

                <main className="flex-1 min-w-0 py-10 lg:pl-10">
                    <div className="prose prose-neutral dark:prose-invert max-w-3xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
