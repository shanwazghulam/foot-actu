'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const posteMap: Record<string, string> = {
  Goalkeeper: 'Gardien',
  Defence: 'Défenseur',
  'Centre-Back': 'Défenseur',
  'Left-Back': 'Défenseur',
  'Right-Back': 'Défenseur',
  Midfield: 'Milieu',
  'Central Midfield': 'Milieu',
  'Defensive Midfield': 'Milieu',
  'Attacking Midfield': 'Milieu',
  Offence: 'Attaquant',
  'Centre-Forward': 'Attaquant',
  'Left Winger': 'Attaquant',
  'Right Winger': 'Attaquant',
  'Secondary Striker': 'Attaquant',
}

const couleurMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  red: 'bg-red-100 text-red-700',
  green: 'bg-green-100 text-green-700',
  gray: 'bg-gray-100 text-gray-600',
}

type Joueur = {
  _id: string
  nom: string
  position: string
  nationalite: string
  dateNaissance: string
  fdoId: number
  equipe: {
    nom: string
    slug: { current: string }
    logo: string
    championnat: { nom: string; slug: { current: string }; couleur: string }
  }
}

function age(dateNaissance: string) {
  if (!dateNaissance) return null
  const diff = Date.now() - new Date(dateNaissance).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
}

export default function JoueursPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Joueur[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); setSearched(false); return }
    setLoading(true)
    setSearched(true)
    const res = await fetch(`/api/joueurs?q=${encodeURIComponent(q)}`)
    const data = await res.json()
    setResults(data)
    setLoading(false)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    clearTimeout((window as unknown as { _searchTimer: ReturnType<typeof setTimeout> })._searchTimer)
    ;(window as unknown as { _searchTimer: ReturnType<typeof setTimeout> })._searchTimer = setTimeout(() => search(val), 300)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">👤 Joueurs</h1>
      <p className="text-gray-500 mb-6">Recherche parmi les effectifs des 5 grands championnats</p>

      {/* Barre de recherche */}
      <div className="relative mb-8">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Rechercher un joueur... (ex: Mbappé, Salah, Lewandowski)"
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-white shadow-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-base"
        />
        {loading && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 animate-spin">⟳</span>
        )}
      </div>

      {/* Résultats */}
      {!searched && (
        <div className="text-center text-gray-400 py-16">
          <p className="text-5xl mb-3">⚽</p>
          <p className="text-base">Tape le nom d&apos;un joueur pour commencer</p>
        </div>
      )}

      {searched && !loading && results.length === 0 && (
        <div className="text-center text-gray-400 py-16">
          <p className="text-5xl mb-3">🤷</p>
          <p className="text-base">Aucun joueur trouvé pour &quot;{query}&quot;</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-gray-400">{results.length} résultat{results.length > 1 ? 's' : ''}</p>
          {results.map((j) => {
            const couleur = couleurMap[j.equipe?.championnat?.couleur] ?? 'bg-gray-100 text-gray-600'
            const a = age(j.dateNaissance)
            return (
              <Link
                key={j._id}
                href={`/joueurs/${j.fdoId}`}
                className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-4 hover:border-green-400 hover:shadow-sm transition group"
              >
                {j.equipe?.logo ? (
                  <Image src={j.equipe.logo} alt={j.equipe.nom} width={40} height={40} className="object-contain shrink-0" />
                ) : (
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">⚽</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 group-hover:text-green-600 transition">{j.nom}</p>
                  <p className="text-sm text-gray-500">
                    {posteMap[j.position] ?? j.position}
                    {j.nationalite && ` · ${j.nationalite}`}
                    {a && ` · ${a} ans`}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${couleur}`}>
                    {j.equipe?.championnat?.nom}
                  </span>
                  <span className="text-xs text-gray-400">{j.equipe?.nom}</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
