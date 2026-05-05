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
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Filter by Tag</h2>
        {selectedTags.size > 0 && (
          <button onClick={onClearAll} className="text-xs text-blue-600 hover:text-blue-800">
            Clear ({selectedTags.size})
          </button>
        )}
      </div>

      <input
        type="text"
        placeholder="Search tags…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />

      {Object.entries(grouped).map(([group, tags]) => {
        const visible = visibleTags(tags)
        if (visible.length === 0) return null
        const isOpen = openGroups.has(group) || !!search
        const activeInGroup = visible.filter(t => selectedTags.has(t)).length

        return (
          <div key={group} className="mb-3">
            <button
              onClick={() => toggleGroup(group)}
              className="w-full flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wide py-1 hover:text-slate-700"
            >
              <span>{group}</span>
              <span className="flex items-center gap-1">
                {activeInGroup > 0 && (
                  <span className="bg-blue-100 text-blue-700 rounded-full px-1.5 py-0.5 text-xs font-medium">
                    {activeInGroup}
                  </span>
                )}
                <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>

            {isOpen && (
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {visible.map(tag => {
                  const active = selectedTags.has(tag)
                  return (
                    <button
                      key={tag}
                      onClick={() => onToggle(tag)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors font-medium ${
                        active
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-700'
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
  )
}
