import Image from 'next/image'
import Link from 'next/link'

export const revalidate = 3600

const ligues = [
  { nom: 'Ligue 1',          slug: 'ligue-1',          code: 'FL1', emoji: '🇫🇷' },
  { nom: 'Premier League',   slug: 'premier-league',   code: 'PL',  emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { nom: 'LaLiga',           slug: 'laliga',           code: 'PD',  emoji: '🇪🇸' },
  { nom: 'Serie A',          slug: 'serie-a',          code: 'SA',  emoji: '🇮🇹' },
  { nom: 'Bundesliga',       slug: 'bundesliga',       code: 'BL1', emoji: '🇩🇪' },
  { nom: 'Champions League', slug: 'champions-league', code: 'CL',  emoji: '🏆' },
  { nom: 'Eredivisie',       slug: 'eredivisie',       code: 'DED', emoji: '🇳🇱' },
  { nom: 'Primeira Liga',    slug: 'primeira-liga',    code: 'PPL', emoji: '🇵🇹' },
]

type StandingRow = {
  position: number
  team: { id: number; name: string; shortName: string; crest: string }
  playedGames: number
  won: number
  draw: number
  lost: number
  points: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  form: string | null
}

async function fetchStandings(code: string): Promise<StandingRow[]> {
  const res = await fetch(`https://api.football-data.org/v4/competitions/${code}/standings`, {
    headers: { 'X-Auth-Token': process.env.FOOTBALL_API_TOKEN! },
    next: { revalidate: 3600 },
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.standings?.[0]?.table ?? []
}

export default async function ClassementPage({
  searchParams,
}: {
  searchParams: Promise<{ ligue?: string }>
}) {
  const { ligue } = await searchParams
  const active = ligues.find((l) => l.slug === ligue) ?? ligues[0]
  const standings = await fetchStandings(active.code)

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Classement</h1>

      {/* Sélecteur de ligue */}
      <div className="flex flex-wrap gap-2 mb-8">
        {ligues.map((l) => (
          <Link
            key={l.slug}
            href={`/classement?ligue=${l.slug}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              l.slug === active.slug
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 shadow-sm'
            }`}
          >
            {l.emoji} {l.nom}
          </Link>
        ))}
      </div>

      {/* Table */}
      {standings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📋</p>
          <p>Classement indisponible pour le moment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
            <span className="text-xl">{active.emoji}</span>
            <h2 className="text-lg font-bold text-gray-800">{active.nom}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3 text-left w-8">#</th>
                  <th className="px-2 py-3 text-left">Équipe</th>
                  <th className="px-3 py-3 text-center">J</th>
                  <th className="px-3 py-3 text-center">G</th>
                  <th className="px-3 py-3 text-center">N</th>
                  <th className="px-3 py-3 text-center">P</th>
                  <th className="px-3 py-3 text-center">BP</th>
                  <th className="px-3 py-3 text-center">BC</th>
                  <th className="px-3 py-3 text-center">DB</th>
                  <th className="px-3 py-3 text-center font-bold text-gray-600">Pts</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((row, i) => {
                  const total = standings.length
                  const borderColor =
                    i < 4 ? 'border-l-blue-500'
                    : i < 6 ? 'border-l-orange-400'
                    : total - i <= 3 ? 'border-l-red-400'
                    : 'border-l-transparent'

                  return (
                    <tr key={row.team.id} className={`border-b border-gray-50 hover:bg-gray-50 transition border-l-2 ${borderColor}`}>
                      <td className="px-5 py-3 text-gray-500 font-medium">{row.position}</td>
                      <td className="px-2 py-3">
                        <Link href={`/equipe/fdo/${row.team.id}`} className="flex items-center gap-2.5 hover:text-green-600 transition group">
                          <Image
                            src={row.team.crest}
                            alt={row.team.shortName}
                            width={22}
                            height={22}
                            className="object-contain shrink-0"
                          />
                          <span className="font-medium text-gray-800 group-hover:text-green-600">{row.team.shortName}</span>
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-center text-gray-600">{row.playedGames}</td>
                      <td className="px-3 py-3 text-center text-gray-600">{row.won}</td>
                      <td className="px-3 py-3 text-center text-gray-600">{row.draw}</td>
                      <td className="px-3 py-3 text-center text-gray-600">{row.lost}</td>
                      <td className="px-3 py-3 text-center text-gray-500">{row.goalsFor}</td>
                      <td className="px-3 py-3 text-center text-gray-500">{row.goalsAgainst}</td>
                      <td className="px-3 py-3 text-center text-gray-500">
                        {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                      </td>
                      <td className="px-3 py-3 text-center font-bold text-gray-900">{row.points}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap gap-4 px-6 py-3 border-t border-gray-100 text-xs text-gray-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block"></span>Ligue des Champions</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-orange-400 inline-block"></span>Europa League</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-400 inline-block"></span>Relégation</span>
          </div>
        </div>
      )}
    </div>
  )
}
