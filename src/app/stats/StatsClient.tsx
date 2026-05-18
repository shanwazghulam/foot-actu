'use client'

import Image from 'next/image'
import { useState } from 'react'

type Scorer = {
  player: { id: number; name: string; nationality: string }
  team: { shortName: string; crest: string }
  goals: number
  assists: number | null
  playedMatches: number
}

type CompData = {
  code: string
  nom: string
  emoji: string
  scorers: Scorer[]
}

function RankBadge({ rank }: { rank: number }) {
  const cls =
    rank === 0 ? 'text-yellow-500' :
    rank === 1 ? 'text-gray-400' :
    rank === 2 ? 'text-amber-600' :
    'text-gray-300'
  return <span className={`w-6 text-center font-bold text-sm shrink-0 ${cls}`}>{rank + 1}</span>
}

function CompBlock({ comp, mode }: { comp: CompData; mode: 'buteurs' | 'passeurs' }) {
  const sorted = [...comp.scorers]
    .filter(s => mode === 'passeurs' ? (s.assists ?? 0) > 0 : true)
    .sort((a, b) =>
      mode === 'passeurs'
        ? (b.assists ?? 0) - (a.assists ?? 0)
        : b.goals - a.goals
    )
    .slice(0, 10)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
        <span className="text-xl">{comp.emoji}</span>
        <h2 className="font-bold text-gray-800">{comp.nom}</h2>
        <span className="text-xs text-gray-400 ml-auto">
          {mode === 'buteurs' ? 'Top buteurs' : 'Top passeurs'}
        </span>
      </div>

      {sorted.length === 0 ? (
        <p className="text-center text-gray-400 py-8 text-sm">Données indisponibles</p>
      ) : (
        <div className="divide-y divide-gray-50">
          {sorted.map((s, i) => (
            <div key={s.player.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition">
              <RankBadge rank={i} />
              <Image src={s.team.crest} alt={s.team.shortName} width={24} height={24} className="object-contain shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{s.player.name}</p>
                <p className="text-xs text-gray-400">{s.team.shortName}</p>
              </div>
              <div className="text-right shrink-0">
                {mode === 'buteurs' ? (
                  <>
                    <p className="text-sm font-bold text-gray-900">{s.goals} <span className="text-gray-400 font-normal text-xs">buts</span></p>
                    {s.assists != null && (
                      <p className="text-xs text-gray-400">{s.assists} passes</p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold text-gray-900">{s.assists ?? 0} <span className="text-gray-400 font-normal text-xs">passes</span></p>
                    <p className="text-xs text-gray-400">{s.goals} but{s.goals > 1 ? 's' : ''}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function StatsClient({ allScorers }: { allScorers: CompData[] }) {
  const [mode, setMode] = useState<'buteurs' | 'passeurs'>('buteurs')

  return (
    <>
      {/* Onglets */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('buteurs')}
          className={`px-5 py-2 rounded-xl font-semibold text-sm transition ${
            mode === 'buteurs'
              ? 'bg-gray-900 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
          }`}
        >
          ⚽ Buteurs
        </button>
        <button
          onClick={() => setMode('passeurs')}
          className={`px-5 py-2 rounded-xl font-semibold text-sm transition ${
            mode === 'passeurs'
              ? 'bg-gray-900 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
          }`}
        >
          🎯 Passeurs
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {allScorers.map(comp => (
          <CompBlock key={comp.code} comp={comp} mode={mode} />
        ))}
      </div>
    </>
  )
}
