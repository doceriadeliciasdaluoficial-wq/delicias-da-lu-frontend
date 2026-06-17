import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useAdminAuth } from '../context/AdminAuthContext'
import { useSiteData } from '../context/SiteDataContext'
import sortByOrder from '../utils/sortByOrder'
import ImageUploader from '../components/ImageUploader'
import ImageDisplay from '../components/ImageDisplay'

const ADMIN_PATH = '/painel-interno-secreto-lu'

const cakeSections = [
  { key: 'fillings', label: 'Recheios' },
  { key: 'masses', label: 'Massas' },
  { key: 'toppings', label: 'Coberturas' },
  { key: 'decorations', label: 'Decorações' },
  { key: 'sizes', label: 'Tamanhos' }
]

const standardMenuSections = [
  { id: 'bolos', label: '🍰 Bolos' },
  { id: 'docesSimples', label: '🍫 Doces Simples' },
  { id: 'docesFinos', label: '✨ Doces Finos' },
  { id: 'decoracoes', label: '🎀 Decorações' }
]

const standardMenuSectionIds = standardMenuSections.map((section) => section.id)

const emptyToast = { type: '', message: '' }

const baseCakeDefaults = {
  fillings: { id: '', label: '', value: '', order: '', description: '', image: '' },
  masses: { id: '', label: '', value: '', order: '', description: '', fullDescription: '', image: '' },
  toppings: { id: '', label: '', value: '', order: '', description: '', image: '' },
  decorations: { id: '', label: '', value: '', order: '', description: '', note: '', image: '' },
  sizes: { id: '', label: '', value: '', order: '', weight: '', servings: '', description: '', image: '' }
}

const baseMenuDefaults = {
  bolos: { id: '', name: '', category: '', price: '', order: '', unit: 'kg', description: '', image: '', customPrice: false },
  docesSimples: { id: '', name: '', category: '', price: '', order: '', unit: 'cento', minQuantity: '', description: '', image: '' },
  docesFinos: { id: '', name: '', price: '', order: '', unit: 'un', minQuantity: '', description: '', image: '' },
  decoracoes: { id: '', name: '', description: '', note: '', image: '', price: '', order: '' },
  custom: { id: '', name: '', price: '', order: '', unit: 'un', minQuantity: '', description: '', image: '', customPrice: false }
}

const baseHomeFeaturedCake = {
  id: '',
  name: '',
  defaultWeight: '',
  defaultConfig: '',
  basePrice: '',
  order: '',
  tag: '',
  image: '',
  description: '',
  config: {
    size: '',
    mass: '',
    filling: '',
    topping: '',
    decoration: ''
  }
}

const defaultStandardMenuLabels = standardMenuSections.reduce((accumulator, section) => {
  accumulator[section.id] = section.label
  return accumulator
}, {})

const contactEditorBase = {
  whatsapp: {
    number: '',
    display: '',
    link: '',
    message: {
      default: '',
      order: '',
      custom: ''
    }
  },
  email: {
    address: '',
    subject: ''
  },
  instagram: {
    handle: '',
    url: '',
    embedUrl: ''
  },
  location: {
    name: '',
    address: '',
    mapsUrl: ''
  }
}

const schemaLabels = {
  id: 'ID',
  label: 'Rótulo',
  name: 'Nome',
  category: 'Categoria',
  description: 'Descrição',
  fullDescription: 'Descrição completa',
  note: 'Observação',
  value: 'Valor',
  price: 'Preço',
  unit: 'Unidade',
  minQuantity: 'Qtd. mínima',
  weight: 'Peso',
  servings: 'Porções',
  defaultWeight: 'Peso padrão',
  defaultConfig: 'Configuração padrão',
  basePrice: 'Preço base',
  order: 'Ordem',
  tag: 'Tag',
  image: 'Imagem',
  customPrice: 'Preço personalizado',
  size: 'Tamanho',
  mass: 'Massa',
  filling: 'Recheio',
  topping: 'Cobertura',
  decoration: 'Decoração',
  whatsapp: 'WhatsApp',
  email: 'Email',
  instagram: 'Instagram',
  location: 'Localização'
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value))
}

function resequenceItems(items = []) {
  return sortByOrder(items).map((item, index) => ({
    ...item,
    order: index + 1
  }))
}

function resequenceItemsInCurrentOrder(items = []) {
  return items.map((item, index) => ({
    ...item,
    order: index + 1
  }))
}

function moveItem(items = [], fromIndex, toIndex) {
  const next = [...items]
  const [moved] = next.splice(fromIndex, 1)
  const adjustedToIndex = fromIndex < toIndex ? toIndex - 1 : toIndex
  next.splice(Math.max(0, Math.min(adjustedToIndex, next.length)), 0, moved)
  return next
}

function saveItemByOrder(existingItems = [], nextItem, editIndex = null) {
  const baseList = [...existingItems]
  if (editIndex !== null) {
    baseList.splice(editIndex, 1)
  }

  const numericOrder = Number(nextItem?.order)
  const desiredOrder = Number.isFinite(numericOrder) && numericOrder > 0 ? Math.floor(numericOrder) : baseList.length + 1
  const insertionIndex = Math.max(0, Math.min(desiredOrder - 1, baseList.length))

  const nextList = [...baseList]
  nextList.splice(insertionIndex, 0, nextItem)
  return resequenceItemsInCurrentOrder(nextList)
}

function normalizeSiteOrders(config) {
  const next = deepClone(config)

  if (next.cakeBuilder) {
    cakeSections.forEach((section) => {
      next.cakeBuilder[section.key] = resequenceItems(next.cakeBuilder[section.key] || [])
    })
  }

  if (next.home?.featuredCakes) {
    next.home.featuredCakes = resequenceItems(next.home.featuredCakes)
  }

  if (next.menu) {
    standardMenuSectionIds.forEach((sectionId) => {
      next.menu[sectionId] = resequenceItems(next.menu[sectionId] || [])
    })

    next.menu.customSections = resequenceItems(next.menu.customSections || []).map((section, index) => ({
      ...section,
      order: index + 1,
      items: resequenceItems(section.items || [])
    }))
  }

  return next
}

