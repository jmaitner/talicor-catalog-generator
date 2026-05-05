import { useState } from 'react'

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\' viewBox=\'0 0 300 300\'%3E%3Crect width=\'300\' height=\'300\' fill=\'%23f1f5f9\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-size=\'14\' fill=\'%2394a3b8\' font-family=\'system-ui\'%3ENo Image%3C/text%3E%3C/svg%3E'

function AgeRange({ min, max }) {
  if (!min && !max) return null
  const label = min && max ? `Ages ${min}–${max}` : min ? `Age ${min}+` : `Up to ${max}`
  return <span className="text-xs text-slate-500">{label}</span>
}

export default function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false)
  const imgSrc = !imgError && product.image_urls.length > 0 ? product.image_urls[0] : PLACEHOLDER

  const msrp = product.msrp != null
    ? `$${Number(product.msrp).toFixed(2)}`
    : null

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="aspect-square bg-slate-50 flex items-center justify-center overflow-hidden">
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain p-4"
        />
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <div>
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-0.5">{product.brand}</p>
          <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">{product.name}</h3>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
          <div className="flex flex-col">
            {msrp && <span className="text-base font-bold text-slate-900">{msrp}</span>}
            <span className="text-xs text-slate-400">#{product.id}</span>
          </div>
          <AgeRange min={product.min_age} max={product.max_age} />
        </div>

        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {product.tags.slice(0, 4).map(tag => (
              <span key={tag} className="text-xs bg-slate-100 text-slate-600 rounded-full px-2 py-0.5">{tag}</span>
            ))}
            {product.tags.length > 4 && (
              <span className="text-xs text-slate-400">+{product.tags.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
