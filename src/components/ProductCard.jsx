import React from 'react'
import ImageDisplay from './ImageDisplay'

/**
 * Reusable product card component for displaying menu items, cake components, etc.
 */
const ProductCard = ({
  id,
  name,
  label,
  image,
  description,
  price,
  unit = 'un',
  category,
  badge,
  onViewDetails,
  onAddToCart,
  onEdit,
  onDelete,
  showActions = true,
  compact = false,
  imageSize = 'square', // 'square' or 'video' (16:10)
  loading = false,
}) => {
  const displayName = name || label
  const aspectClass = imageSize === 'video' ? 'aspect-video' : 'aspect-square'

  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm overflow-hidden group hover:shadow-lg transition-shadow h-full flex flex-col">
      {/* Image Section */}
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-primary-fixed-dim to-tertiary-fixed/30 flex items-center justify-center text-4xl">
        <div className={`w-full ${aspectClass} flex items-center justify-center overflow-hidden`}>
          {image ? (
            <ImageDisplay
              imageBase64={image}
              alt={displayName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 0,
              }}
              className="group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span>📦</span>
          )}
        </div>

        {/* Badge */}
        {badge && (
          <div className="absolute top-2 left-2">
            <span className="bg-tertiary-fixed/90 text-on-tertiary-fixed px-2 py-1 rounded-full font-label-md text-[11px] shadow-sm backdrop-blur-sm">
              {badge}
            </span>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col gap-2">
        {/* Name */}
        <div>
          <button
            type="button"
            onClick={onViewDetails}
            className="text-left w-full hover:text-primary transition-colors"
            disabled={loading}
          >
            <h4 className="font-headline-md text-[0.95rem] sm:text-headline-md text-on-surface leading-tight truncate">
              {displayName}
            </h4>
          </button>
          {id && (
            <p className="text-xs text-on-surface-variant truncate">ID: {id}</p>
          )}
        </div>

        {/* Category or Description */}
        {category && !compact && (
          <p className="text-xs text-on-surface-variant">{category}</p>
        )}
        {description && !compact && (
          <p className="text-body-xs sm:text-body-sm text-on-surface-variant line-clamp-2">
            {description}
          </p>
        )}

        {/* Price and Unit */}
        {price !== undefined && price !== null && (
          <div className="pt-1 border-t border-outline-variant/50">
            <p className="font-label-md text-label-md text-primary font-bold">
              {typeof price === 'number' ? `R$ ${price.toFixed(2)}` : price}
              {unit && <span className="text-xs text-on-surface-variant ml-1">({unit})</span>}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-outline-variant/50">
            {onViewDetails && (
              <button
                type="button"
                onClick={onViewDetails}
                disabled={loading}
                className="w-full py-2 text-xs sm:text-sm px-2 border border-outline-variant text-on-surface font-label-md rounded-lg hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                View Details
              </button>
            )}

            <div className="flex gap-2">
              {onAddToCart && (
                <button
                  type="button"
                  onClick={onAddToCart}
                  disabled={loading}
                  className="flex-1 py-2 text-xs sm:text-sm px-2 bg-primary text-white font-label-md rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              )}

              {onEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  disabled={loading}
                  className="px-3 py-2 text-xs bg-surface-container text-on-surface border border-outline-variant rounded-lg hover:bg-surface-container-highest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Edit"
                >
                  ✎
                </button>
              )}

              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={loading}
                  className="px-3 py-2 text-xs bg-error/10 text-error border border-error/20 rounded-lg hover:bg-error/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCard
