'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useFavoris } from '@/hooks/useFavoris'

type EquipeNav = { _id: string; nom: string; slug: { current: string }; logo: string | null }
type ChampionnatNav = { nom: string; slug: string; emoji: string }

type Props = {
  championnats: ChampionnatNav[]
  equipesByChampionnat: Record<string, EquipeNav[]>
}

export default function ChampionnatsMenu({ championnats, equipesByChampionnat }: Props) {
  const [open, setOpen] = useState(false)
  const [activeSlug, setActiveSlug] = useState(championnats[0]?.slug ?? '')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { isFavori } = useFavoris()

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  const hide = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200)
  }

  const activeEquipes = equipesByChampionnat[activeSlug] ?? []

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button className="px-3 py-1.5 rounded-full text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition flex items-center gap-1">
        🏆 Championnats
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 flex overflow-hidden" style={{ width: '420px' }}>
          {/* Colonne ligues */}
          <div className="w-40 border-r border-gray-700 py-2 shrink-0">
            {championnats.map((c) => (
              <button
                key={c.slug}
                onMouseEnter={() => setActiveSlug(c.slug)}
                onClick={() => setOpen(false)}
                className={`w-full text-left px-4 py-2.5 text-sm transition flex items-center gap-2 ${activeSlug === c.slug ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                <span>{c.emoji}</span>
                <Link href={`/championnat/${c.slug}`} className="flex-1 font-medium">{c.nom}</Link>
              </button>
            ))}
          </div>

          {/* Colonne équipes */}
          <div className="flex-1 py-2 overflow-y-auto max-h-72">
            {activeEquipes.map((equipe) => {
              const favori = isFavori(equipe.slug.current)
              return (
                <Link
                  key={equipe._id}
                  href={`/equipe/${equipe.slug.current}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 transition"
                >
                  {equipe.logo ? (
                    <Image src={equipe.logo} alt={equipe.nom} width={20} height={20} className="object-contain shrink-0" />
                  ) : (
                    <span className="w-5 h-5 flex items-center justify-center shrink-0">⚽</span>
                  )}
                  <span className="text-sm text-gray-200 truncate flex-1">{equipe.nom}</span>
                  {favori && <span className="text-yellow-400 text-xs shrink-0">★</span>}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
