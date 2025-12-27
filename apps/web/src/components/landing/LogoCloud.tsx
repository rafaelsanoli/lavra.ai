'use client'



const logos = [
    { name: 'AgroTech', icon: '🌱' },
    { name: 'FarmData', icon: '📊' },
    { name: 'SoyBean', icon: '🌾' },
    { name: 'ClimateSense', icon: '🌤️' },
    { name: 'GreenField', icon: '🚜' },
]

export function LogoCloud() {

    return (
        <section className="py-12 border-y border-neutral-100 dark:border-neutral-800 bg-white dark:bg-[#0A0A0A]">
            <div className="container-main">
                <p className="text-center text-sm font-medium text-neutral-500 mb-8 uppercase tracking-wider">
                    Integrado com as principais plataformas
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {logos.map((logo) => (
                        <div key={logo.name} className="flex items-center gap-2 group cursor-default">
                            <span className="text-2xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
                                {logo.icon}
                            </span>
                            <span className="text-xl font-bold text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                                {logo.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