function formatBrazilianPhone(value) {
  let digits = String(value || '').replace(/\D/g, '')
  if (!digits) return ''

  // Remove código do país se presente
  if (digits.startsWith('55')) {
    digits = digits.slice(2)
  }

  // Valida e formata
  if (digits.length < 10) return digits // Número incompleto

  // Se tem 10 dígitos (fixo), formata como (XX) XXXX-XXXX
  if (digits.length === 10) {
    const ddd = digits.slice(0, 2)
    const subscriber = digits.slice(2)
    return `(${ddd}) ${subscriber.slice(0, 4)}-${subscriber.slice(4, 8)}`
  }

  // Se tem 11 dígitos (celular), formata como (XX) XXXXX-XXXX
  if (digits.length === 11) {
    const ddd = digits.slice(0, 2)
    const subscriber = digits.slice(2)
    return `(${ddd}) ${subscriber.slice(0, 5)}-${subscriber.slice(5, 9)}`
  }

  // Se tem mais de 11 dígitos (com código do país), formata com +55
  if (digits.length > 11) {
    // Trata como se tivesse código do país
    const fullDigits = value.replace(/\D/g, '')
    const hasFiftyFive = fullDigits.startsWith('55')
    const localDigits = hasFiftyFive ? fullDigits.slice(2) : fullDigits
    
    if (localDigits.length === 10) {
      const ddd = localDigits.slice(0, 2)
      const subscriber = localDigits.slice(2)
      return `+55 (${ddd}) ${subscriber.slice(0, 4)}-${subscriber.slice(4, 8)}`
    }
    
    if (localDigits.length === 11) {
      const ddd = localDigits.slice(0, 2)
      const subscriber = localDigits.slice(2)
      return `+55 (${ddd}) ${subscriber.slice(0, 5)}-${subscriber.slice(5, 9)}`
    }
  }

  return digits
}

function sanitizeBrazilianPhoneInput(value) {
  return String(value || '').replace(/\D/g, '')
}

