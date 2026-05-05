import { useState } from 'react'

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f0f7ff'/%3E%3Crect x='100' y='90' width='100' height='100' rx='8' fill='%23dbeafe'/%3E%3Ccircle cx='125' cy='115' r='14' fill='%2393c5fd'/%3E%3Cpath d='M100 190 L130 150 L155 175 L180 148 L200 190Z' fill='%2393c5fd'/%3E%3Ctext x='150' y='228' text-anchor='middle' font-size='11' fill='%2360a5fa' font-family='system-ui' font-weight='700'%3ENo Image Yet%3C/text%3E%3C/svg%3E"

const LOGO = "https://talicor.com/wp-content/uploads/2018/06/talicor_logo_4C_CS2_1-400x.png"

const TAG_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-yellow-100 text-yellow-700',
  'bg-green-100 text-green-700',
  'bg-red-100 text-red-700',
  'bg-purple-100 text-purple-700',
]

export default function ProductCard({ product, isSelected, onToggleSelect }) {
  const [imgError, setImgError] = useState(false)
  const imgSrc = !imgError && product.image_urls.length > 0 ? product.image_urls[0] : PLACEHOLDER

  const msrp = product.msrp != null ? `$${Number(product.msrp).toFixed(2)}` : null
  const wholesale = product.wholesale_cost != null ? `$${Number(product.wholesale_cost).toFixed(2)}` : null

  const ageLabel = product.min_age && product.max_age
    ? `Ages ${product.min_age}–${product.max_age}`
    : product.min_age ? `Ages ${product.min_age}+`
    : null

  return (
    <div className={`print-card${isSelected ? ' catalog-selected' : ''} bg-white rounded-xl border flex flex-row overflow-hidden group hover:shadow-lg transition-all duration-200 ${isSelected ? 'border-[#0055B3] ring-2 ring-[#0055B3]/30' : 'border-slate-200'}`}>

      {/* Image — left side */}
      <div className="card-image w-36 shrink-0 bg-gradient-to-br from-blue-50 to-slate-50 relative flex items-center justify-center overflow-hidden border-r border-slate-100" onClick={onToggleSelect ? () => onToggleSelect(product.id) : undefined} style={onToggleSelect ? { cursor: 'pointer' } : {}}>
        {/* Selection checkbox */}
        <button
          onClick={e => { e.stopPropagation(); onToggleSelect && onToggleSelect(product.id) }}
          className={`no-print absolute top-2 left-2 z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-[#0055B3] border-[#0055B3]' : 'bg-white/80 border-slate-300 hover:border-[#0055B3]'}`}
        >
          {isSelected && (
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          style={{ maxHeight: '160px' }}
        />
        {ageLabel && (
          <span className="absolute bottom-2 left-0 right-0 mx-auto w-fit bg-[#FFB800] text-[#0055B3] text-xs px-2 py-0.5 rounded-full font-extrabold text-center shadow-sm">
            {ageLabel}
          </span>
        )}
      </div>

      {/* Details — right side */}
      <div className="flex flex-col flex-1 p-3 gap-1.5 min-w-0">

        {/* Logo + SKU */}
        <div className="flex items-center justify-between gap-1">
          <img src={LOGO} alt="Talicor" className="h-5 object-contain object-left" />
          <span className="text-xs text-slate-400 font-semibold font-mono shrink-0">#{product.id}</span>
        </div>

        {/* Name */}
        <h3 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="card-description text-xs text-slate-500 leading-relaxed line-clamp-2 font-semibold">
            {product.description}
          </p>
        )}

        {/* Bullet points */}
        {product.bullet_points?.length > 0 && (
          <ul className="card-bullets text-xs text-slate-500 font-semibold leading-relaxed space-y-0.5 pl-3 list-disc">
            {product.bullet_points.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="card-tags flex flex-wrap gap-1 mt-auto">
            {product.tags.map((tag, i) => (
              <span key={`${tag}-${i}`} className={`text-xs px-2 py-0.5 rounded-full font-bold ${TAG_COLORS[i % TAG_COLORS.length]}`}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-end justify-between pt-2 border-t border-slate-100 mt-auto">
          {msrp ? (
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wide leading-none mb-0.5">MSRP</div>
              <div className="text-lg font-extrabold text-[#0055B3] leading-none">{msrp}</div>
            </div>
          ) : <div />}
          {wholesale && (
            <div className="text-right">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wide leading-none mb-0.5">Wholesale</div>
              <div className="text-sm font-extrabold text-slate-600 leading-none">{wholesale}</div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
