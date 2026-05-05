import { useState } from 'react'

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f8fafc'/%3E%3Crect x='160' y='140' width='80' height='80' rx='4' fill='%23e2e8f0'/%3E%3Ccircle cx='185' cy='165' r='12' fill='%23cbd5e1'/%3E%3Cpath d='M160 220 L190 185 L210 205 L230 185 L240 220Z' fill='%23cbd5e1'/%3E%3Ctext x='200' y='270' text-anchor='middle' font-size='11' fill='%2394a3b8' font-family='system-ui' font-weight='500'%3ENo Image Available%3C/text%3E%3C/svg%3E"

export default function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false)
  const imgSrc = !imgError && product.image_urls.length > 0 ? product.image_urls[0] : PLACEHOLDER

  const msrp = product.msrp != null ? `$${Number(product.msrp).toFixed(2)}` : null
  const wholesale = product.wholesale_cost != null ? `$${Number(product.wholesale_cost).toFixed(2)}` : null

  const ageLabel = product.min_age && product.max_age
    ? `Ages ${product.min_age}–${product.max_age}`
    : product.min_age ? `Ages ${product.min_age}+`
    : null

  return (
    <div className="bg-white border border-slate-200 flex flex-col group hover:shadow-lg hover:border-slate-300 transition-all duration-200">
      {/* Image */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden border-b border-slate-100">
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-300"
        />
        {ageLabel && (
          <span className="absolute top-2 right-2 bg-white border border-slate-200 text-slate-600 text-xs px-2 py-0.5 font-medium shadow-sm">
            {ageLabel}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Brand + SKU */}
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-bold tracking-widest uppercase text-slate-400">{product.brand}</span>
          <span className="text-xs text-slate-400 font-mono shrink-0">#{product.id}</span>
        </div>

        {/* Name */}
        <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-3 flex-1">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 5).map(tag => (
              <span key={tag} className="text-xs bg-slate-50 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-sm">
                {tag}
              </span>
            ))}
            {product.tags.length > 5 && (
              <span className="text-xs text-slate-400 px-1 py-0.5">+{product.tags.length - 5}</span>
            )}
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-end justify-between pt-3 mt-auto border-t border-slate-100">
          <div>
            {msrp && (
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-0.5">MSRP</div>
                <div className="text-xl font-bold text-slate-900">{msrp}</div>
              </div>
            )}
          </div>
          {wholesale && (
            <div className="text-right">
              <div className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-0.5">Wholesale</div>
              <div className="text-sm font-semibold text-slate-600">{wholesale}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
