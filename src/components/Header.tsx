import Link from 'next/link'
import { client } from '@/sanity/client'
import { toutesEquipesQuery } from '@/sanity/queries'
import ChampionnatDropdown from './ChampionnatDropdown'

const championnats = [
  { nom: 'Ligue 1', slug: 'ligue-1', emoji: '🇫🇷' },
  { nom: 'Premier League', slug: 'premier-league', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { nom: 'LaLiga', slug: 'laliga', emoji: '🇪🇸' },
  { nom: 'Serie A', slug: 'serie-a', emoji: '🇮🇹' },
  { nom: 'Bundesliga', slug: 'bundesliga', emoji: '🇩🇪' },
]

type EquipeNav = { _id: string; nom: string; slug: { current: string }; logo: string | null; championnat: { slug: { current: string } } }

export default async function Header() {
  const equipes: EquipeNav[] = await client.fetch(toutesEquipesQuery, {}, { next: { revalidate: 3600 } })

  const equipesByChampionnat = championnats.reduce<Record<string, EquipeNav[]>>((acc, c) => {
    acc[c.slug] = equipes.filter((e) => e.championnat?.slug?.current === c.slug)
    return acc
  }, {})

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-green-400 hover:text-green-300 transition">
            ⚽ FootActu
          </Link>
          <nav className="hidden md:flex gap-1 items-center">
            {championnats.map((c) => (
              <ChampionnatDropdown
                key={c.slug}
                championnat={c}
                equipes={equipesByChampionnat[c.slug] ?? []}
              />
            ))}
            <Link
              href="/live"
              className="px-3 py-1.5 rounded-full text-sm font-medium text-red-400 hover:bg-gray-700 hover:text-red-300 transition"
            >
              🔴 Live
            </Link>
            <Link
              href="/classement"
              className="px-3 py-1.5 rounded-full text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition"
            >
              📊 Classement
            </Link>
            <Link
              href="/favoris"
              className="px-3 py-1.5 rounded-full text-sm font-medium text-yellow-400 hover:bg-gray-700 hover:text-yellow-300 transition"
            >
              ⭐ Favoris
            </Link>
          </nav>
          <Link href="/studio" className="text-xs text-gray-500 hover:text-gray-300 transition">
            Studio
          </Link>
        </div>
        {/* Mobile nav */}
        <div className="md:hidden flex gap-1 pb-3 overflow-x-auto">
          {championnats.map((c) => (
            <Link
              key={c.slug}
              href={`/championnat/${c.slug}`}
              className="shrink-0 px-3 py-1 rounded-full text-xs font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 transition"
            >
              {c.emoji} {c.nom}
            </Link>
          ))}
          <Link
            href="/live"
            className="shrink-0 px-3 py-1 rounded-full text-xs font-medium text-red-400 bg-gray-800 hover:bg-gray-700 transition"
          >
            🔴 Live
          </Link>
          <Link
            href="/classement"
            className="shrink-0 px-3 py-1 rounded-full text-xs font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 transition"
          >
            📊 Classement
          </Link>
          <Link
            href="/favoris"
            className="shrink-0 px-3 py-1 rounded-full text-xs font-medium text-yellow-400 bg-gray-800 hover:bg-gray-700 transition"
          >
            ⭐ Favoris
          </Link>
        </div>
      </div>
    </header>
  )
}
