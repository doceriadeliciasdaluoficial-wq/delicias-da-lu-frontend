import React, { useState, useContext } from 'react'
import { CartContext } from '../context/CartContext'
import { formatPrice, formatPriceWithUnit } from '../utils/formatPrice'
import { useSiteData } from '../context/SiteDataContext'
import ProductDetailsModal from '../components/ProductDetailsModal'

export default function Menu({ setCurrentPage }) {
  const [activeTab, setActiveTab] = useState('bolos')
  const [sweetQuantities, setSweetQuantities] = useState({})
  const [selectedItem, setSelectedItem] = useState(null)
  const { addToCart } = useContext(CartContext)
  const { menuData, contacts } = useSiteData()
  const customSections = menuData.customSections || []
  const tabs = [
    { id: 'bolos', label: '🍰 Bolos' },
    { id: 'doces_simples', label: '🍫 Doces Simples' },
    { id: 'doces_finos', label: '✨ Doces Finos' },
    { id: 'decoracoes', label: '🎀 Decorações' },
    ...customSections.map((section) => ({ id: section.id, label: section.label }))
  ]

  const handleAddSweet = (item, quantity, minQty) => {
    if (quantity >= minQty) {
      addToCart({ 
        name: item.name || item, 
        price: item.price, 
        unit: item.unit, 
        quantity, 
        isSweet: true 
      })
      setSweetQuantities(prev => ({ ...prev, [item.name || item]: minQty }))
    }
  }

  const handleAddBoloSimples = (item) => {
    addToCart({ 
      name: item.name, 
      price: item.price, 
      unit: item.unit,
      description: item.description
    })
  }

  const openDetails = (item, details = []) => {
    setSelectedItem({
      title: item.name || item.label,
      image: item.image,
      description: item.description,
      details,
      raw: item
    })
  }

  const closeDetails = () => setSelectedItem(null)

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-20 py-10 md:py-12">
        {/* Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <h1 className="font-headline-lg text-headline-lg text-on-background relative inline-block">
            ☕ Cardápio
            <span className="absolute -bottom-2 left-1/4 right-1/4 h-[2px] bg-tertiary rounded-full"></span>
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-4 max-w-2xl">
            Massas branca ou chocolate. Cobertura em chantilly. Tudo feito na hora, com carinho.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-10 flex-nowrap overflow-x-auto justify-start md:justify-center sticky top-16 md:top-20 bg-background py-3 z-30 border-b border-outline-variant/60 md:border-b-0 md:relative md:top-0 md:bg-transparent md:py-0 -mx-4 px-4 sm:mx-0 sm:px-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full font-label-md text-label-md transition-all whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-12">
          {/* BOLOS TAB */}
          {activeTab === 'bolos' && (
            <div className="space-y-12">
              {(menuData.bolos || []).reduce((acc, item) => {
                const categoryExists = acc.find(c => c.category === item.category)
                if (categoryExists) {
                  categoryExists.items.push(item)
                } else {
                  acc.push({ category: item.category, items: [item] })
                }
                return acc
              }, []).map((group, idx) => (
                <div key={idx}>
                  <h3 className="font-headline-md text-headline-md text-primary mb-6 flex items-center gap-2">
                    {group.category}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    {group.items.map((item, i) => (
                      <div key={i} className="bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm overflow-hidden">
                        {/* Image Placeholder */}
                        <button
                          type="button"
                          onClick={() => openDetails(item, [
                            { label: 'Categoria', value: item.category || group.category },
                            { label: 'Preço', value: item.customPrice ? 'Valor a combinar' : formatPriceWithUnit(item.price, item.unit) },
                            { label: 'Tipo', value: 'Bolo do cardápio' }
                          ])}
                          className="relative w-full aspect-video bg-gradient-to-br from-primary-fixed-dim to-tertiary-fixed/30 flex items-center justify-center text-4xl overflow-hidden text-left"
                        >
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.style.display = 'none' }}
                            />
                          ) : <span>🍰</span>}
                        </button>
                        {/* Content */}
                        <div className="p-3 sm:p-6">
                          <button type="button" onClick={() => openDetails(item, [
                            { label: 'Categoria', value: item.category || group.category },
                            { label: 'Preço', value: item.customPrice ? 'Valor a combinar' : formatPriceWithUnit(item.price, item.unit) },
                            { label: 'Tipo', value: 'Bolo do cardápio' }
                          ])} className="text-left w-full">
                            <h4 className="font-headline-md text-[1rem] sm:text-headline-md text-on-surface mb-2 leading-tight">{item.name}</h4>
                          </button>
                          <p className="font-body-sm sm:font-body-md text-body-sm sm:text-body-md text-on-surface-variant mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none">{item.description}</p>
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-label-md text-[0.8rem] sm:text-label-md text-primary font-bold">
                              {item.customPrice ? 'Valor a combinar' : formatPriceWithUnit(item.price, item.unit)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => openDetails(item, [
                              { label: 'Categoria', value: item.category || group.category },
                              { label: 'Preço', value: item.customPrice ? 'Valor a combinar' : formatPriceWithUnit(item.price, item.unit) },
                              { label: 'Tipo', value: 'Bolo do cardápio' }
                            ])}
                            className="w-full mb-2 py-2 border border-outline-variant text-on-surface font-label-md text-[0.8rem] sm:text-label-md rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
                          >
                            Ler mais
                          </button>
                          {!item.customPrice && (
                            <button
                              onClick={() => handleAddBoloSimples(item)}
                              className="w-full py-2 bg-primary text-white font-label-md text-[0.8rem] sm:text-label-md rounded-lg hover:bg-primary-light transition-colors cursor-pointer"
                            >
                              Pedir esse
                            </button>
                          )}
                          {item.customPrice && (
                            <button
                              onClick={() => window.open(`${contacts.whatsapp.link}?text=${encodeURIComponent(`${contacts.whatsapp.message.custom}\n\nItem: ${item.name}\nValor: a combinar`)}`, '_blank')}
                              className="w-full py-2 bg-primary text-white font-label-md text-[0.8rem] sm:text-label-md rounded-lg hover:bg-primary-light transition-colors cursor-pointer"
                            >
                              Consultar
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DOCES SIMPLES TAB */}
          {activeTab === 'doces_simples' && (
            <div className="space-y-8">
              <div>
                <h3 className="font-headline-md text-headline-md text-primary mb-6">Tamanho Festa (forminha nº6)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  {(menuData.docesSimples || [])
                    .filter(item => item.category === 'Tamanho Festa (forminha nº6)')
                    .map((item, i) => (
                      <div key={i} className="bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm overflow-hidden">
                        <button
                          type="button"
                          onClick={() => openDetails(item, [
                            { label: 'Categoria', value: item.category },
                            { label: 'Preço', value: formatPriceWithUnit(item.price, item.unit) },
                            { label: 'Quantidade mínima', value: '25 unidades' }
                          ])}
                          className="relative w-full aspect-video bg-gradient-to-br from-primary-fixed-dim to-tertiary-fixed/30 flex items-center justify-center text-4xl text-left"
                        >
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                          ) : <span>🍫</span>}
                        </button>
                        <div className="p-3 sm:p-6">
                          <button type="button" onClick={() => openDetails(item, [
                            { label: 'Categoria', value: item.category },
                            { label: 'Preço', value: formatPriceWithUnit(item.price, item.unit) },
                            { label: 'Quantidade mínima', value: '25 unidades' }
                          ])} className="text-left w-full">
                            <h4 className="font-headline-md text-[1rem] sm:text-headline-md text-on-surface mb-2 leading-tight">{item.name}</h4>
                          </button>
                          <p className="font-body-sm sm:font-body-md text-body-sm sm:text-body-md text-on-surface-variant mb-3 sm:mb-4 line-clamp-3">{item.description}</p>
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-label-md text-[0.8rem] sm:text-label-md text-primary font-bold">{formatPriceWithUnit(item.price, item.unit)}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => openDetails(item, [
                              { label: 'Categoria', value: item.category },
                              { label: 'Preço', value: formatPriceWithUnit(item.price, item.unit) },
                              { label: 'Quantidade mínima', value: '25 unidades' }
                            ])}
                            className="w-full mb-2 py-2 border border-outline-variant text-on-surface font-label-md text-[0.8rem] sm:text-label-md rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
                          >
                            Ler mais
                          </button>
                          <div className="flex items-center gap-1 mb-3 min-w-0">
                            <input type="number" min="25" step="25" defaultValue="25" onChange={(e) => setSweetQuantities(prev => ({ ...prev, [item.name]: parseInt(e.target.value) || 25 }))} className="flex-1 min-w-0 px-2 py-2 border border-outline-variant rounded bg-surface font-label-md text-[0.85rem] sm:text-label-md focus:outline-none focus:ring-2 focus:ring-primary" />
                            <span className="text-xs sm:text-sm text-on-surface-variant flex-shrink-0">un</span>
                          </div>
                          <button onClick={() => handleAddSweet(item, sweetQuantities[item.name] || 25, 25)} className="w-full py-2 bg-primary text-white font-label-md text-[0.78rem] sm:text-label-md rounded-lg hover:bg-primary-light transition-colors cursor-pointer leading-tight min-h-10">
                            Adicionar ao Carrinho
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md text-primary mb-6">Tamanho Maior (caixinha)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  {(menuData.docesSimples || [])
                    .filter(item => item.category === 'Tamanho Maior (caixinha)')
                    .map((item, i) => (
                      <div key={i} className="bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm overflow-hidden">
                        <button
                          type="button"
                          onClick={() => openDetails(item, [
                            { label: 'Categoria', value: item.category },
                            { label: 'Preço', value: formatPriceWithUnit(item.price, item.unit) },
                            { label: 'Quantidade mínima', value: '25 unidades' }
                          ])}
                          className="relative w-full aspect-video bg-gradient-to-br from-primary-fixed-dim to-tertiary-fixed/30 flex items-center justify-center text-4xl text-left"
                        >
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                          ) : <span>🍫</span>}
                        </button>
                        <div className="p-3 sm:p-6">
                          <button type="button" onClick={() => openDetails(item, [
                            { label: 'Categoria', value: item.category },
                            { label: 'Preço', value: formatPriceWithUnit(item.price, item.unit) },
                            { label: 'Quantidade mínima', value: '25 unidades' }
                          ])} className="text-left w-full">
                            <h4 className="font-headline-md text-[1rem] sm:text-headline-md text-on-surface mb-2 leading-tight">{item.name}</h4>
                          </button>
                          <p className="font-body-sm sm:font-body-md text-body-sm sm:text-body-md text-on-surface-variant mb-3 sm:mb-4 line-clamp-3">{item.description}</p>
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-label-md text-[0.8rem] sm:text-label-md text-primary font-bold">{formatPriceWithUnit(item.price, item.unit)}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => openDetails(item, [
                              { label: 'Categoria', value: item.category },
                              { label: 'Preço', value: formatPriceWithUnit(item.price, item.unit) },
                              { label: 'Quantidade mínima', value: '25 unidades' }
                            ])}
                            className="w-full mb-2 py-2 border border-outline-variant text-on-surface font-label-md text-[0.8rem] sm:text-label-md rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
                          >
                            Ler mais
                          </button>
                          <div className="flex items-center gap-1 mb-3 min-w-0">
                            <input type="number" min="25" step="25" defaultValue="25" onChange={(e) => setSweetQuantities(prev => ({ ...prev, [item.name]: parseInt(e.target.value) || 25 }))} className="flex-1 min-w-0 px-2 py-2 border border-outline-variant rounded bg-surface font-label-md text-[0.85rem] sm:text-label-md focus:outline-none focus:ring-2 focus:ring-primary" />
                            <span className="text-xs sm:text-sm text-on-surface-variant flex-shrink-0">un</span>
                          </div>
                          <button onClick={() => handleAddSweet(item, sweetQuantities[item.name] || 25, 25)} className="w-full py-2 bg-primary text-white font-label-md text-[0.78rem] sm:text-label-md rounded-lg hover:bg-primary-light transition-colors cursor-pointer leading-tight min-h-10">
                            Adicionar ao Carrinho
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* DOCES FINOS TAB */}
          {activeTab === 'doces_finos' && (
            <div>
              <h3 className="font-headline-md text-headline-md text-primary mb-6">Doces Finos (por unidade, mín. 15)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {(menuData.docesFinos || []).map((item, i) => (
                  <div key={i} className="bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm overflow-hidden">
                    <div className="relative w-full aspect-video bg-gradient-to-br from-primary-fixed-dim to-tertiary-fixed/30 flex items-center justify-center text-3xl">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                      ) : <span>✨</span>}
                    </div>
                    <div className="p-3 sm:p-6">
                      <h4 className="font-headline-md text-[1rem] sm:text-headline-md text-on-surface mb-2 leading-tight">{item.name}</h4>
                      {item.description && (
                        <p className="font-body-sm sm:font-body-md text-body-sm sm:text-body-md text-on-surface-variant mb-3 sm:mb-4 line-clamp-3">{item.description}</p>
                      )}
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-label-md text-[0.8rem] sm:text-label-md text-primary font-bold">{formatPriceWithUnit(item.price, item.unit)}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-3 min-w-0">
                        <input type="number" min="15" step="15" defaultValue="15" onChange={(e) => setSweetQuantities(prev => ({ ...prev, [item.name]: parseInt(e.target.value) || 15 }))} className="flex-1 min-w-0 px-2 py-2 border border-outline-variant rounded bg-surface font-label-md text-[0.85rem] sm:text-label-md focus:outline-none focus:ring-2 focus:ring-primary" />
                        <span className="text-xs sm:text-sm text-on-surface-variant flex-shrink-0">un</span>
                      </div>
                      <button onClick={() => handleAddSweet(item, sweetQuantities[item.name] || 15, 15)} className="w-full py-2 bg-primary text-white font-label-md text-[0.78rem] sm:text-label-md rounded-lg hover:bg-primary-light transition-colors cursor-pointer leading-tight min-h-10">
                        Adicionar ao Carrinho
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DECORAÇÕES TAB */}
          {activeTab === 'decoracoes' && (
            <div>
              <h3 className="font-headline-md text-headline-md text-primary mb-6">Opções de Decoração</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-8">Decorações têm valores à parte. Consulte no orçamento.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(menuData.decoracoes || []).map((item, i) => (
                  <div key={i} className="bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm p-5 sm:p-6">
                    <div className="flex gap-4">
                      <span className="text-5xl flex-shrink-0">
                        {item.id === 'deco-raspas' && '🍫'}
                        {item.id === 'deco-frutas' && '🍓'}
                        {item.id === 'deco-papelArroz' && '📜'}
                        {item.id === 'deco-toppers' && '🎂'}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-headline-md text-headline-md text-on-surface mb-2">{item.name}</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">{item.description}</p>
                        {item.note && (
                          <div className="bg-tertiary/10 border-l-2 border-tertiary px-3 py-2 rounded">
                            <p className="font-body-xs text-body-xs text-tertiary">{item.note}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {customSections
            .filter((section) => section.id === activeTab)
            .map((section) => (
              <div key={section.id}>
                <h3 className="font-headline-md text-headline-md text-primary mb-6">{section.label}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  {(section.items || []).map((item, i) => (
                      <div key={i} className="bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm overflow-hidden">
                        <button
                          type="button"
                          onClick={() => openDetails(item, [
                            { label: 'Categoria', value: section.label },
                            { label: 'Preço', value: item.price !== undefined ? formatPriceWithUnit(item.price, item.unit || 'un') : 'Não informado' },
                            ...(item.minQuantity ? [{ label: 'Quantidade mínima', value: `${item.minQuantity} unidades` }] : [])
                          ])}
                          className="relative w-full aspect-video bg-gradient-to-br from-primary-fixed-dim to-tertiary-fixed/30 flex items-center justify-center text-3xl text-left"
                        >
                        {item.image ? (
                          <img src={item.image} alt={item.name || item.label} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                        ) : <span>🍮</span>}
                        </button>
                      <div className="p-3 sm:p-6">
                        <button type="button" onClick={() => openDetails(item, [
                          { label: 'Categoria', value: section.label },
                          { label: 'Preço', value: item.price !== undefined ? formatPriceWithUnit(item.price, item.unit || 'un') : 'Não informado' },
                          ...(item.minQuantity ? [{ label: 'Quantidade mínima', value: `${item.minQuantity} unidades` }] : [])
                        ])} className="text-left w-full">
                          <h4 className="font-headline-md text-[1rem] sm:text-headline-md text-on-surface mb-2 leading-tight">{item.name || item.label}</h4>
                        </button>
                        {item.description && (
                          <p className="font-body-sm sm:font-body-md text-body-sm sm:text-body-md text-on-surface-variant mb-3 sm:mb-4 line-clamp-3">{item.description}</p>
                        )}
                        <button
                          type="button"
                          onClick={() => openDetails(item, [
                            { label: 'Categoria', value: section.label },
                            { label: 'Preço', value: item.price !== undefined ? formatPriceWithUnit(item.price, item.unit || 'un') : 'Não informado' },
                            ...(item.minQuantity ? [{ label: 'Quantidade mínima', value: `${item.minQuantity} unidades` }] : [])
                          ])}
                          className="w-full mb-2 py-2 border border-outline-variant text-on-surface font-label-md text-[0.8rem] sm:text-label-md rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
                        >
                          Ler mais
                        </button>
                        {item.price !== undefined && (
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-label-md text-[0.8rem] sm:text-label-md text-primary font-bold">{formatPriceWithUnit(item.price, item.unit || 'un')}</span>
                          </div>
                        )}

                        {item.minQuantity ? (
                          <>
                            <div className="flex items-center gap-1 mb-3 min-w-0">
                              <input
                                type="number"
                                min={item.minQuantity}
                                step={item.minQuantity}
                                defaultValue={item.minQuantity}
                                onChange={(e) => setSweetQuantities(prev => ({ ...prev, [item.name || item.label]: parseInt(e.target.value) || item.minQuantity }))}
                                className="flex-1 min-w-0 px-2 py-2 border border-outline-variant rounded bg-surface font-label-md text-[0.85rem] sm:text-label-md focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                              <span className="text-xs sm:text-sm text-on-surface-variant flex-shrink-0">un</span>
                            </div>
                            <button
                              onClick={() => handleAddSweet(item, sweetQuantities[item.name || item.label] || item.minQuantity, item.minQuantity)}
                              className="w-full py-2 bg-primary text-white font-label-md text-[0.78rem] sm:text-label-md rounded-lg hover:bg-primary-light transition-colors cursor-pointer leading-tight min-h-10"
                            >
                              Adicionar ao Carrinho
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleAddBoloSimples(item)}
                            className="w-full py-2 bg-primary text-white font-label-md text-[0.8rem] sm:text-label-md rounded-lg hover:bg-primary-light transition-colors cursor-pointer"
                          >
                            Adicionar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>

        <ProductDetailsModal
          open={Boolean(selectedItem)}
          item={selectedItem?.raw || selectedItem}
          title={selectedItem?.title}
          image={selectedItem?.image}
          description={selectedItem?.description}
          details={selectedItem?.details || []}
          onClose={closeDetails}
        />

        {/* CTA Footer */}
        <div className="mt-20 text-center p-6 sm:p-8 bg-primary/10 rounded-lg border border-primary/20">
          <p className="font-body-md text-body-md text-on-surface mb-4">Tem dúvidas ou quer algo personalizado?</p>
          <a
            href={contacts.whatsapp.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-primary text-white font-label-md text-label-md rounded-lg hover:bg-primary-light transition-colors w-full sm:w-auto"
          >
            Fale com a Lú no WhatsApp
          </a>
        </div>
      </div>
    </main>
  )
}
