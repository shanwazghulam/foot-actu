'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useFavoris } from '@/hooks/useFavoris'

type EquipeNav = { _id: string; nom: string; slug: { current: string }; logo: string | null }

type Props = {
  championnat: { nom: string; slug: string; emoji: string }
  equipes: EquipeNav[]
}

export default function ChampionnatDropdown({ championnat, equipes }: Props) {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { isFavori } = useFavoris()

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  const hide = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150)
  }

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <Link
        href={`/championnat/${championnat.slug}`}
        className="px-3 py-1.5 rounded-full text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition inline-block"
      >
        {championnat.emoji} {championnat.nom}
      </Link>

      {open && equipes.length > 0 && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 py-2 overflow-hidden">
          {equipes.map((equipe) => {
            const favori = isFavori(equipe.slug.current)
            return (
              <Link
                key={equipe._id}
                href={`/equipe/${equipe.slug.current}`}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 transition"
              >
                {equipe.logo ? (
                  <Image src={equipe.logo} alt={equipe.nom} width={24} height={24} className="object-contain shrink-0" />
                ) : (
                  <span className="w-6 h-6 flex items-center justify-center text-base shrink-0">⚽</span>
                )}
                <span className="text-sm text-gray-200 truncate flex-1">{equipe.nom}</span>
                {favori && <span className="text-yellow-400 text-xs shrink-0">★</span>}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
