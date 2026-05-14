'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Option = { _key: string; texte: string; votes: number }
type Sondage = { _id: string; question: string; emoji: string; actif: boolean; options: Option[] }

export default function SondageVote({ sondage }: { sondage: Sondage }) {
  const [options, setOptions] = useState<Option[]>(sondage.options)
  const [voted, setVoted] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const storageKey = `sondage_${sondage._id}`
  const totalVotes = options.reduce((acc, o) => acc + (o.votes || 0), 0)

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved !== null) setVoted(parseInt(saved))
  }, [storageKey])

  async function vote(idx: number) {
    if (voted !== null || loading || !sondage.actif) return
    setLoading(true)
    const res = await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sondageId: sondage._id, optionIndex: idx }),
    })
    if (res.ok) {
      const data = await res.json()
      setOptions(data.options)
      setVoted(idx)
      localStorage.setItem(storageKey, String(idx))
    }
    setLoading(false)
  }

  const hasVoted = voted !== null

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/sondages" className="text-sm text-gray-500 hover:text-gray-800 transition mb-6 inline-block">
        ← Tous les sondages
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <div className="flex items-start gap-4 mb-8">
          <span className="text-5xl shrink-0">{sondage.emoji || '🗳️'}</span>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">{sondage.question}</h1>
            {!sondage.actif && (
              <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">Sondage terminé</span>
            )}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {options.map((option, idx) => {
            const optionKey = option._key || `option-${idx}`
            const pct = totalVotes > 0 ? Math.round(((option.votes || 0) / totalVotes) * 100) : 0
            const isVoted = voted === idx
            const isWinner = hasVoted && options.every((o) => (o.votes || 0) <= (option.votes || 0))

            return (
              <button
                key={optionKey}
                onClick={() => vote(idx)}
                disabled={hasVoted || loading || !sondage.actif}
                className={`w-full text-left rounded-xl border-2 overflow-hidden transition-all ${
                  isVoted ? 'border-green-500' : hasVoted ? 'border-gray-100' : 'border-gray-200 hover:border-green-400 cursor-pointer'
                } ${loading ? 'opacity-60' : ''}`}
              >
                <div className="relative px-5 py-4">
                  {/* Barre de progression */}
                  {hasVoted && (
                    <div
                      className={`absolute inset-0 ${isVoted ? 'bg-green-50' : 'bg-gray-50'} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  )}
                  <div className="relative flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {isVoted && <span className="text-green-500 shrink-0">✓</span>}
                      {isWinner && !isVoted && hasVoted && <span className="shrink-0">🏆</span>}
                      <span className={`font-medium truncate ${isVoted ? 'text-green-700' : 'text-gray-800'}`}>
                        {option.texte}
                      </span>
                    </div>
                    {hasVoted && (
                      <div className="text-right shrink-0">
                        <span className={`text-sm font-bold ${isVoted ? 'text-green-600' : 'text-gray-500'}`}>{pct}%</span>
                        <span className="text-xs text-gray-400 ml-1">({option.votes || 0})</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <p className="text-sm text-center text-gray-400">
          {hasVoted ? `${totalVotes} vote${totalVotes > 1 ? 's' : ''} au total` : 'Clique pour voter'}
        </p>
      </div>
    </div>
  )
}
