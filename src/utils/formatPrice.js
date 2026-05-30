/**
 * Formata um valor numérico para o padrão brasileiro (R$)
 * @param {number} value - O valor a ser formatado
 * @param {boolean} includeCurrency - Se deve incluir "R$" (padrão: true)
 * @returns {string} Valor formatado (ex: "95,00" ou "R$ 95,00")
 */
export const formatPrice = (value, includeCurrency = true) => {
  const numValue = parseFloat(value) || 0
  const formatted = numValue.toFixed(2).replace('.', ',')
  return includeCurrency ? `R$ ${formatted}` : formatted
}

/**
 * Calcula o subtotal de um item do carrinho
 * @param {number} price - Preço unitário/por cento
 * @param {number} quantity - Quantidade
 * @param {string} unit - Unidade ('cento', 'un', etc)
 * @returns {string} Subtotal formatado
 */
export const calculateSubtotal = (price, quantity = 1, unit = 'un') => {
  const numPrice = parseFloat(price.toString().replace(',', '.')) || 0
  const numQty = parseInt(quantity) || 1
  
  let subtotal
  if (unit === 'cento') {
    // Para centos, multiplicar por quantidade e dividir por 100
    subtotal = (numPrice * numQty) / 100
  } else {
    // Para unidades, apenas multiplicar
    subtotal = numPrice * numQty
  }
  
  return formatPrice(subtotal)
}

/**
 * Formata um preço unitário com a unidade (ex: "R$ 95,00/kg")
 * @param {number} price - O preço
 * @param {string} unit - A unidade (ex: 'kg', 'cento', 'un')
 * @returns {string} Preço com unidade formatado
 */
export const formatPriceWithUnit = (price, unit = 'un') => {
  const numValue = parseFloat(price) || 0
  const formatted = numValue.toFixed(2).replace('.', ',')
  return `R$ ${formatted}/${unit}`
}

/**
 * Formata um total com símbolo de moeda
 * @param {number} value - O valor a ser formatado
 * @returns {string} Total formatado (ex: "R$ 95,00")
 */
export const formatTotal = (value) => {
  return formatPrice(value, true)
}
