import { useState, useEffect, useMemo } from 'react'
import TagFilter from './components/TagFilter'
import ProductGrid from './components/ProductGrid'
import Header from './components/Header'

export default function App() {
  const [products, setProducts] = useState([])
  const [selectedTags, setSelectedTags] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

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

  const clearAll = () => { setSelectedTags(new Set()); setSearchQuery('') }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Header
        productCount={filtered.length}
        totalCount={products.length}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        selectedTags={selectedTags}
        onClearAll={clearAll}
      />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="no-print w-64 shrink-0 sticky top-0 h-screen overflow-y-auto bg-white border-r border-slate-200 px-4 py-5 shadow-sm">
          <TagFilter
            allTags={allTags}
            selectedTags={selectedTags}
            onToggle={toggleTag}
            onClearAll={() => setSelectedTags(new Set())}
          />
        </aside>

        {/* Catalog area */}
        <main className="flex-1 overflow-auto">
          {/* Section label */}
          <div className="no-print bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-3">
            <div className="w-1.5 h-5 bg-[#FFB800] rounded-full" />
            <span className="text-xs font-extrabold tracking-widest uppercase text-slate-500">
              {selectedTags.size > 0 ? [...selectedTags].join(' · ') : 'All Products'}
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <div className="w-8 h-8 border-4 border-[#0055B3] border-t-[#FFB800] rounded-full animate-spin mb-3" />
              <p className="text-sm font-bold">Loading catalog…</p>
            </div>
          ) : (
            <ProductGrid products={filtered} />
          )}
        </main>
      </div>
    </div>
  )
}
