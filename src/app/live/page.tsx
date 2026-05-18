'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const compNames: Record<string, { nom: string; emoji: string }> = {
  FL1: { nom: 'Ligue 1',          emoji: '🇫🇷' },
  PL:  { nom: 'Premier League',   emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  PD:  { nom: 'LaLiga',           emoji: '🇪🇸' },
  SA:  { nom: 'Serie A',          emoji: '🇮🇹' },
  BL1: { nom: 'Bundesliga',       emoji: '🇩🇪' },
  CL:  { nom: 'Champions League', emoji: '🏆' },
}

type Match = {
  id: number
  utcDate: string
  status: string
  matchday: number
  competition: { code: string; name: string; emblem: string }
  homeTeam: { id: number; shortName: string; crest: string }
  awayTeam: { id: number; shortName: string; crest: string }
  score: { fullTime: { home: number | null; away: number | null } }
}

function localDateStr(offset = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatDay(offset: number) {
  if (offset === 0) return "Aujourd'hui"
  if (offset === -1) return 'Hier'
  if (offset === 1) return 'Demain'
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

function StatusBadge({ match }: { match: Match }) {
  const { status } = match
  const home = match.score.fullTime.home
  const away = match.score.fullTime.away

  if (status === 'IN_PLAY' || status === 'PAUSED') {
    const hasScore = home !== null && away !== null && (home > 0 || away > 0)
    return (
      <div className="flex flex-col items-center">
        {hasScore ? (
          <span className="text-red-500 font-extrabold text-lg leading-none animate-pulse">
            {home} - {away}
          </span>
        ) : (
          <span className="text-red-500 font-bold text-sm leading-none animate-pulse">EN DIRECT</span>
        )}
        <span className="text-xs text-red-400 font-semibold mt-0.5">{status === 'PAUSED' ? 'Mi-temps' : '🔴 Live'}</span>
      </div>
    )
  }
  if (status === 'FINISHED') {
    return (
      <div className="flex flex-col items-center">
        <span className="text-gray-900 font-extrabold text-lg leading-none">{home ?? 0} - {away ?? 0}</span>
        <span className="text-xs text-gray-400 mt-0.5">Terminé</span>
      </div>
    )
  }
  const time = new Date(match.utcDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  return (
    <div className="flex flex-col items-center">
      <span className="text-green-600 font-bold text-base">{time}</span>
    </div>
  )
}

function MatchRow({ match }: { match: Match }) {
  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED'

  return (
    <div className={`flex items-center px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition ${isLive ? 'bg-red-50' : ''}`}>
      {/* Équipe domicile */}
      <div className="flex-1 flex items-center justify-end gap-2 min-w-0">
        <span className="text-sm font-semibold text-gray-800 truncate text-right">{match.homeTeam.shortName}</span>
        <Image src={match.homeTeam.crest} alt={match.homeTeam.shortName} width={24} height={24} className="object-contain shrink-0" />
      </div>

      {/* Score / heure */}
      <div className="w-28 shrink-0 flex justify-center">
        <StatusBadge match={match} />
      </div>

      {/* Équipe extérieure */}
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <Image src={match.awayTeam.crest} alt={match.awayTeam.shortName} width={24} height={24} className="object-contain shrink-0" />
        <span className="text-sm font-semibold text-gray-800 truncate">{match.awayTeam.shortName}</span>
      </div>
    </div>
  )
}

function CompetitionGroup({ code, matches }: { code: string; matches: Match[] }) {
  const comp = compNames[code] ?? { nom: matches[0]?.competition.name ?? code, emoji: '⚽' }
  const hasLive = matches.some(m => m.status === 'IN_PLAY' || m.status === 'PAUSED')

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className={`flex items-center gap-2 px-4 py-3 border-b border-gray-100 ${hasLive ? 'bg-red-50' : 'bg-gray-50'}`}>
        <span className="text-base">{comp.emoji}</span>
        <span className="font-bold text-gray-800 text-sm">{comp.nom}</span>
        {hasLive && <span className="ml-auto flex items-center gap-1 text-xs text-red-500 font-semibold"><span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse inline-block"/>LIVE</span>}
      </div>
      {matches.map(m => <MatchRow key={m.id} match={m} />)}
    </div>
  )
}

export default function LivePage() {
  const [offset, setOffset] = useState(0)
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [countdown, setCountdown] = useState(30)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const url = offset === 0 ? '/api/live' : `/api/resultats?date=${localDateStr(offset)}`
        const res = await fetch(url)
        const data = await res.json()
        if (!cancelled) {
          setMatches(data.matches ?? [])
          setLastUpdate(new Date())
          setCountdown(30)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    if (offset === 0) {
      const interval = setInterval(load, 30_000)
      const tick = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1_000)
      return () => { cancelled = true; clearInterval(interval); clearInterval(tick) }
    }
    return () => { cancelled = true }
  }, [offset])

  // Grouper par compétition
  const byComp = matches.reduce<Record<string, Match[]>>((acc, m) => {
    const key = m.competition.code
    if (!acc[key]) acc[key] = []
    acc[key].push(m)
    return acc
  }, {})

  const compOrder = ['FL1', 'PL', 'PD', 'SA', 'BL1', 'CL']
  const sortedComps = [
    ...compOrder.filter(c => byComp[c]),
    ...Object.keys(byComp).filter(c => !compOrder.includes(c)),
  ]

  const liveCount = matches.filter(m => m.status === 'IN_PLAY' || m.status === 'PAUSED').length

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">
          {liveCount > 0 ? <span className="text-red-500">🔴 {liveCount} match{liveCount > 1 ? 's' : ''} en direct</span> : '⚽ Matchs du jour'}
        </h1>
        {lastUpdate && offset === 0 && (
          <span className="text-xs text-gray-400">
            {lastUpdate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            {' '}· actu dans {countdown}s
          </span>
        )}
      </div>

      {/* Navigation par date */}
      <div className="flex items-center justify-between mb-6 bg-white border border-gray-200 rounded-2xl px-4 py-3">
        <button
          onClick={() => setOffset(o => o - 1)}
          disabled={offset <= -15}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition disabled:opacity-30"
        >
          ←
        </button>
        <span className="font-semibold text-gray-800 capitalize text-sm">
          {formatDay(offset)}
        </span>
        <button
          onClick={() => setOffset(o => o + 1)}
          disabled={offset >= 3}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition disabled:opacity-30"
        >
          →
        </button>
      </div>

      {/* Contenu */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
              <div className="h-10 bg-gray-100" />
              {[...Array(3)].map((_, j) => <div key={j} className="h-14 border-t border-gray-100 bg-white" />)}
            </div>
          ))}
        </div>
      ) : sortedComps.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-5xl mb-4">⏸</p>
          <p className="text-lg font-medium">Aucun match ce jour</p>
          <p className="text-sm mt-2">Essaie de naviguer vers un autre jour avec les flèches ← →</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedComps.map(code => (
            <CompetitionGroup key={code} code={code} matches={byComp[code]} />
          ))}
        </div>
      )}

      {offset === 0 && <p className="text-xs text-gray-300 text-center mt-8">Actualisation toutes les 60 secondes</p>}
    </div>
  )
}
