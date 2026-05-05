import { useState, useEffect, useRef } from 'react'
import PrintOptionsModal from './PrintOptionsModal'

export default function Header({ productCount, totalCount, searchQuery, onSearch, selectedTags, onClearAll, selectedIds, onClearSelection }) {
  const [printing, setPrinting] = useState(false)
  const [modal, setModal] = useState(null) // null | { selectedOnly: bool }
  const pendingPrint = useRef(null) // holds opts after modal closes

  const openModal = (selectedOnly) => setModal({ selectedOnly })

  const handleModalPrint = (opts) => {
    // Store opts and selectedOnly, then close modal.
    // The useEffect below fires after React re-renders (modal removed from DOM),
    // ensuring window.print() never fires while the modal is still visible.
    pendingPrint.current = { opts, selectedOnly: modal.selectedOnly }
    setModal(null)
  }

  useEffect(() => {
    if (!pendingPrint.current) return
    const { opts, selectedOnly } = pendingPrint.current
    pendingPrint.current = null

    setPrinting(true)
    if (selectedOnly) document.body.setAttribute('data-print-selected', '')
    if (!opts.description) document.body.setAttribute('data-hide-description', '')
    if (!opts.tags) document.body.setAttribute('data-hide-tags', '')
    if (!opts.bullets) document.body.setAttribute('data-hide-bullets', '')

    const cleanup = () => {
      document.body.removeAttribute('data-print-selected')
      document.body.removeAttribute('data-hide-description')
      document.body.removeAttribute('data-hide-tags')
      document.body.removeAttribute('data-hide-bullets')
    }

    let fired = false
    const doPrint = () => {
      if (fired) return
      fired = true
      setPrinting(false)
      window.print()
      cleanup()
    }

    const imgs = Array.from(document.querySelectorAll('img')).filter(img => !img.complete)
    if (!imgs.length) { doPrint(); return }

    const fallback = setTimeout(doPrint, 4000)
    let resolved = 0
    imgs.forEach(img => {
      const cb = () => { if (++resolved >= imgs.length) { clearTimeout(fallback); doPrint() } }
      img.addEventListener('load', cb, { once: true })
      img.addEventListener('error', cb, { once: true })
    })
  }, [modal]) // fires when modal becomes null (after close)

  return (
    <>
      {modal && (
        <PrintOptionsModal
          selectedCount={modal.selectedOnly ? selectedIds?.size : null}
          onPrint={handleModalPrint}
          onCancel={() => setModal(null)}
        />
      )}

      <header className="no-print sticky top-0 z-50 shadow-md">
        {/* Brand bar */}
        <div className="bg-[#0055B3] px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-lg px-3 py-1 shadow-sm">
              <img
                src="https://talicor.com/wp-content/uploads/2018/06/talicor_logo_4C_CS2_1-400x.png"
                alt="Talicor"
                className="h-9 object-contain"
              />
            </div>
            <div className="w-px h-7 bg-blue-400 opacity-50" />
            <span className="text-white text-sm font-bold tracking-widest uppercase opacity-80">
              Product Catalog
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openModal(false)}
              disabled={printing}
              className="flex items-center gap-2 px-5 py-2 bg-[#FFB800] hover:bg-[#e6a600] disabled:opacity-60 text-[#0055B3] text-sm font-extrabold rounded-full transition-colors shadow-sm"
            >
              {printing ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0055B3] border-t-transparent rounded-full animate-spin" />
                  Preparing…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print / Save PDF
                </>
              )}
            </button>
            {selectedIds?.size > 0 && (
              <button
                onClick={() => openModal(true)}
                disabled={printing}
                className="flex items-center gap-2 px-5 py-2 bg-white hover:bg-slate-100 disabled:opacity-60 text-[#0055B3] text-sm font-extrabold rounded-full transition-colors shadow-sm border-2 border-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Print Selected ({selectedIds.size})
              </button>
            )}
          </div>
        </div>

        {/* Search + filter bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products…"
              value={searchQuery}
              onChange={e => onSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-full bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0055B3] focus:bg-white font-semibold"
            />
          </div>

          <div className="text-sm text-slate-500 font-semibold">
            <span className="text-[#0055B3] font-extrabold text-base">{productCount}</span>
            {productCount !== totalCount && <span className="text-slate-400"> / {totalCount}</span>}
            <span className="ml-1">items</span>
          </div>

          {selectedTags.size > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {[...selectedTags].map(tag => (
                <span
                  key={tag}
                  onClick={() => onClearAll()}
                  className="text-xs bg-[#0055B3] text-white px-3 py-1 rounded-full font-bold cursor-pointer hover:bg-blue-700"
                >
                  {tag} ×
                </span>
              ))}
              <button onClick={onClearAll} className="text-xs text-slate-400 hover:text-slate-700 font-semibold underline">
                Clear all
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