function createId(prefix = 'item') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`
}

function getPathValue(object, path) {
  return path.split('.').reduce((accumulator, key) => (accumulator ? accumulator[key] : undefined), object)
}

function setPathValue(object, path, value) {
  const next = deepClone(object)
  const keys = path.split('.')
  let cursor = next

  for (let index = 0; index < keys.length - 1; index += 1) {
    const key = keys[index]
    cursor[key] = cursor[key] || {}
    cursor = cursor[key]
  }

  cursor[keys[keys.length - 1]] = value
  return next
}

function normalizeNumbers(item) {
  const next = deepClone(item)

  const numberFields = ['value', 'price', 'basePrice']
  const intFields = ['minQuantity']

  numberFields.forEach((field) => {
    if (next[field] !== '' && next[field] !== undefined) {
      const parsed = Number(String(next[field]).replace(',', '.'))
      next[field] = Number.isNaN(parsed) ? 0 : parsed
    }
  })

  intFields.forEach((field) => {
    if (next[field] !== '' && next[field] !== undefined) {
      const parsed = parseInt(String(next[field]), 10)
      next[field] = Number.isNaN(parsed) ? 0 : parsed
    }
  })

  return next
}

function getBaseCakeItem(sectionKey) {
  return {
    ...deepClone(baseCakeDefaults[sectionKey]),
    id: createId(sectionKey)
  }
}

function getBaseMenuItem(sectionKey) {
  const base = baseMenuDefaults[sectionKey] || baseMenuDefaults.custom
  return {
    ...deepClone(base),
    id: createId(sectionKey),
    category: sectionKey  // Auto-set category to the section ID
  }
}

function getBaseHomeItem() {
  return {
    ...deepClone(baseHomeFeaturedCake),
    id: createId('featured')
  }
}

function getContactsDraft(contacts) {
  const safeContacts = contacts || {}
  return deepClone({
    ...contactEditorBase,
    ...safeContacts,
    whatsapp: {
      ...contactEditorBase.whatsapp,
      ...(safeContacts.whatsapp || {})
    },
    email: {
      ...contactEditorBase.email,
      ...(safeContacts.email || {})
    },
    instagram: {
      ...contactEditorBase.instagram,
      ...(safeContacts.instagram || {})
    },
    location: {
      ...contactEditorBase.location,
      ...(safeContacts.location || {})
    }
  })
}

function getCakeSchema(sectionKey, cakeBuilder) {
  const sectionOptions = {
    fillings: [
      { path: 'id', type: 'text', label: 'ID' },
      { path: 'label', type: 'text', label: 'Rótulo' },
      { path: 'value', type: 'number', label: 'Valor', step: '0.01' },
      { path: 'order', type: 'number', label: 'Ordem', step: '1' },
      { path: 'description', type: 'textarea', label: 'Descrição' },
      { path: 'image', type: 'image', label: 'Imagem' }
    ],
    masses: [
      { path: 'id', type: 'text', label: 'ID' },
      { path: 'label', type: 'text', label: 'Rótulo' },
      { path: 'value', type: 'number', label: 'Valor', step: '0.01' },
      { path: 'order', type: 'number', label: 'Ordem', step: '1' },
      { path: 'description', type: 'textarea', label: 'Descrição' },
      { path: 'fullDescription', type: 'textarea', label: 'Descrição completa' },
      { path: 'image', type: 'image', label: 'Imagem' }
    ],
    toppings: [
      { path: 'id', type: 'text', label: 'ID' },
      { path: 'label', type: 'text', label: 'Rótulo' },
      { path: 'value', type: 'number', label: 'Valor', step: '0.01' },
      { path: 'order', type: 'number', label: 'Ordem', step: '1' },
      { path: 'description', type: 'textarea', label: 'Descrição' },
      { path: 'image', type: 'image', label: 'Imagem' }
    ],
    decorations: [
      { path: 'id', type: 'text', label: 'ID' },
      { path: 'label', type: 'text', label: 'Rótulo' },
      { path: 'value', type: 'number', label: 'Valor', step: '0.01' },
      { path: 'order', type: 'number', label: 'Ordem', step: '1' },
      { path: 'description', type: 'textarea', label: 'Descrição' },
      { path: 'note', type: 'textarea', label: 'Observação' },
      { path: 'image', type: 'image', label: 'Imagem' }
    ],
    sizes: [
      { path: 'id', type: 'text', label: 'ID' },
      { path: 'label', type: 'text', label: 'Rótulo' },
      { path: 'value', type: 'number', label: 'Valor', step: '0.01' },
      { path: 'order', type: 'number', label: 'Ordem', step: '1' },
      { path: 'weight', type: 'text', label: 'Peso' },
      { path: 'servings', type: 'text', label: 'Porções' },
      { path: 'description', type: 'textarea', label: 'Descrição' },
      { path: 'image', type: 'image', label: 'Imagem' }
    ]
  }

  return sectionOptions[sectionKey] || sectionOptions.fillings
}

function getMenuSchema(sectionId, cakeBuilder) {
  const standardSchemas = {
    bolos: [
      { path: 'id', type: 'text', label: 'ID' },
      { path: 'name', type: 'text', label: 'Nome' },
      { path: 'category', type: 'text', label: 'Categoria' },
      { path: 'price', type: 'number', label: 'Preço', step: '0.01' },
      { path: 'order', type: 'number', label: 'Ordem', step: '1' },
      { path: 'unit', type: 'text', label: 'Unidade' },
      { path: 'description', type: 'textarea', label: 'Descrição' },
      { path: 'image', type: 'image', label: 'Imagem' },
      { path: 'customPrice', type: 'checkbox', label: 'Preço personalizado' }
    ],
    docesSimples: [
      { path: 'id', type: 'text', label: 'ID' },
      { path: 'name', type: 'text', label: 'Nome' },
      { path: 'category', type: 'text', label: 'Categoria' },
      { path: 'price', type: 'number', label: 'Preço', step: '0.01' },
      { path: 'order', type: 'number', label: 'Ordem', step: '1' },
      { path: 'unit', type: 'text', label: 'Unidade' },
      { path: 'minQuantity', type: 'number', label: 'Qtd. mínima', step: '1' },
      { path: 'description', type: 'textarea', label: 'Descrição' },
      { path: 'image', type: 'image', label: 'Imagem' }
    ],
    docesFinos: [
      { path: 'id', type: 'text', label: 'ID' },
      { path: 'name', type: 'text', label: 'Nome' },
      { path: 'price', type: 'number', label: 'Preço', step: '0.01' },
      { path: 'order', type: 'number', label: 'Ordem', step: '1' },
      { path: 'unit', type: 'text', label: 'Unidade' },
      { path: 'minQuantity', type: 'number', label: 'Qtd. mínima', step: '1' },
      { path: 'description', type: 'textarea', label: 'Descrição' },
      { path: 'image', type: 'image', label: 'Imagem' }
    ],
    decoracoes: [
      { path: 'id', type: 'text', label: 'ID' },
      { path: 'name', type: 'text', label: 'Nome' },
      { path: 'description', type: 'textarea', label: 'Descrição' },
      { path: 'note', type: 'textarea', label: 'Observação' },
      { path: 'order', type: 'number', label: 'Ordem', step: '1' },
      { path: 'image', type: 'image', label: 'Imagem' },
      { path: 'price', type: 'number', label: 'Preço', step: '0.01' }
    ]
  }

  if (standardSchemas[sectionId]) return standardSchemas[sectionId]

  return [
    { path: 'id', type: 'text', label: 'ID' },
    { path: 'name', type: 'text', label: 'Nome' },
    { path: 'price', type: 'number', label: 'Preço', step: '0.01' },
    { path: 'unit', type: 'text', label: 'Unidade' },
    { path: 'minQuantity', type: 'number', label: 'Qtd. mínima', step: '1' },
    { path: 'description', type: 'textarea', label: 'Descrição' },
    { path: 'image', type: 'image', label: 'Imagem' },
    { path: 'customPrice', type: 'checkbox', label: 'Preço personalizado' }
  ]
}

function getStandardMenuLabel(sectionId, sectionLabels = {}) {
  return sectionLabels[sectionId] || defaultStandardMenuLabels[sectionId] || sectionId
}

function getHomeSchema(cakeBuilder) {
  return [
    { path: 'id', type: 'text', label: 'ID' },
    { path: 'name', type: 'text', label: 'Nome' },
    { path: 'defaultWeight', type: 'text', label: 'Peso padrão' },
    { path: 'defaultConfig', type: 'text', label: 'Configuração padrão' },
    { path: 'basePrice', type: 'number', label: 'Preço base', step: '0.01' },
    { path: 'order', type: 'number', label: 'Ordem', step: '1' },
    { path: 'tag', type: 'text', label: 'Tag' },
    { path: 'description', type: 'textarea', label: 'Descrição' },
    { path: 'image', type: 'image', label: 'Imagem' },
    { path: 'config.size', type: 'select', label: 'Tamanho do Cake Builder', options: cakeBuilder.sizes.map((size) => ({ value: size.id, label: size.label })) },
    { path: 'config.mass', type: 'select', label: 'Massa do Cake Builder', options: cakeBuilder.masses.map((mass) => ({ value: mass.id, label: mass.label })) },
    { path: 'config.filling', type: 'select', label: 'Recheio do Cake Builder', options: cakeBuilder.fillings.map((filling) => ({ value: filling.id, label: filling.label })) },
    { path: 'config.topping', type: 'select', label: 'Cobertura do Cake Builder', options: cakeBuilder.toppings.map((topping) => ({ value: topping.id, label: topping.label })) },
    { path: 'config.decoration', type: 'select', label: 'Decoração do Cake Builder', options: cakeBuilder.decorations.map((decoration) => ({ value: decoration.id, label: decoration.label })) }
  ]
}

function getContactSchema() {
  return [
    { path: 'whatsapp.number', type: 'text', label: 'WhatsApp (número internacional)' },
    { path: 'whatsapp.display', type: 'text', label: 'WhatsApp (texto exibido)' },
    { path: 'whatsapp.message.default', type: 'textarea', label: 'Mensagem padrão' },
    { path: 'whatsapp.message.order', type: 'textarea', label: 'Mensagem de pedido' },
    { path: 'whatsapp.message.custom', type: 'textarea', label: 'Mensagem personalizada' },
    { path: 'email.address', type: 'text', label: 'Email' },
    { path: 'email.subject', type: 'text', label: 'Assunto do email' },
    { path: 'instagram.handle', type: 'text', label: 'Instagram handle' },
    { path: 'instagram.url', type: 'text', label: 'Instagram URL' },
    { path: 'instagram.embedUrl', type: 'text', label: 'Instagram embed URL' },
    { path: 'location.name', type: 'text', label: 'Nome da localização' },
    { path: 'location.address', type: 'text', label: 'Endereço' },
    { path: 'location.mapsUrl', type: 'text', label: 'URL do Google Maps' }
  ]
}

function FormField({ field, value, onChange }) {
  const label = schemaLabels[field.path] || field.label || field.path

  if (field.type === 'textarea') {
    return (
      <label className="flex flex-col gap-1">
        <span className="text-sm text-on-surface-variant">{label}</span>
        <textarea
          rows={field.rows || 3}
          value={value ?? ''}
          onChange={(event) => onChange(field.path, event.target.value)}
          className="w-full border border-outline-variant rounded-lg px-3 py-2 bg-surface min-h-24"
        />
      </label>
    )
  }

  if (field.type === 'select') {
    return (
      <label className="flex flex-col gap-1">
        <span className="text-sm text-on-surface-variant">{label}</span>
        <select
          value={value ?? ''}
          onChange={(event) => onChange(field.path, event.target.value)}
          className="w-full border border-outline-variant rounded-lg px-3 py-2 bg-surface"
        >
          <option value="">Selecione</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    )
  }

  if (field.type === 'checkbox') {
    return (
      <label className="flex items-center gap-2 rounded-lg border border-outline-variant px-3 py-3 bg-surface mt-1">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(field.path, event.target.checked)}
        />
        <span className="text-sm text-on-surface-variant">{label}</span>
      </label>
    )
  }

  if (field.type === 'image') {
    return (
      <div className="md:col-span-2">
        <ImageUploader
          label={label}
          onImageBase64Change={(base64, mimeType) => {
            onChange(field.path, base64 === null ? null : (base64 || ''))
          }}
        />
        {value && (
          <div className="mt-3">
            <p className="text-xs text-on-surface-variant mb-2">Prévia:</p>
            <ImageDisplay
              imageBase64={value}
              alt={`${field.path}-preview`}
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
                borderRadius: '8px',
                border: '1px solid var(--md-sys-color-outline-variant)',
              }}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-on-surface-variant">{label}</span>
      <input
        type={field.type === 'number' ? 'number' : 'text'}
        step={field.step || (field.type === 'number' ? '0.01' : '1')}
        value={field.path === 'whatsapp.number' ? formatBrazilianPhone(value) : (value ?? '')}
        onChange={(event) => onChange(field.path, field.path === 'whatsapp.number' ? sanitizeBrazilianPhoneInput(event.target.value) : event.target.value)}
        className="w-full border border-outline-variant rounded-lg px-3 py-2 bg-surface"
      />
    </label>
  )
}

function EditorModal({ open, title, subtitle, schema, item, onChange, onClose, onSave, saveLabel = 'Salvar' }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-4xl bg-background rounded-2xl shadow-2xl border border-outline-variant overflow-hidden max-h-[92vh] flex flex-col">
        <div className="px-5 py-4 border-b border-outline-variant flex items-start justify-between gap-4 bg-surface">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-background">{title}</h2>
            {subtitle && <p className="text-sm text-on-surface-variant mt-1">{subtitle}</p>}
          </div>
          <button type="button" className="px-3 py-2 rounded-lg bg-surface-container border border-outline-variant" onClick={onClose}>
            Fechar
          </button>
        </div>

        <div className="p-5 overflow-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schema.map((field) => (
              <FormField key={field.path} field={field} value={getPathValue(item, field.path)} onChange={onChange} />
            ))}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-outline-variant bg-surface flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button type="button" className="px-4 py-2 rounded-lg bg-surface-container border border-outline-variant" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="px-4 py-2 rounded-lg bg-primary text-white font-semibold" onClick={onSave}>
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

function SectionList({ title, items, onEdit, onDelete, onAdd, addLabel = 'Novo item', onEditSection, onDeleteSection, onReorder }) {
  const [draggedIndex, setDraggedIndex] = useState(null)

  const handleDrop = (dropIndex) => {
    if (draggedIndex === null || draggedIndex === dropIndex || !onReorder) return
    onReorder(draggedIndex, dropIndex)
    setDraggedIndex(null)
  }

  return (
    <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
      <div className="px-4 py-3 border-b border-outline-variant bg-surface-container-lowest flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h3 className="font-semibold text-on-surface">{title}</h3>
          <span className="text-sm text-on-surface-variant">{items.length} itens</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {onEditSection && (
            <button type="button" className="px-3 py-2 rounded-lg bg-surface-container border border-outline-variant text-sm" onClick={onEditSection}>
              Editar seção
            </button>
          )}
          {onDeleteSection && (
            <button type="button" className="px-3 py-2 rounded-lg bg-error/10 text-error border border-error/20 text-sm" onClick={onDeleteSection}>
              Excluir seção
            </button>
          )}
          {onAdd && (
            <button type="button" className="px-3 py-2 rounded-lg bg-primary text-white text-sm" onClick={onAdd}>
              {addLabel}
            </button>
          )}
        </div>
      </div>
      <div className="max-h-[440px] overflow-auto">
        {items.length === 0 && <p className="p-4 text-sm text-on-surface-variant">Sem itens nesta seção.</p>}
        {items.map((item, index) => (
          <div
            key={item.id || `${item.name || item.label}-${index}`}
            draggable={Boolean(onReorder)}
            onDragStart={() => setDraggedIndex(index)}
            onDragOver={(event) => {
              if (!onReorder) return
              event.preventDefault()
            }}
            onDrop={() => handleDrop(index)}
            onDragEnd={() => setDraggedIndex(null)}
            className={`p-4 border-b border-outline-variant/70 last:border-b-0 flex flex-col sm:flex-row sm:justify-between gap-3 ${onReorder ? 'cursor-grab active:cursor-grabbing' : ''} ${draggedIndex === index ? 'bg-primary/5' : ''}`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                {onReorder && <span className="text-on-surface-variant flex-shrink-0">⋮⋮</span>}
                <p className="font-medium text-on-surface truncate">{item.name || item.label || item.id}</p>
              </div>
              <p className="text-xs text-on-surface-variant truncate">ID: {item.id || 'sem-id'}</p>
              {item.order !== undefined && item.order !== '' && (
                <p className="text-xs text-on-surface-variant truncate">Ordem: {item.order}</p>
              )}
            </div>
            <div className="flex gap-2 flex-wrap flex-shrink-0">
              <button type="button" className="px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant text-sm" onClick={() => onEdit(index)}>
                Editar
              </button>
              <button type="button" className="px-3 py-1.5 rounded-lg bg-error/10 text-error border border-error/20 text-sm" onClick={() => onDelete(index)}>
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminPanel({ onExit }) {
  const { isAuthenticated, login, logout } = useAdminAuth()
  const { siteConfig, menuData, cakeBuilder, contacts, updateSiteConfig, resetSiteConfig } = useSiteData()

  const [activeTab, setActiveTab] = useState('cakebuilder')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [toast, setToast] = useState(emptyToast)

  const [selectedCakeSection, setSelectedCakeSection] = useState('fillings')
  const [selectedMenuSection, setSelectedMenuSection] = useState('bolos')

  const [editor, setEditor] = useState(null)
  const hasNormalizedOrdersRef = useRef(false)

  useEffect(() => {
    if (!toast.message) return undefined
    const timeout = setTimeout(() => setToast(emptyToast), 2600)
    return () => clearTimeout(timeout)
  }, [toast])

  useEffect(() => {
    if (!isAuthenticated || hasNormalizedOrdersRef.current) return
    const normalized = normalizeSiteOrders(siteConfig)
    if (JSON.stringify(normalized) !== JSON.stringify(siteConfig)) {
      updateSiteConfig(normalized)
    }
    hasNormalizedOrdersRef.current = true
  }, [isAuthenticated, siteConfig, updateSiteConfig])

  const customMenuSections = menuData.customSections || []
  const sectionLabels = menuData.sectionLabels || {}

  const menuSections = useMemo(() => {
    const standard = standardMenuSections.map((section) => ({
      id: section.id,
      label: getStandardMenuLabel(section.id, sectionLabels),
      items: menuData[section.id] || [],
      custom: false
    }))

    const custom = sortByOrder(customMenuSections).map((section) => ({
      id: section.id,
      label: section.label,
      items: section.items || [],
      custom: true
    }))

    return [...standard, ...custom]
  }, [customMenuSections, menuData, sectionLabels])

  const currentCakeItems = sortByOrder(cakeBuilder[selectedCakeSection] || [])
  const currentMenuSection = menuSections.find((section) => section.id === selectedMenuSection)
  const homeFeatured = sortByOrder(siteConfig.home?.featuredCakes || [])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const openEditor = (nextEditor) => {
    setEditor(nextEditor)
  }

  const closeEditor = () => setEditor(null)

  const updateEditorField = (path, value) => {
    setEditor((current) => ({
      ...current,
      item: setPathValue(current.item, path, value)
    }))
  }

  const getMenuSectionById = (sectionId) => menuSections.find((section) => section.id === sectionId)

  const getMenuItemsBySectionId = (sectionId) => {
    if (standardMenuSectionIds.includes(sectionId)) {
      return menuData[sectionId] || []
    }

    return getMenuSectionById(sectionId)?.items || []
  }

  const reorderCakeItems = (sectionKey, fromIndex, toIndex) => {
    updateSiteConfig((current) => {
      const next = deepClone(current)
      const list = sortByOrder(next.cakeBuilder[sectionKey] || [])
      next.cakeBuilder[sectionKey] = resequenceItemsInCurrentOrder(moveItem(list, fromIndex, toIndex))
      return next
    })
  }

  const reorderHomeItems = (fromIndex, toIndex) => {
    updateSiteConfig((current) => {
      const next = deepClone(current)
      const list = sortByOrder(next.home?.featuredCakes || [])
      next.home = next.home || {}
      next.home.featuredCakes = resequenceItemsInCurrentOrder(moveItem(list, fromIndex, toIndex))
      return next
    })
  }

  const reorderMenuItems = (sectionId, fromIndex, toIndex) => {
    updateSiteConfig((current) => {
      const next = deepClone(current)

      if (standardMenuSectionIds.includes(sectionId)) {
        const list = sortByOrder(next.menu[sectionId] || [])
        next.menu[sectionId] = resequenceItemsInCurrentOrder(moveItem(list, fromIndex, toIndex))
        return next
      }

      next.menu.customSections = (next.menu.customSections || []).map((section) => {
        if (section.id !== sectionId) return section
        const list = sortByOrder(section.items || [])
        return { ...section, items: resequenceItemsInCurrentOrder(moveItem(list, fromIndex, toIndex)) }
      })

      return next
    })
  }

  const beginCreateMenuItemForSection = (sectionId) => {
    const section = getMenuSectionById(sectionId)
    openEditor({
      kind: 'menu',
      sectionKey: sectionId,
      index: null,
      title: `Novo item em ${section?.label || 'Cardápio'}`,
      item: { ...getBaseMenuItem(sectionId), order: String(getMenuItemsBySectionId(sectionId).length + 1) },
      schema: getMenuSchema(sectionId, cakeBuilder),
      saveLabel: 'Salvar item'
    })
  }

  const beginEditMenuItemForSection = (sectionId, index) => {
    const section = getMenuSectionById(sectionId)
    const item = deepClone(getMenuItemsBySectionId(sectionId)[index] || {})
    openEditor({
      kind: 'menu',
      sectionKey: sectionId,
      index,
      title: `Editar item de ${section?.label || 'Cardápio'}`,
      item,
      schema: getMenuSchema(sectionId, cakeBuilder),
      saveLabel: 'Salvar alterações'
    })
  }

  const beginEditMenuSectionById = (sectionId) => {
    const section = getMenuSectionById(sectionId)
    if (!section) return

    if (!section.custom) {
      openEditor({
        kind: 'menu-label',
        sectionKey: sectionId,
        title: `Editar nome de ${section.label}`,
        item: { label: section.label },
        schema: [{ path: 'label', type: 'text', label: 'Nome exibido' }],
        saveLabel: 'Salvar nome'
      })
      return
    }

    openEditor({
      kind: 'menu-section',
      sectionKey: sectionId,
      originalId: sectionId,
      index: null,
      title: 'Editar seção de cardápio',
      item: { id: section.id, label: section.label },
      schema: [
        { path: 'id', type: 'text', label: 'ID da seção' },
        { path: 'label', type: 'text', label: 'Nome da seção' }
      ],
      saveLabel: 'Salvar seção'
    })
  }

  const deleteCustomSectionById = (sectionId) => {
    const section = getMenuSectionById(sectionId)
    if (!section?.custom) return
    if (!confirmDelete('Tem certeza que deseja excluir esta seção e todos os itens dela?')) return

    updateSiteConfig((current) => {
      const next = deepClone(current)
      next.menu.customSections = (next.menu.customSections || []).filter((customSection) => customSection.id !== sectionId)
      return next
    })

    if (selectedMenuSection === sectionId) {
      setSelectedMenuSection('bolos')
    }

    showToast('Seção excluída com sucesso.')
  }

  const deleteMenuItemForSection = (sectionId, index) => {
    if (!confirmDelete('Tem certeza que deseja excluir este item do cardápio?')) return

    updateSiteConfig((current) => {
      const next = deepClone(current)

      if (standardMenuSectionIds.includes(sectionId)) {
        next.menu[sectionId] = (next.menu[sectionId] || []).filter((_, currentIndex) => currentIndex !== index)
        return next
      }

      next.menu.customSections = (next.menu.customSections || []).map((section) => (
        section.id === sectionId
          ? { ...section, items: (section.items || []).filter((_, currentIndex) => currentIndex !== index) }
          : section
      ))
      return next
    })

    showToast('Item excluído com sucesso.')
  }

  const beginCreateCakeItem = () => {
    openEditor({
      kind: 'cake',
      sectionKey: selectedCakeSection,
      index: null,
      title: `Novo item em ${cakeSections.find((section) => section.key === selectedCakeSection)?.label || 'Cake Builder'}`,
      item: { ...getBaseCakeItem(selectedCakeSection), order: String(currentCakeItems.length + 1) },
      schema: getCakeSchema(selectedCakeSection, cakeBuilder),
      saveLabel: 'Salvar item'
    })
  }

  const beginEditCakeItem = (index) => {
    const item = deepClone(currentCakeItems[index])
    openEditor({
      kind: 'cake',
      sectionKey: selectedCakeSection,
      index,
      title: `Editar ${cakeSections.find((section) => section.key === selectedCakeSection)?.label || 'item'}`,
      item,
      schema: getCakeSchema(selectedCakeSection, cakeBuilder),
      saveLabel: 'Salvar alterações'
    })
  }

  const beginCreateMenuItem = () => {
    openEditor({
      kind: 'menu',
      sectionKey: selectedMenuSection,
      index: null,
      title: `Novo item em ${currentMenuSection?.label || 'Cardápio'}`,
      item: { ...getBaseMenuItem(selectedMenuSection), order: String(getMenuItemsBySectionId(selectedMenuSection).length + 1) },
      schema: getMenuSchema(selectedMenuSection, cakeBuilder),
      saveLabel: 'Salvar item'
    })
  }

  const beginEditMenuItem = (index) => {
    const item = deepClone(currentMenuSection?.items[index] || {})
    openEditor({
      kind: 'menu',
      sectionKey: selectedMenuSection,
      index,
      title: `Editar item de ${currentMenuSection?.label || 'Cardápio'}`,
      item,
      schema: getMenuSchema(selectedMenuSection, cakeBuilder),
      saveLabel: 'Salvar alterações'
    })
  }

  const beginCreateMenuSection = () => {
    openEditor({
      kind: 'menu-section',
      sectionKey: null,
      index: null,
      title: 'Nova seção de cardápio',
      item: { id: '', label: '', order: String(customMenuSections.length + 1) },
      schema: [
        { path: 'id', type: 'text', label: 'ID da seção' },
        { path: 'label', type: 'text', label: 'Nome da seção' },
        { path: 'order', type: 'number', label: 'Ordem', step: '1' }
      ],
      saveLabel: 'Criar seção'
    })
  }

  const beginEditMenuSection = () => {
    if (!currentMenuSection?.custom) return
    openEditor({
      kind: 'menu-section',
      sectionKey: selectedMenuSection,
      originalId: selectedMenuSection,
      index: null,
      title: 'Editar seção de cardápio',
      item: { id: currentMenuSection.id, label: currentMenuSection.label, order: currentMenuSection.order || '' },
      schema: [
        { path: 'id', type: 'text', label: 'ID da seção' },
        { path: 'label', type: 'text', label: 'Nome da seção' },
        { path: 'order', type: 'number', label: 'Ordem', step: '1' }
      ],
      saveLabel: 'Salvar seção'
    })
  }

  const beginCreateHomeItem = () => {
    openEditor({
      kind: 'home',
      index: null,
      title: 'Novo destaque da Home',
      item: { ...getBaseHomeItem(), order: String(homeFeatured.length + 1) },
      schema: getHomeSchema(cakeBuilder),
      saveLabel: 'Salvar destaque'
    })
  }

  const beginEditHomeItem = (index) => {
    openEditor({
      kind: 'home',
      index,
      title: 'Editar destaque da Home',
      item: deepClone(homeFeatured[index]),
      schema: getHomeSchema(cakeBuilder),
      saveLabel: 'Salvar alterações'
    })
  }

  const beginEditContacts = () => {
    openEditor({
      kind: 'contacts',
      title: 'Editar contatos e integrações',
      item: getContactsDraft(contacts),
      schema: getContactSchema(),
      saveLabel: 'Salvar contatos'
    })
  }

  const confirmDelete = (message) => window.confirm(message)

  const saveEditor = async () => {
    if (!editor) return

    if (editor.kind === 'cake') {
      const normalized = normalizeNumbers(editor.item)
      await updateSiteConfig((current) => {
        const next = deepClone(current)
        next.cakeBuilder[editor.sectionKey] = saveItemByOrder(next.cakeBuilder[editor.sectionKey] || [], normalized, editor.index)
        return next
      })
      showToast('Item do Cake Builder salvo com sucesso.')
      closeEditor()
      return
    }

    if (editor.kind === 'menu') {
      const normalized = normalizeNumbers(editor.item)
      await updateSiteConfig((current) => {
        const next = deepClone(current)
        const standardIds = standardMenuSectionIds

        if (standardIds.includes(editor.sectionKey)) {
          next.menu[editor.sectionKey] = saveItemByOrder(next.menu[editor.sectionKey] || [], normalized, editor.index)
          return next
        }

        next.menu.customSections = (next.menu.customSections || []).map((section) => {
          if (section.id !== editor.sectionKey) return section
          return { ...section, items: saveItemByOrder(section.items || [], normalized, editor.index) }
        })

        return next
      })
      showToast('Item do cardápio salvo com sucesso.')
      closeEditor()
      return
    }

    if (editor.kind === 'menu-section') {
      await updateSiteConfig((current) => {
        const next = deepClone(current)
        const customSections = [...(next.menu.customSections || [])]
        const originalId = editor.originalId || editor.sectionKey
        const nextId = String(editor.item.id || '').trim()
        const nextLabel = String(editor.item.label || '').trim()
        const nextOrder = String(editor.item.order || '').trim()

        if (!nextId || !nextLabel) return current

        const existingIndex = customSections.findIndex((section) => section.id === originalId)
        const payload = { id: nextId, label: nextLabel, order: nextOrder, items: existingIndex >= 0 ? customSections[existingIndex].items || [] : [] }

        if (existingIndex >= 0) {
          customSections[existingIndex] = payload
        } else {
          customSections.push(payload)
        }

        next.menu.customSections = resequenceItems(sortByOrder(customSections).map((section) => ({
          ...section,
          items: resequenceItems(section.items || [])
        })))
        return next
      })
      setSelectedMenuSection(String(editor.item.id || '').trim())
      showToast('Seção do cardápio salva com sucesso.')
      closeEditor()
      return
    }

    if (editor.kind === 'menu-label') {
      const nextLabel = String(editor.item.label || '').trim()
      if (!nextLabel) return

      await updateSiteConfig((current) => {
        const next = deepClone(current)
        next.menu.sectionLabels = {
          ...(next.menu.sectionLabels || {}),
          [editor.sectionKey]: nextLabel
        }
        return next
      })
      showToast('Nome do cardápio salvo com sucesso.')
      closeEditor()
      return
    }

    if (editor.kind === 'home') {
      const normalized = normalizeNumbers(editor.item)
      await updateSiteConfig((current) => {
        const next = deepClone(current)
        next.home = next.home || {}
        next.home.featuredCakes = saveItemByOrder(next.home.featuredCakes || [], normalized, editor.index)
        return next
      })
      showToast('Destaque da Home salvo com sucesso.')
      closeEditor()
      return
    }

    if (editor.kind === 'contacts') {
      await updateSiteConfig((current) => {
        const next = deepClone(current)
        const sanitizedNumber = String(getPathValue(editor.item, 'whatsapp.number') || '').replace(/\D/g, '')
        next.contacts = deepClone(editor.item)
        next.contacts.whatsapp = next.contacts.whatsapp || {}
        next.contacts.whatsapp.number = sanitizedNumber
        next.contacts.whatsapp.link = sanitizedNumber ? `https://wa.me/${sanitizedNumber}` : ''
        return next
      })
      showToast('Contatos salvos com sucesso.')
      closeEditor()
    }
  }

  const deleteCakeItem = (index) => {
    if (!confirmDelete('Tem certeza que deseja excluir este item do Cake Builder?')) return
    updateSiteConfig((current) => {
      const next = deepClone(current)
      next.cakeBuilder[selectedCakeSection] = resequenceItems((next.cakeBuilder[selectedCakeSection] || []).filter((_, currentIndex) => currentIndex !== index))
      return next
    })
    showToast('Item excluído com sucesso.')
  }

  const deleteMenuItem = (index) => {
    if (!confirmDelete('Tem certeza que deseja excluir este item do cardápio?')) return
    updateSiteConfig((current) => {
      const next = deepClone(current)
      const standardIds = standardMenuSections.map((section) => section.id)

      if (standardIds.includes(selectedMenuSection)) {
        next.menu[selectedMenuSection] = resequenceItems((next.menu[selectedMenuSection] || []).filter((_, currentIndex) => currentIndex !== index))
        return next
      }

      next.menu.customSections = (next.menu.customSections || []).map((section) => (
        section.id === selectedMenuSection
          ? { ...section, items: resequenceItems((section.items || []).filter((_, currentIndex) => currentIndex !== index)) }
          : section
      ))
      return next
    })
    showToast('Item excluído com sucesso.')
  }

  const deleteHomeItem = (index) => {
    if (!confirmDelete('Tem certeza que deseja excluir este destaque da Home?')) return
    updateSiteConfig((current) => {
      const next = deepClone(current)
      next.home = next.home || {}
      next.home.featuredCakes = resequenceItems((next.home.featuredCakes || []).filter((_, currentIndex) => currentIndex !== index))
      return next
    })
    showToast('Destaque excluído com sucesso.')
  }

  const deleteCustomSection = () => {
    if (!currentMenuSection?.custom) return
    if (!confirmDelete('Tem certeza que deseja excluir esta seção e todos os itens dela?')) return
    updateSiteConfig((current) => {
      const next = deepClone(current)
      next.menu.customSections = resequenceItems((next.menu.customSections || []).filter((section) => section.id !== selectedMenuSection))
      return next
    })
    setSelectedMenuSection('bolos')
    showToast('Seção excluída com sucesso.')
  }

  const handleReset = () => {
    if (!confirmDelete('Restaurar os dados padrão? Isso vai apagar as alterações salvas localmente.')) return
    resetSiteConfig()
    showToast('Configurações restauradas com sucesso.')
  }

  const renderLogin = () => (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-surface border border-outline-variant rounded-2xl shadow-lg p-8">
        <p className="text-sm uppercase tracking-wide text-primary mb-2">Área restrita</p>
        <h1 className="text-2xl font-bold text-on-background mb-2">Painel de manutenção</h1>
        <p className="text-on-surface-variant mb-6">Acesso exclusivo por URL protegida com login.</p>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            const success = login(username, password)
            if (!success) {
              setLoginError('Usuário ou senha inválidos.')
              return
            }
            setLoginError('')
            showToast('Login realizado com sucesso.')
          }}
        >
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="w-full border border-outline-variant rounded-lg px-3 py-2 bg-background"
            placeholder="Usuário"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full border border-outline-variant rounded-lg px-3 py-2 bg-background"
            placeholder="Senha"
            required
          />
          {loginError && <p className="text-sm text-error">{loginError}</p>}
          <button className="w-full py-2.5 rounded-lg bg-primary text-white font-semibold">Entrar</button>
        </form>

        <div className="mt-6 text-xs text-on-surface-variant">
          URL protegida: {ADMIN_PATH}
        </div>
      </div>
    </main>
  )

  if (!isAuthenticated) {
    return renderLogin()
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <header className="mb-6 flex justify-between items-start gap-3 flex-wrap">
          <div>
            <p className="text-sm uppercase tracking-wide text-primary">Administração</p>
            <h1 className="text-2xl font-bold text-on-background">Painel de manutenção do site</h1>
            <p className="text-sm text-on-surface-variant mt-1">Estrutura modular para Cake Builder, cardápios, destaques da Home e contatos.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button className="px-4 py-2 rounded-lg bg-surface border border-outline-variant" onClick={onExit}>
              Ver site
            </button>
            <button className="px-4 py-2 rounded-lg bg-error/10 text-error border border-error/20" onClick={logout}>
              Sair
            </button>
          </div>
        </header>

        {toast.message && (
          <div className={`mb-5 rounded-xl px-4 py-3 border text-sm ${toast.type === 'success' ? 'bg-primary/10 border-primary/20 text-on-surface' : 'bg-error/10 border-error/20 text-error'}`}>
            {toast.message}
          </div>
        )}

        <div className="bg-tertiary/10 border border-tertiary/20 rounded-xl p-3 mb-6 text-sm text-on-surface">
          Todas as alterações são salvas no navegador local e já estão preparadas para integração com backend (camada de serviço isolada).
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          <button className={`px-4 py-2 rounded-lg ${activeTab === 'cakebuilder' ? 'bg-primary text-white' : 'bg-surface border border-outline-variant'}`} onClick={() => setActiveTab('cakebuilder')}>
            Cake Builder
          </button>
          <button className={`px-4 py-2 rounded-lg ${activeTab === 'menu' ? 'bg-primary text-white' : 'bg-surface border border-outline-variant'}`} onClick={() => setActiveTab('menu')}>
            Cardápios
          </button>
          <button className={`px-4 py-2 rounded-lg ${activeTab === 'home' ? 'bg-primary text-white' : 'bg-surface border border-outline-variant'}`} onClick={() => setActiveTab('home')}>
            Destaques da Home
          </button>
          <button className={`px-4 py-2 rounded-lg ${activeTab === 'contacts' ? 'bg-primary text-white' : 'bg-surface border border-outline-variant'}`} onClick={() => setActiveTab('contacts')}>
            Contatos
          </button>
          <button className="ml-auto px-4 py-2 rounded-lg bg-error/10 text-error border border-error/20" onClick={handleReset}>
            Restaurar padrão
          </button>
        </div>

        {activeTab === 'cakebuilder' && (
          <section className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
            <div className="space-y-4">
              <div className="bg-surface rounded-xl border border-outline-variant p-4">
                <label className="text-sm text-on-surface-variant">Seção</label>
                <select
                  className="mt-1 w-full border border-outline-variant rounded-lg px-3 py-2 bg-background"
                  value={selectedCakeSection}
                  onChange={(event) => setSelectedCakeSection(event.target.value)}
                >
                  {cakeSections.map((section) => (
                    <option key={section.key} value={section.key}>{section.label}</option>
                  ))}
                </select>
              </div>

              <SectionList
                title={cakeSections.find((section) => section.key === selectedCakeSection)?.label || 'Itens'}
                items={currentCakeItems}
                onEdit={beginEditCakeItem}
                onDelete={deleteCakeItem}
                onAdd={beginCreateCakeItem}
                addLabel="Novo item"
                onReorder={(fromIndex, toIndex) => reorderCakeItems(selectedCakeSection, fromIndex, toIndex)}
              />
            </div>

            <div className="bg-surface rounded-xl border border-outline-variant p-4">
              <p className="font-semibold text-on-surface mb-2">Como funciona</p>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Edite cada tipo de item pelo botão <span className="font-semibold">Editar</span>. A janela de edição só abre quando você clica para alterar ou criar algo novo.
              </p>
            </div>
          </section>
        )}

        {activeTab === 'menu' && (
          <section className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
            <div className="space-y-4 lg:col-span-2">
              <div className="bg-surface rounded-xl border border-outline-variant p-4 space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <label className="text-sm text-on-surface-variant">Cardápios</label>
                    <p className="text-xs text-on-surface-variant mt-1">Todos os cardápios ficam nesta lista, na ordem que você definir.</p>
                  </div>
                  <button type="button" className="px-3 py-2 rounded-lg bg-primary text-white text-sm" onClick={beginCreateMenuSection}>
                    Nova seção
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {menuSections.map((section) => (
                  <SectionList
                    key={section.id}
                    title={section.label}
                    items={sortByOrder(section.items || [])}
                    onEdit={(index) => beginEditMenuItemForSection(section.id, index)}
                    onDelete={(index) => deleteMenuItemForSection(section.id, index)}
                    onAdd={() => beginCreateMenuItemForSection(section.id)}
                    addLabel="Novo item"
                    onEditSection={() => beginEditMenuSectionById(section.id)}
                    onDeleteSection={section.custom ? () => deleteCustomSectionById(section.id) : undefined}
                    onReorder={(fromIndex, toIndex) => reorderMenuItems(section.id, fromIndex, toIndex)}
                  />
                ))}
              </div>
            </div>

            <div className="bg-surface rounded-xl border border-outline-variant p-4">
              <p className="font-semibold text-on-surface mb-2">Gestão única</p>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Os cardápios padrão e os criados depois são tratados no mesmo fluxo. Cada seção pode ser renomeada, receber novos itens e ter a ordem ajustada individualmente no editor.
              </p>
            </div>
          </section>
        )}

        {activeTab === 'home' && (
          <section className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
            <div className="space-y-4">
              <SectionList
                title="Bolos em destaque da Home"
                items={homeFeatured}
                onEdit={beginEditHomeItem}
                onDelete={deleteHomeItem}
                onAdd={beginCreateHomeItem}
                addLabel="Novo destaque"
                onReorder={reorderHomeItems}
              />
            </div>

            <div className="bg-surface rounded-xl border border-outline-variant p-4">
              <p className="font-semibold text-on-surface mb-2">Destaques configuráveis</p>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Aqui você monta os cards que aparecem na Home. Cada destaque pode ser ligado a um modelo do Cake Builder pelas opções de configuração.
              </p>
            </div>
          </section>
        )}

        {activeTab === 'contacts' && contacts && (
          <section className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-start">
            <div className="bg-surface rounded-xl border border-outline-variant p-5 space-y-4">
              <div>
                <h2 className="font-semibold text-lg">Resumo atual</h2>
                <p className="text-sm text-on-surface-variant">Visualize as informações ativas e abra a edição quando precisar alterar algo.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-outline-variant p-4 bg-background">
                  <p className="text-xs uppercase tracking-wide text-on-surface-variant mb-1">WhatsApp</p>
                  <p className="font-medium text-on-surface break-words">{contacts?.whatsapp?.display || formatBrazilianPhone(contacts?.whatsapp?.number)}</p>
                </div>
                <div className="rounded-xl border border-outline-variant p-4 bg-background">
                  <p className="text-xs uppercase tracking-wide text-on-surface-variant mb-1">Email</p>
                  <p className="font-medium text-on-surface break-words">{contacts?.email?.address}</p>
                </div>
                <div className="rounded-xl border border-outline-variant p-4 bg-background">
                  <p className="text-xs uppercase tracking-wide text-on-surface-variant mb-1">Instagram</p>
                  <p className="font-medium text-on-surface break-words">{contacts?.instagram?.handle}</p>
                </div>
                <div className="rounded-xl border border-outline-variant p-4 bg-background">
                  <p className="text-xs uppercase tracking-wide text-on-surface-variant mb-1">Maps</p>
                  <p className="font-medium text-on-surface break-all">{contacts?.location?.mapsUrl}</p>
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-xl border border-outline-variant p-4">
              <button type="button" className="w-full px-4 py-3 rounded-lg bg-primary text-white font-semibold" onClick={beginEditContacts}>
                Editar contatos
              </button>
            </div>
          </section>
        )}

        <footer className="mt-8 text-xs text-on-surface-variant">
          Estado atual: salvo localmente no navegador. Para backend futuro, substitua a implementação de
          <span className="font-semibold"> siteDataService</span> e
          <span className="font-semibold"> adminAuthService</span> mantendo a mesma interface.
        </footer>
      </div>

      <EditorModal
        open={Boolean(editor)}
        title={editor?.title || ''}
        subtitle={
          editor?.kind === 'home'
            ? 'Os destaques da Home podem ser criados a partir de qualquer modelo montado no Cake Builder.'
            : editor?.kind === 'contacts'
              ? 'As alterações aqui refletem em todo o site público.'
              : editor?.kind === 'menu-section'
                ? 'Se a seção mudar de ID, o menu público será atualizado automaticamente.'
                : 'Edite apenas o objeto atual, sem abrir painéis permanentes.'
        }
        schema={editor?.schema || []}
        item={editor?.item || {}}
        onChange={updateEditorField}
        onClose={closeEditor}
        onSave={saveEditor}
        saveLabel={editor?.saveLabel || 'Salvar'}
      />
    </main>
  )
}