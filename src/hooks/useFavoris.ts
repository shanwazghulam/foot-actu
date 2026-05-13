'use client'

import { useState, useEffect } from 'react'

export type EquipeFavori = {
  slug: string
  nom: string
  logo: string | null
  championnat: { nom: string; slug: string; couleur: string } | null
}

const KEY = 'foot-actu-favoris'

function load(): EquipeFavori[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export function useFavoris() {
  const [favoris, setFavoris] = useState<EquipeFavori[]>([])

  useEffect(() => {
    setFavoris(load())
  }, [])

  const isFavori = (slug: string) => favoris.some((f) => f.slug === slug)

  const toggle = (equipe: EquipeFavori) => {
    setFavoris((prev) => {
      const next = isFavori(equipe.slug)
        ? prev.filter((f) => f.slug !== equipe.slug)
        : [...prev, equipe]
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }

  return { favoris, isFavori, toggle }
}
