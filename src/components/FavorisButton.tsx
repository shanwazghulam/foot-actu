'use client'

import { useFavoris, type EquipeFavori } from '@/hooks/useFavoris'

export default function FavorisButton({ equipe }: { equipe: EquipeFavori }) {
  const { isFavori, toggle } = useFavoris()
  const favori = isFavori(equipe.slug)

  return (
    <button
      onClick={() => toggle(equipe)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition ${
        favori
          ? 'bg-yellow-400 border-yellow-400 text-gray-900 hover:bg-yellow-300'
          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
      }`}
    >
      <span>{favori ? '★' : '☆'}</span>
      {favori ? 'Favori' : 'Ajouter aux favoris'}
    </button>
  )
}
