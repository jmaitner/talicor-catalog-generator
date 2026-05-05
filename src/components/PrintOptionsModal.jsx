import { useState } from 'react'

export default function PrintOptionsModal({ onPrint, onCancel, selectedCount }) {
  const [opts, setOpts] = useState({ description: true, tags: true, bullets: true })

  const toggle = (key) => setOpts(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-80 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0055B3] px-6 py-4 flex items-center gap-3">
          <svg className="w-5 h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <div>
            <div className="text-white font-extrabold text-sm">Print Options</div>
            {selectedCount != null && (
              <div className="text-blue-200 text-xs font-semibold mt-0.5">{selectedCount} selected item{selectedCount !== 1 ? 's' : ''}</div>
            )}
          </div>
        </div>

        {/* Options */}
        <div className="px-6 py-5">
          <p className="text-xs text-slate-500 font-semibold mb-4 uppercase tracking-widest">Include on each card</p>

          <div className="flex flex-col gap-3">
            {[
              { key: 'description', label: 'Description' },
              { key: 'tags', label: 'Tags' },
              { key: 'bullets', label: 'Bullet Points' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggle(key)}>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${opts[key] ? 'bg-[#0055B3] border-[#0055B3]' : 'bg-white border-slate-300'}`}>
                  {opts[key] && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-[#0055B3] transition-colors select-none">{label}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 rounded-full border border-slate-200 text-slate-500 text-sm font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onPrint(opts)}
              className="flex-1 px-4 py-2 rounded-full bg-[#FFB800] text-[#0055B3] text-sm font-extrabold hover:bg-[#e6a600] transition-colors"
            >
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
