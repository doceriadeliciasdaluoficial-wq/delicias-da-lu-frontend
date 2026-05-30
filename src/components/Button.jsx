import React from 'react'

/**
 * Componente Button reutilizável
 * Centraliza estilos de botões para toda aplicação
 */

export const PrimaryButton = ({ children, onClick, disabled = false, className = '', ...props }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex-1 py-3 rounded-lg font-label-md text-label-md transition-colors ${
      disabled
        ? 'bg-surface-container text-on-surface-variant opacity-50 cursor-not-allowed'
        : 'bg-primary text-white hover:bg-primary-light'
    } ${className}`}
    {...props}
  >
    {children}
  </button>
)

export const SecondaryButton = ({ children, onClick, disabled = false, className = '', ...props }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex-1 py-3 rounded-lg font-label-md text-label-md transition-colors ${
      disabled
        ? 'bg-surface-container text-on-surface-variant opacity-50 cursor-not-allowed'
        : 'bg-surface-container hover:bg-surface-container-highest text-on-surface'
    } ${className}`}
    {...props}
  >
    {children}
  </button>
)

export const TertiaryButton = ({ children, onClick, className = '', ...props }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-3 rounded-lg font-label-md text-label-md transition-colors bg-surface-container border-2 border-outline-variant text-on-surface hover:bg-surface-container-highest flex items-center justify-center gap-2 ${className}`}
    {...props}
  >
    {children}
  </button>
)

export const IconButton = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-light',
    secondary: 'bg-surface-container text-on-surface hover:bg-surface-container-highest',
    danger: 'bg-error text-on-error hover:bg-error-dark'
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
