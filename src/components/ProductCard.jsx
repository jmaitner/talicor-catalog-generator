import { useState } from 'react'

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f0f7ff'/%3E%3Crect x='150' y='130' width='100' height='100' rx='8' fill='%23dbeafe'/%3E%3Ccircle cx='175' cy='155' r='14' fill='%2393c5fd'/%3E%3Cpath d='M150 230 L180 190 L205 215 L230 188 L250 230Z' fill='%2393c5fd'/%3E%3Ctext x='200' y='278' text-anchor='middle' font-size='12' fill='%2360a5fa' font-family='system-ui' font-weight='700'%3ENo Image Yet%3C/text%3E%3C/svg%3E"

const TAG_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-yellow-100 text-yellow-700',
  'bg-green-100 text-green-700',
  'bg-red-100 text-red-700',
  'bg-purple-100 text-purple-700',
]

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
    <div className="print-card bg-white rounded-2xl border border-slate-200 flex flex-col group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
      {/* Image */}
      <div className="relative bg-gradient-to-br from-blue-50 to-slate-50 overflow-hidden" style={{ aspectRatio: '1' }}>
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain p-5 group-hover:scale-105 transition-transform duration-300"
        />
        {ageLabel && (
          <span className="absolute top-2.5 right-2.5 bg-[#FFB800] text-[#0055B3] text-xs px-2.5 py-1 rounded-full font-extrabold shadow-sm">
            {ageLabel}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        {/* Brand + SKU */}
        <div className="flex items-center justify-between gap-1">
          <span className="text-xs font-extrabold tracking-widest uppercase text-[#0055B3]">{product.brand}</span>
          <span className="text-xs text-slate-400 font-semibold font-mono">#{product.id}</span>
        </div>

        {/* Name */}
        <h3 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-3">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 font-semibold">
            {product.description}
          </p>
        )}

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-1">
            {product.tags.slice(0, 4).map((tag, i) => (
              <span key={tag} className={`text-xs px-2 py-0.5 rounded-full font-bold ${TAG_COLORS[i % TAG_COLORS.length]}`}>
                {tag}
              </span>
            ))}
            {product.tags.length > 4 && (
              <span className="text-xs text-slate-400 font-bold px-1">+{product.tags.length - 4}</span>
            )}
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-end justify-between pt-3 border-t border-slate-100 mt-auto">
          {msrp ? (
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-0.5">MSRP</div>
              <div className="text-xl font-extrabold text-[#0055B3]">{msrp}</div>
            </div>
          ) : <div />}
          {wholesale && (
            <div className="text-right">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-0.5">Wholesale</div>
              <div className="text-sm font-extrabold text-slate-600">{wholesale}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
