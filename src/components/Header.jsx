export default function Header({ productCount, totalCount, searchQuery, onSearch, selectedTags, onClearAll }) {
  return (
    <header className="no-print bg-white border-b border-slate-200 shadow-sm">
      {/* Top brand bar */}
      <div className="bg-slate-900 text-white px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold tracking-widest uppercase">Talicor</div>
          <div className="w-px h-5 bg-slate-600" />
          <div className="text-xs tracking-widest uppercase text-slate-400">Product Catalog</div>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-1.5 border border-slate-600 text-slate-300 text-xs tracking-wide uppercase hover:bg-slate-700 transition-colors rounded"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / Save PDF
        </button>
      </div>

      {/* Search + count bar */}
      <div className="px-8 py-3 flex items-center gap-6">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products…"
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:bg-white"
          />
        </div>

        <div className="text-sm text-slate-500">
          Showing <span className="font-semibold text-slate-800">{productCount}</span>
          {productCount !== totalCount && <span> of {totalCount}</span>} items
        </div>

        {(selectedTags.size > 0 || searchQuery) && (
          <button onClick={onClearAll} className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2">
            Clear all filters
          </button>
        )}

        {selectedTags.size > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {[...selectedTags].map(tag => (
              <span key={tag} className="text-xs bg-slate-800 text-white px-2.5 py-1 rounded-sm">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
