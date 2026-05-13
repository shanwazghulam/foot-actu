'use client'

import { useFavoris } from '@/hooks/useFavoris'
import Link from 'next/link'
import Image from 'next/image'

const couleurMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-800',
  purple: 'bg-purple-100 text-purple-800',
  red: 'bg-red-100 text-red-800',
  green: 'bg-green-100 text-green-800',
  gray: 'bg-gray-100 text-gray-800',
}

export default function FavorisPage() {
  const { favoris, toggle } = useFavoris()

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">⭐ Mes favoris</h1>
      <p className="text-gray-500 mb-8">
        {favoris.length === 0
          ? "Aucune équipe ajoutée pour l'instant."
          : `${favoris.length} équipe${favoris.length > 1 ? 's' : ''} dans vos favoris`}
      </p>

      {favoris.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <p className="text-5xl mb-4">☆</p>
          <p className="text-gray-600 mb-6">Rendez-vous sur la page d'une équipe pour l'ajouter ici.</p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-green-500 text-white rounded-full font-medium hover:bg-green-400 transition"
          >
            Parcourir les championnats
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoris.map((equipe) => {
            const couleur = couleurMap[equipe.championnat?.couleur ?? 'gray'] ?? 'bg-gray-100 text-gray-800'
            return (
              <div
                key={equipe.slug}
                className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4"
              >
                <div className="flex items-center gap-4">
                  {equipe.logo ? (
                    <Image
                      src={equipe.logo}
                      alt={equipe.nom}
                      width={56}
                      height={56}
                      className="object-contain shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-3xl shrink-0">
                      ⚽
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate">{equipe.nom}</p>
                    {equipe.championnat && (
                      <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${couleur}`}>
                        {equipe.championnat.nom}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-auto">
                  <Link
                    href={`/equipe/${equipe.slug}`}
                    className="flex-1 text-center px-3 py-2 bg-gray-900 text-white text-sm rounded-full font-medium hover:bg-gray-700 transition"
                  >
                    Voir l'équipe
                  </Link>
                  <button
                    onClick={() => toggle(equipe)}
                    className="px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-red-50 hover:text-red-500 transition"
                    title="Retirer des favoris"
                  >
                    ★
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
