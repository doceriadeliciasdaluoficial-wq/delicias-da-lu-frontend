import cakeBuilderData from './cakeBuilder.json'
import menuData from './menu.json'
import CONTACTS from '../config/contacts'

const clone = (value) => JSON.parse(JSON.stringify(value))

export const defaultSiteConfig = {
  home: {
    featuredCakes: [
      {
        id: 'featured-ninho-nutella',
        name: 'Ninho com Nutella',
        defaultWeight: '1.5kg',
        defaultConfig: 'Massa Branca, Recheio Ninho com Nutella, Cobertura Ganache, Decoração Raspas',
        basePrice: 95,
        tag: 'Mais Vendido',
        image: '/images/bolos/ninho-nutella.jpg',
        description: 'Combinação irresistível de Ninho com Nutella - um clássico que nunca sai de moda. Essa é nossa configuração mais vendida: massa branca macia combinada com recheio cremoso de Ninho e Nutella, coberta com ganache brilhante e finalizada com raspas de chocolate. Ideal para 12-15 pessoas.',
        config: { size: '1.5kg', mass: 'branca', filling: 'nutella', topping: 'ganache', decoration: 'raspas' }
      },
      {
        id: 'featured-floresta-negra',
        name: 'Floresta Negra',
        defaultWeight: '1.5kg',
        defaultConfig: 'Massa Chocolate, Recheio Chocolate, Cobertura Calda, Decoração Frutas',
        basePrice: 110,
        tag: null,
        image: '/images/bolos/floresta-negra.jpg',
        description: 'Clássico alemão que traz elegância em cada fatia. A nossa versão em 1,5kg apresenta massa de chocolate intenso, recheio de mousse de chocolate, cobertura em calda quente e finalização com frutas frescas. Uma combinação sofisticada para celebrações especiais.',
        config: { size: '1.5kg', mass: 'chocolate', filling: 'chocolate', topping: 'calda', decoration: 'frutas' }
      },
      {
        id: 'featured-red-velvet',
        name: 'Red Velvet Especial',
        defaultWeight: '1.5kg',
        defaultConfig: 'Massa Red Velvet, Recheio Ninho, Cobertura Ganache, Decoração Toppers',
        basePrice: 120,
        tag: 'Novo',
        image: '/images/bolos/redvelvet.jpg',
        description: 'Massa vermelha elegante com frosting branco sofisticado. Em 1,5kg, essa criação traz a beleza visual do Red Velvet com a cremosidade do recheio de Ninho, finalizado com ganache e toppers personalizados. Perfeita para momentos memoráveis.',
        config: { size: '1.5kg', mass: 'redvelvet', filling: 'ninho', topping: 'ganache', decoration: 'toppers' }
      },
      {
        id: 'featured-brigadeiro-gourmet',
        name: 'Brigadeiro Gourmet',
        defaultWeight: '1.5kg',
        defaultConfig: 'Massa Chocolate, Recheio Brigadeiro, Cobertura Ganache, Decoração Raspas',
        basePrice: 110,
        tag: null,
        image: '/images/bolos/chocolate-brigadeiro-gourmet.jpg',
        description: 'Brigadeiro premium com chocolate de qualidade superior - perfeito para quem ama chocolate. Em 1,5kg, essa versão apresenta massa de chocolate intenso, recheio brigadeiro caseiro gourmet, cobertura ganache e acabamento em raspas de chocolate.',
        config: { size: '1.5kg', mass: 'chocolate', filling: 'brigadeiro', topping: 'ganache', decoration: 'raspas' }
      }
    ]
  },
  cakeBuilder: clone(cakeBuilderData),
  menu: {
    bolos: clone(menuData.bolos || []),
    docesSimples: clone(menuData.docesSimples || []),
    docesFinos: clone(menuData.docesFinos || []),
    decoracoes: clone(menuData.decoracoes || []),
    customSections: []
  },
  contacts: clone(CONTACTS)
}

export const cloneSiteConfig = (config) => clone(config)

export default defaultSiteConfig
