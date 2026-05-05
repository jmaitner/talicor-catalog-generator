import { useState, useMemo } from 'react'

const TAG_GROUPS = {
  'Game Type': ['Board Game', 'Card Game', 'Dice Game', 'Party Game', 'Travel Game', 'Word Game', 'Puzzle-Game', 'Activity Game', 'Conversation Game'],
  'Audience': ['Kids', 'Teens', 'Adults', 'Young Adults', 'Family', 'Seniors', 'Toddler', 'All Ages', 'Couples'],
  'Themes': ['Animals', 'Music', 'Trivia', 'Educational', 'Sports', 'Science', 'Nature', 'Food', 'Holiday', 'Christmas', 'Halloween'],
  'Skills': ['Math', 'Strategy', 'Logic', 'Vocabulary', 'STEM', 'Creative Play', 'Social-Emotional', 'Critical Thinking'],
  'Occasion': ['Party', 'Travel', 'Camping', 'Classroom', 'Homeschool', 'Therapy', 'Team Building', 'Gift'],
  'Other': [],
}

function groupTags(allTags) {
  const grouped = {}
  const used = new Set()
  for (const [group, keywords] of Object.entries(TAG_GROUPS)) {
    if (group === 'Other') continue
    grouped[group] = allTags.filter(t => keywords.includes(t))
    grouped[group].forEach(t => used.add(t))
  }
  grouped['Other'] = allTags.filter(t => !used.has(t))
  return grouped
}

export default function TagFilter({ allTags, selectedTags, onToggle, onClearAll }) {
  const [search, setSearch] = useState('')
  const [openGroups, setOpenGroups] = useState(new Set(['Game Type', 'Audience']))

  const grouped = useMemo(() => groupTags(allTags), [allTags])

  const toggleGroup = (g) => setOpenGroups(prev => {
    const next = new Set(prev)
    next.has(g) ? next.delete(g) : next.add(g)
    return next
  })

  const visibleTags = (tags) => search
    ? tags.filter(t => t.toLowerCase().includes(search.toLowerCase()))
    : tags

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-5 px-1">
        <span className="text-xs font-bold tracking-widest uppercase text-slate-500">Filters</span>
        {selectedTags.size > 0 && (
          <button onClick={onClearAll} className="text-xs text-slate-400 hover:text-slate-700 underline underline-offset-2">
            Clear ({selectedTags.size})
          </button>
        )}
      </div>

      <div className="relative mb-5">
        <input
          type="text"
          placeholder="Search tags…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-3 py-2 text-xs border border-slate-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
        />
      </div>

      <div className="space-y-1">
        {Object.entries(grouped).map(([group, tags]) => {
          const visible = visibleTags(tags)
          if (visible.length === 0) return null
          const isOpen = openGroups.has(group) || !!search
          const activeCount = visible.filter(t => selectedTags.has(t)).length

          return (
            <div key={group} className="border-b border-slate-100 pb-1 mb-1">
              <button
                onClick={() => toggleGroup(group)}
                className="w-full flex items-center justify-between py-2 px-1 text-left hover:bg-slate-50 rounded"
              >
                <span className="text-xs font-semibold tracking-wide uppercase text-slate-600">{group}</span>
                <span className="flex items-center gap-1.5">
                  {activeCount > 0 && (
                    <span className="bg-slate-800 text-white text-xs rounded-sm px-1.5 py-0.5 font-medium leading-none">
                      {activeCount}
                    </span>
                  )}
                  <svg className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              {isOpen && (
                <div className="flex flex-wrap gap-1.5 px-1 pb-2 pt-1">
                  {visible.map(tag => {
                    const active = selectedTags.has(tag)
                    return (
                      <button
                        key={tag}
                        onClick={() => onToggle(tag)}
                        className={`text-xs px-2.5 py-1 border transition-all rounded-sm font-medium ${
                          active
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900'
                        }`}
                      >
                        {tag}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
