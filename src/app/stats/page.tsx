import Image from 'next/image'

export const revalidate = 3600

const competitions = [
  { code: 'FL1', nom: 'Ligue 1', emoji: '🇫🇷' },
  { code: 'PL',  nom: 'Premier League', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'PD',  nom: 'LaLiga', emoji: '🇪🇸' },
  { code: 'SA',  nom: 'Serie A', emoji: '🇮🇹' },
  { code: 'BL1', nom: 'Bundesliga', emoji: '🇩🇪' },
]

type Scorer = {
  player: { id: number; name: string; nationality: string }
  team: { shortName: string; crest: string }
  goals: number
  assists: number | null
  playedMatches: number
}

async function fetchScorers(code: string): Promise<Scorer[]> {
  const res = await fetch(
    `https://api.football-data.org/v4/competitions/${code}/scorers?limit=10`,
    { headers: { 'X-Auth-Token': process.env.FOOTBALL_API_TOKEN! }, next: { revalidate: 3600 } }
  )
  if (!res.ok) return []
  const data = await res.json()
  return data.scorers ?? []
}

export default async function StatsPage() {
  const allScorers = await Promise.all(
    competitions.map(async (c) => ({ ...c, scorers: await fetchScorers(c.code) }))
  )

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">📊 Statistiques</h1>
        <p className="text-gray-500">Top buteurs des 5 grands championnats cette saison</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {allScorers.map(({ code, nom, emoji, scorers }) => (
          <div key={code} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <span className="text-xl">{emoji}</span>
              <h2 className="font-bold text-gray-800">{nom}</h2>
              <span className="text-xs text-gray-400 ml-auto">Top buteurs</span>
            </div>

            {scorers.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">Données indisponibles</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {scorers.map((s, i) => (
                  <div key={s.player.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition">
                    <span className={`w-6 text-center font-bold text-sm shrink-0 ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-600' : 'text-gray-300'}`}>
                      {i + 1}
                    </span>
                    <Image src={s.team.crest} alt={s.team.shortName} width={24} height={24} className="object-contain shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{s.player.name}</p>
                      <p className="text-xs text-gray-400">{s.team.shortName}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-gray-900">{s.goals} <span className="text-gray-400 font-normal text-xs">buts</span></p>
                      {s.assists != null && (
                        <p className="text-xs text-gray-400">{s.assists} passes</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
