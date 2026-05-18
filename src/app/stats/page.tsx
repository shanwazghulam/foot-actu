import StatsClient from './StatsClient'

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
    `https://api.football-data.org/v4/competitions/${code}/scorers?limit=50`,
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
        <p className="text-gray-500">Top buteurs et passeurs des 5 grands championnats cette saison</p>
      </div>

      <StatsClient allScorers={allScorers} />
    </div>
  )
}
