'use client'

import { useFavoris } from '@/hooks/useFavoris'
import Link from 'next/link'
import Image from 'next/image'

type Equipe = { _id: string; nom: string; slug: { current: string }; pays: string; logo: string }

export default function EquipesGrid({ equipes }: { equipes: Equipe[] }) {
  const { isFavori } = useFavoris()

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {equipes.map((equipe) => {
        const favori = isFavori(equipe.slug.current)
        return (
          <Link
            key={equipe._id}
            href={`/equipe/${equipe.slug.current}`}
            className="relative flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-green-400 hover:shadow-md transition group"
          >
            {favori && (
              <span className="absolute top-2 right-2 text-yellow-400 text-sm leading-none" title="Favori">★</span>
            )}
            {equipe.logo ? (
              <Image
                src={equipe.logo}
                alt={equipe.nom}
                width={48}
                height={48}
                className="object-contain"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">⚽</div>
            )}
            <span className="text-xs font-medium text-gray-700 text-center group-hover:text-green-600 transition leading-tight">
              {equipe.nom}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
