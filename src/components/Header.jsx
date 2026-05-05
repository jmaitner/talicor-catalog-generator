export default function Header({ productCount, totalCount, searchQuery, onSearch, selectedTags, onClearAll, catalogRef }) {
  const handlePrint = () => window.print()

  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">T</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-none">Talicor</h1>
            <p className="text-xs text-slate-400 leading-none">Product Catalog</p>
          </div>
        </div>

        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search products or tags…"
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
            className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <span className="text-sm text-slate-500">
            <span className="font-semibold text-slate-800">{productCount}</span>
            {productCount !== totalCount && <span> of {totalCount}</span>} products
          </span>

          {(selectedTags.size > 0 || searchQuery) && (
            <button
              onClick={onClearAll}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters
            </button>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print / Save PDF
          </button>
        </div>
      </div>
    </header>
  )
}
