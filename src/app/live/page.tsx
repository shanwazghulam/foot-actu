'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'

const compNames: Record<string, { nom: string; emoji: string }> = {
  FL1: { nom: 'Ligue 1',          emoji: '🇫🇷' },
  PL:  { nom: 'Premier League',   emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  PD:  { nom: 'LaLiga',           emoji: '🇪🇸' },
  SA:  { nom: 'Serie A',          emoji: '🇮🇹' },
  BL1: { nom: 'Bundesliga',       emoji: '🇩🇪' },
  CL:  { nom: 'Champions League', emoji: '🏆' },
  DED: { nom: 'Eredivisie',       emoji: '🇳🇱' },
  PPL: { nom: 'Primeira Liga',    emoji: '🇵🇹' },
}

type Match = {
  id: number
  utcDate: string
  status: 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'TIMED' | 'SCHEDULED' | string
  matchday: number
  competition: { code: string; emblem: string }
  homeTeam: { id: number; shortName: string; crest: string }
  awayTeam: { id: number; shortName: string; crest: string }
  score: { fullTime: { home: number | null; away: number | null } }
}

function statusLabel(status: string) {
  if (status === 'IN_PLAY') return { label: 'EN DIRECT', cls: 'bg-red-500 text-white animate-pulse' }
  if (status === 'PAUSED')   return { label: 'MI-TEMPS',  cls: 'bg-orange-400 text-white' }
  if (status === 'FINISHED') return { label: 'TERMINÉ',   cls: 'bg-gray-200 text-gray-600' }
  return { label: 'À VENIR', cls: 'bg-blue-100 text-blue-700' }
}

function formatTime(utcDate: string) {
  return new Date(utcDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function MatchCard({ match }: { match: Match }) {
  const { label, cls } = statusLabel(match.status)
  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED'
  const isDone = match.status === 'FINISHED'
  const comp = compNames[match.competition.code]
  const home = match.score.fullTime.home
  const away = match.score.fullTime.away

  return (
    <div className={`bg-white rounded-2xl border p-4 transition ${isLive ? 'border-red-300 shadow-md shadow-red-50' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400">{comp?.emoji} {comp?.nom} · J{match.matchday}</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Domicile */}
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <Image src={match.homeTeam.crest} alt={match.homeTeam.shortName} width={36} height={36} className="object-contain" />
          <span className="text-xs font-medium text-gray-700 text-center leading-tight">{match.homeTeam.shortName}</span>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center gap-0.5 w-16 shrink-0">
          {isLive || isDone ? (
            <span className={`text-2xl font-extrabold ${isLive ? 'text-red-600' : 'text-gray-900'}`}>
              {home ?? 0} - {away ?? 0}
            </span>
          ) : (
            <span className="text-sm font-bold text-gray-400">{formatTime(match.utcDate)}</span>
          )}
        </div>

        {/* Extérieur */}
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <Image src={match.awayTeam.crest} alt={match.awayTeam.shortName} width={36} height={36} className="object-contain" />
          <span className="text-xs font-medium text-gray-700 text-center leading-tight">{match.awayTeam.shortName}</span>
        </div>
      </div>
    </div>
  )
}

export default function LivePage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchMatches = useCallback(async () => {
    try {
      const res = await fetch('/api/live')
      const data = await res.json()
      setMatches(data.matches ?? [])
      setLastUpdate(new Date())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMatches()
    const interval = setInterval(fetchMatches, 60_000)
    return () => clearInterval(interval)
  }, [fetchMatches])

  const live     = matches.filter((m) => m.status === 'IN_PLAY' || m.status === 'PAUSED')
  const finished = matches.filter((m) => m.status === 'FINISHED')
  const upcoming = matches.filter((m) => m.status === 'TIMED' || m.status === 'SCHEDULED')

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">
          🔴 Résultats live
        </h1>
        {lastUpdate && (
          <span className="text-xs text-gray-400">
            Mis à jour à {lastUpdate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 h-32 animate-pulse bg-gray-50" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-5xl mb-4">⏸</p>
          <p className="text-lg font-medium">Aucun match aujourd'hui</p>
        </div>
      ) : (
        <div className="space-y-8">
          {live.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-red-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block"></span>
                En direct ({live.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {live.map((m) => <MatchCard key={m.id} match={m} />)}
              </div>
            </section>
          )}

          {upcoming.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-blue-500 uppercase tracking-wider mb-3">À venir ({upcoming.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcoming.map((m) => <MatchCard key={m.id} match={m} />)}
              </div>
            </section>
          )}

          {finished.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Terminés ({finished.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {finished.map((m) => <MatchCard key={m.id} match={m} />)}
              </div>
            </section>
          )}
        </div>
      )}

      <p className="text-xs text-gray-300 text-center mt-10">Actualisation automatique toutes les 60 secondes</p>
    </div>
  )
}
