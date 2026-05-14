'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

type Match = {
  id: number
  utcDate: string
  status: string
  competition: { name: string; emblem: string }
  homeTeam: { shortName: string; crest: string }
  awayTeam: { shortName: string; crest: string }
  score: { fullTime: { home: number | null; away: number | null }; halfTime: { home: number | null; away: number | null } }
  minute?: number
}

const statusLabel: Record<string, { label: string; color: string }> = {
  IN_PLAY:  { label: 'LIVE', color: 'bg-red-500 text-white animate-pulse' },
  PAUSED:   { label: 'MT', color: 'bg-orange-400 text-white' },
  FINISHED: { label: 'FT', color: 'bg-gray-200 text-gray-600' },
  SCHEDULED:{ label: '', color: '' },
  TIMED:    { label: '', color: '' },
}

const compEmoji: Record<string, string> = {
  'Premier League': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Primera Division': '🇪🇸',
  'Bundesliga': '🇩🇪',
  'Serie A': '🇮🇹',
  'Ligue 1': '🇫🇷',
}

function formatTime(utcDate: string) {
  return new Date(utcDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function groupByCompetition(matches: Match[]) {
  return matches.reduce((acc: Record<string, Match[]>, m) => {
    const key = m.competition.name
    if (!acc[key]) acc[key] = []
    acc[key].push(m)
    return acc
  }, {})
}

export default function LiveScores() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState('')

  async function load() {
    const res = await fetch('/api/scores')
    const data = await res.json()
    setMatches(data)
    setLastUpdate(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }))
    setLoading(false)
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 60000)
    return () => clearInterval(interval)
  }, [])

  const hasLive = matches.some(m => m.status === 'IN_PLAY' || m.status === 'PAUSED')
  const grouped = groupByCompetition(matches)

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">
          {hasLive ? '🔴 Scores en direct' : '📅 Matches du jour'}
        </h2>
        {lastUpdate && (
          <span className="text-xs text-gray-400">Mis à jour à {lastUpdate}</span>
        )}
      </div>

      {loading ? (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="shrink-0 w-56 h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-6">Aucun match aujourd&apos;hui</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([comp, compMatches]) => (
            <div key={comp}>
              <p className="text-xs font-semibold text-gray-500 mb-2">
                {compEmoji[comp] ?? '🏆'} {comp}
              </p>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {compMatches.map((m) => {
                  const s = statusLabel[m.status]
                  const isLive = m.status === 'IN_PLAY' || m.status === 'PAUSED'
                  const hasScore = m.score.fullTime.home !== null

                  return (
                    <div
                      key={m.id}
                      className={`shrink-0 w-52 bg-white border rounded-xl p-3 flex flex-col gap-2 ${isLive ? 'border-red-300 shadow-sm' : 'border-gray-200'}`}
                    >
                      {/* Status */}
                      <div className="flex justify-between items-center">
                        {s?.label ? (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span>
                        ) : (
                          <span className="text-xs text-gray-400">{formatTime(m.utcDate)}</span>
                        )}
                      </div>

                      {/* Home */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {m.homeTeam.crest && (
                            <Image src={m.homeTeam.crest} alt="" width={16} height={16} className="object-contain shrink-0" />
                          )}
                          <span className="text-sm font-medium text-gray-800 truncate">{m.homeTeam.shortName}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900 shrink-0">
                          {hasScore ? m.score.fullTime.home : '-'}
                        </span>
                      </div>

                      {/* Away */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {m.awayTeam.crest && (
                            <Image src={m.awayTeam.crest} alt="" width={16} height={16} className="object-contain shrink-0" />
                          )}
                          <span className="text-sm font-medium text-gray-800 truncate">{m.awayTeam.shortName}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900 shrink-0">
                          {hasScore ? m.score.fullTime.away : '-'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
