import { useState, useEffect, useMemo } from 'react'
import TagFilter from './components/TagFilter'
import ProductGrid from './components/ProductGrid'
import Header from './components/Header'

export default function App() {
  const [products, setProducts] = useState([])
  const [selectedTags, setSelectedTags] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState(new Set())

  useEffect(() => {
    fetch('/data/products.json')
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false) })
  }, [])

  const allTags = useMemo(() => {
    const tagSet = new Set()
    products.forEach(p => p.tags.forEach(t => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }, [products])

  const filtered = useMemo(() => {
    let result = products
    if (selectedTags.size > 0) {
      result = result.filter(p => p.tags.some(t => selectedTags.has(t)))
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    return result
  }, [products, selectedTags, searchQuery])

  const toggleTag = (tag) => {
    setSelectedTags(prev => {
      const next = new Set(prev)
      next.has(tag) ? next.delete(tag) : next.add(tag)
      return next
    })
  }

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const clearAll = () => { setSelectedTags(new Set()); setSearchQuery('') }
  const clearSelection = () => setSelectedIds(new Set())

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Print-only logo header */}
      <div id="print-logo-header" className="hidden items-center justify-between pb-4 mb-4 border-b-2 border-slate-200 px-2">
        <img
          src="https://talicor.com/wp-content/uploads/2018/06/talicor_logo_4C_CS2_1-400x.png"
          alt="Talicor"
          className="h-14 object-contain"
        />
        <div className="text-right">
          <div className="text-sm font-extrabold tracking-widest uppercase text-slate-600">Product Catalog</div>
          {selectedIds.size > 0 && (
            <div className="text-xs text-slate-400 font-semibold mt-0.5">Selected items — {selectedIds.size} products</div>
          )}
        </div>
      </div>

      <Header
        productCount={filtered.length}
        totalCount={products.length}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        selectedTags={selectedTags}
        onClearAll={clearAll}
        selectedIds={selectedIds}
        onClearSelection={clearSelection}
      />

      <div className="flex flex-1">
        <aside className="no-print w-64 shrink-0 sticky top-0 h-screen overflow-y-auto bg-white border-r border-slate-200 px-4 py-5 shadow-sm">
          <TagFilter
            allTags={allTags}
            selectedTags={selectedTags}
            onToggle={toggleTag}
            onClearAll={() => setSelectedTags(new Set())}
          />
        </aside>

        <main className="flex-1 overflow-auto">
          <div className="no-print bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-5 bg-[#FFB800] rounded-full" />
              <span className="text-xs font-extrabold tracking-widest uppercase text-slate-500">
                {selectedTags.size > 0 ? [...selectedTags].join(' · ') : 'All Products'}
              </span>
            </div>
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="text-[#0055B3]">
                  {selectedIds.size} item{selectedIds.size !== 1 ? 's' : ''} selected
                  {selectedIds.size !== filtered.filter(p => selectedIds.has(p.id)).length && (
                    <span className="text-slate-400 font-semibold ml-1">(some outside current filter)</span>
                  )}
                </span>
                <button onClick={clearSelection} className="text-slate-400 hover:text-slate-700 underline font-semibold">
                  Clear selection
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <div className="w-8 h-8 border-4 border-[#0055B3] border-t-[#FFB800] rounded-full animate-spin mb-3" />
              <p className="text-sm font-bold">Loading catalog…</p>
            </div>
          ) : (
            <ProductGrid
              products={filtered}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
            />
          )}
        </main>
      </div>
    </div>
  )
}
