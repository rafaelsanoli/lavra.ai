export const traducoes = {
  pt: {
    // Navegação
    nav: {
      produto: 'Produto',
      precos: 'Preços',
      sobre: 'Sobre',
      entrar: 'Entrar',
      comecarGratis: 'Começar grátis',
    },

    // Hero
    hero: {
      emblema: 'Lançamento em breve',
      titulo: 'Inteligência que',
      tituloDestaque: 'cultiva lucro',
      subtitulo: 'Tome decisões de milhões com confiança. IA que conecta clima, mercado e sua fazenda em uma única plataforma preditiva.',
      cta: 'Entrar na lista de espera',
      ctaSecundario: 'Ver demonstração',
      estatisticas: {
        lucro: { valor: '+30%', label: 'Aumento no lucro' },
        previsao: { valor: '15d', label: 'Previsão antecipada' },
        precisao: { valor: '94%', label: 'Precisão climática' },
      },
      dashboard: {
        url: 'app.lavra.ia/dashboard',
        lucroProjetado: 'Lucro Projetado',
        lucroValor: 'R$ 2.847.000',
        clima: 'Clima',
        sojaLabel: 'Soja @',
        alerta: 'Alerta',
        janelaIdeal: 'Janela ideal',
        vendaSoja: 'Venda de soja em 3 dias',
      },
    },

    // Features
    features: {
      badge: 'Funcionalidades',
      titulo: 'Tudo que você precisa,',
      tituloDestaque: 'nada que não precisa',
      subtitulo: '5 módulos integrados que transformam dados fragmentados em decisões lucrativas.',
      items: [
        {
          titulo: 'Inteligência Climática',
          descricao: 'Previsões de 15 dias com 94% de precisão. Alertas de geada, granizo e seca antes que aconteçam.',
        },
        {
          titulo: 'Inteligência de Mercado',
          descricao: 'Cotações em tempo real da B3 e mercado físico. Identifique janelas de venda ideais automaticamente.',
        },
        {
          titulo: 'Central de Operações',
          descricao: 'Gerencie talhões, insumos, custos e equipe. Tudo integrado com clima e mercado.',
        },
        {
          titulo: 'Alertas Inteligentes',
          descricao: 'Notificações por WhatsApp quando surgir oportunidade ou risco. Nunca mais perca o timing.',
        },
        {
          titulo: 'Simulador de Cenários',
          descricao: 'E se chover 20% menos? E se a soja subir 10%? Simule cenários e tome decisões com confiança.',
        },
      ],
    },

    // Pricing
    pricing: {
      badge: 'Preços',
      titulo: 'Invista no que',
      tituloDestaque: 'dá retorno',
      subtitulo: 'Nossos clientes recuperam o investimento já no primeiro mês. Escolha o plano ideal para sua operação.',
      maisPopular: 'Mais popular',
      comecarAgora: 'Em Breve',
      falarVendas: 'Em Breve',
      planos: [
        {
          nome: 'Essencial',
          preco: 'R$ 297',
          periodo: '/mês',
          descricao: 'Para produtores que querem começar a usar dados.',
          recursos: [
            '1 fazenda (até 500 ha)',
            'Previsão climática 7 dias',
            'Cotações B3 (delay 15min)',
            'Alertas por email',
            'Suporte por email',
          ],
        },
        {
          nome: 'Profissional',
          preco: 'R$ 897',
          periodo: '/mês',
          descricao: 'Para quem quer maximizar cada decisão.',
          recursos: [
            '3 fazendas (até 2.000 ha)',
            'Previsão climática 15 dias',
            'Cotações tempo real + físico',
            'Simulador de cenários',
            'Alertas WhatsApp',
            'Dashboard personalizado',
            'Suporte prioritário',
          ],
        },
        {
          nome: 'Enterprise',
          preco: 'À consultar',
          periodo: '',
          descricao: 'Para grandes operações e grupos.',
          recursos: [
            'Fazendas ilimitadas',
            'API de integração',
            'Modelos ML customizados',
            'Imagens de satélite',
            'Consultoria estratégica',
            'SLA garantido',
            'Gerente de conta dedicado',
          ],
        },
      ],
    },

    // Waitlist
    waitlist: {
      titulo: 'Seja um dos primeiros',
      subtitulo: 'Estamos selecionando produtores para o beta fechado. Entre na lista e garanta condições especiais de lançamento.',
      placeholder: 'seu@email.com',
      botao: 'Entrar na lista',
      spam: 'Sem spam. Você pode sair quando quiser.',
      sucessoTitulo: 'Você está na lista! 🎉',
      sucessoMsg: 'Vamos te avisar assim que abrirmos as vagas. Fique de olho no seu email.',
    },

    // FAQ
    faq: {
      badge: 'Dúvidas Frequentes',
      titulo: 'Perguntas',
      tituloDestaque: 'frequentes',
      subtitulo: 'Tudo que você precisa saber sobre o Lavra.ia.',
      items: [
        {
          pergunta: 'Como funciona a previsão?',
          resposta: 'Utilizamos modelos de IA que analisam dados históricos de 5 anos da sua região, combinados com dados de satélite e estações meteorológicas em tempo real para gerar previsões hiper-localizadas.',
        },
        {
          pergunta: 'Qual a diferença para o FieldView?',
          resposta: 'O FieldView foca em dados agronômicos e de plantio. O Lavra.ia conecta esses dados com o mercado financeiro para te dizer QUANDO vender e QUANTO travar de preço.',
        },
        {
          pergunta: 'Preciso instalar sensores?',
          resposta: 'Não necessariamente. Nossa IA funciona com dados de satélite e estações públicas. Porém, se você já tiver sensores ou estações, podemos integrar para aumentar a precisão.',
        },
        {
          pergunta: 'Quanto custa?',
          resposta: 'Temos planos a partir de R$ 297/mês. O retorno sobre o investimento (ROI) médio dos nossos clientes é de 10x já na primeira safra.',
        },
      ],
    },

    // How it Works
    howItWorks: {
      badge: 'Como Funciona',
      titulo: 'Da terra ao',
      tituloDestaque: 'lucro',
      subtitulo: 'Um processo simples para transformar dados em dinheiro no bolso.',
      steps: [
        {
          titulo: 'Conecte seus dados',
          descricao: 'Faça upload do shapefile da fazenda ou integre com seu ERP atual.',
        },
        {
          titulo: 'IA analisa cenários',
          descricao: 'Nossos algoritmos processam clima, mercado e histórico de produção.',
        },
        {
          titulo: 'Receba recomendações',
          descricao: 'Alertas precisos de quando vender, colher ou fazer hedge.',
        },
        {
          titulo: 'Maximize lucros',
          descricao: 'Execute as ordens e acompanhe o resultado financeiro em tempo real.',
        },
      ],
    },

    footer: {
      descricao: 'Inteligência preditiva para o agronegócio brasileiro. Tome decisões de milhões com confiança.',
      produto: 'Produto',
      empresa: 'Empresa',
      recursos: 'Recursos',
      legal: 'Legal',
      links: {
        funcionalidades: 'Funcionalidades',
        precos: 'Preços',
        integracoes: 'Integrações',
        roadmap: 'Roadmap',
        sobre: 'Sobre',
        blog: 'Blog',
        carreiras: 'Carreiras',
        contato: 'Contato',
        documentacao: 'Documentação',
        api: 'API',
        suporte: 'Suporte',
        status: 'Status',
        privacidade: 'Privacidade',
        termos: 'Termos',
        cookies: 'Cookies',
      },
      direitos: 'Todos os direitos reservados.',
    },
  },

  en: {
    // Navigation
    nav: {
      produto: 'Product',
      precos: 'Pricing',
      sobre: 'About',
      entrar: 'Sign in',
      comecarGratis: 'Start free',
    },

    // Hero
    hero: {
      emblema: 'Coming soon',
      titulo: 'Intelligence that',
      tituloDestaque: 'grows profit',
      subtitulo: 'Make million-dollar decisions with confidence. AI that connects weather, market and your farm in one predictive platform.',
      cta: 'Join the waitlist',
      ctaSecundario: 'Watch demo',
      estatisticas: {
        lucro: { valor: '+30%', label: 'Profit increase' },
        previsao: { valor: '15d', label: 'Early forecast' },
        precisao: { valor: '94%', label: 'Weather accuracy' },
      },
      dashboard: {
        url: 'app.lavra.ia/dashboard',
        lucroProjetado: 'Projected Profit',
        lucroValor: '$ 567,400',
        clima: 'Weather',
        sojaLabel: 'Soy @',
        alerta: 'Alert',
        janelaIdeal: 'Ideal window',
        vendaSoja: 'Sell soy in 3 days',
      },
    },

    // Features
    features: {
      badge: 'Features',
      titulo: 'Everything you need,',
      tituloDestaque: 'nothing you don\'t',
      subtitulo: '5 integrated modules that transform fragmented data into profitable decisions.',
      items: [
        {
          titulo: 'Weather Intelligence',
          descricao: '15-day forecasts with 94% accuracy. Frost, hail and drought alerts before they happen.',
        },
        {
          titulo: 'Market Intelligence',
          descricao: 'Real-time quotes from exchanges and spot market. Automatically identify ideal selling windows.',
        },
        {
          titulo: 'Operations Center',
          descricao: 'Manage fields, inputs, costs and team. Everything integrated with weather and market.',
        },
        {
          titulo: 'Smart Alerts',
          descricao: 'WhatsApp notifications when opportunity or risk arises. Never miss the timing again.',
        },
        {
          titulo: 'Scenario Simulator',
          descricao: 'What if it rains 20% less? What if soy rises 10%? Simulate scenarios and decide with confidence.',
        },
      ],
    },

    // Pricing
    pricing: {
      badge: 'Pricing',
      titulo: 'Invest in what',
      tituloDestaque: 'pays back',
      subtitulo: 'Our customers recover their investment in the first month. Choose the ideal plan for your operation.',
      maisPopular: 'Most popular',
      comecarAgora: 'Start now',
      falarVendas: 'Talk to sales',
      planos: [
        {
          nome: 'Essential',
          preco: '$ 59',
          periodo: '/month',
          descricao: 'For producers who want to start using data.',
          recursos: [
            '1 farm (up to 1,200 acres)',
            '7-day weather forecast',
            'Exchange quotes (15min delay)',
            'Email alerts',
            'Email support',
          ],
        },
        {
          nome: 'Professional',
          preco: '$ 179',
          periodo: '/month',
          descricao: 'For those who want to maximize every decision.',
          recursos: [
            '3 farms (up to 5,000 acres)',
            '15-day weather forecast',
            'Real-time + spot quotes',
            'Scenario simulator',
            'WhatsApp alerts',
            'Custom dashboard',
            'Priority support',
          ],
        },
        {
          nome: 'Enterprise',
          preco: 'Contact us',
          periodo: '',
          descricao: 'For large operations and groups.',
          recursos: [
            'Unlimited farms',
            'Integration API',
            'Custom ML models',
            'Satellite imagery',
            'Strategic consulting',
            'Guaranteed SLA',
            'Dedicated account manager',
          ],
        },
      ],
    },

    // Waitlist
    waitlist: {
      titulo: 'Be one of the first',
      subtitulo: 'We\'re selecting producers for the closed beta. Join the list and get special launch conditions.',
      placeholder: 'you@email.com',
      botao: 'Join the list',
      spam: 'No spam. You can leave anytime.',
      sucessoTitulo: 'You\'re on the list! 🎉',
      sucessoMsg: 'We\'ll let you know as soon as we open spots. Keep an eye on your email.',
    },

    // FAQ
    faq: {
      badge: 'FAQ',
      titulo: 'Frequently Asked',
      tituloDestaque: 'Questions',
      subtitulo: 'Everything you need to know about Lavra.ia.',
      items: [
        {
          pergunta: 'How does the forecast work?',
          resposta: 'We use AI models that analyze 5 years of historical data from your region, combined with satellite data and real-time weather stations to generate hyper-localized forecasts.',
        },
        {
          pergunta: 'How is it different from FieldView?',
          resposta: 'FieldView focuses on agronomic and planting data. Lavra.ia connects this data with the financial market to tell you WHEN to sell and HOW MUCH to hedge.',
        },
        {
          pergunta: 'Do I need to install sensors?',
          resposta: 'Not necessarily. Our AI works with satellite data and public stations. However, if you already have sensors or stations, we can integrate them to increase accuracy.',
        },
        {
          pergunta: 'How much does it cost?',
          resposta: 'Plans start at $59/month. The average Return on Investment (ROI) for our clients is 10x in the first harvest.',
        },
      ],
    },

    // How it Works
    howItWorks: {
      badge: 'How it Works',
      titulo: 'From soil to',
      tituloDestaque: 'profit',
      subtitulo: 'A simple process to turn data into money in your pocket.',
      steps: [
        {
          titulo: 'Connect your data',
          descricao: 'Upload farm shapefiles or integrate with your current ERP.',
        },
        {
          titulo: 'AI analyzes scenarios',
          descricao: 'Our algorithms process weather, market, and production history.',
        },
        {
          titulo: 'Get recommendations',
          descricao: 'Precise alerts on when to sell, harvest, or hedge.',
        },
        {
          titulo: 'Maximize profits',
          descricao: 'Execute orders and track financial results in real-time.',
        },
      ],
    },

    // Footer
    footer: {
      descricao: 'Predictive intelligence for agribusiness. Make million-dollar decisions with confidence.',
      produto: 'Product',
      empresa: 'Company',
      recursos: 'Resources',
      legal: 'Legal',
      links: {
        funcionalidades: 'Features',
        precos: 'Pricing',
        integracoes: 'Integrations',
        roadmap: 'Roadmap',
        sobre: 'About',
        blog: 'Blog',
        carreiras: 'Careers',
        contato: 'Contact',
        documentacao: 'Documentation',
        api: 'API',
        suporte: 'Support',
        status: 'Status',
        privacidade: 'Privacy',
        termos: 'Terms',
        cookies: 'Cookies',
      },
      direitos: 'All rights reserved.',
    },
  },
} as const

export type Idioma = keyof typeof traducoes
export type Traducao = typeof traducoes.pt
