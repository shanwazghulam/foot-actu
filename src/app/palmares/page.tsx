import Image from 'next/image'

export const revalidate = 86400

const competitions = [
  { code: 'FL1', nom: 'Ligue 1', emoji: '🇫🇷', color: 'border-blue-400' },
  { code: 'PL',  nom: 'Premier League', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: 'border-purple-400' },
  { code: 'PD',  nom: 'LaLiga', emoji: '🇪🇸', color: 'border-red-400' },
  { code: 'SA',  nom: 'Serie A', emoji: '🇮🇹', color: 'border-green-400' },
  { code: 'BL1', nom: 'Bundesliga', emoji: '🇩🇪', color: 'border-gray-400' },
]

type Season = {
  startDate: string
  endDate: string
  winner: { name: string; shortName: string; crest: string } | null
}

async function fetchSeasons(code: string): Promise<Season[]> {
  const res = await fetch(`https://api.football-data.org/v4/competitions/${code}`, {
    headers: { 'X-Auth-Token': process.env.FOOTBALL_API_TOKEN! },
    next: { revalidate: 86400 },
  })
  if (!res.ok) return []
  const data = await res.json()
  return (data.seasons ?? [])
    .filter((s: Season) => s.winner !== null)
    .slice(0, 10)
}

export default async function PalmaresPage() {
  const allSeasons = await Promise.all(
    competitions.map(async (c) => ({ ...c, seasons: await fetchSeasons(c.code) }))
  )

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">🏆 Palmarès</h1>
        <p className="text-gray-500">Les derniers champions des 5 grands championnats</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {allSeasons.map(({ code, nom, emoji, color, seasons }) => (
          <div key={code} className={`bg-white rounded-2xl border-2 ${color} overflow-hidden`}>
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <span className="text-xl">{emoji}</span>
              <h2 className="font-bold text-gray-800">{nom}</h2>
            </div>

            {seasons.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">Données indisponibles</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {seasons.map((s, i) => {
                  const annee = s.startDate?.slice(0, 4)
                  const anneeFin = s.endDate?.slice(2, 4)
                  return (
                    <div key={i} className={`flex items-center gap-3 px-5 py-3 ${i === 0 ? 'bg-yellow-50' : 'hover:bg-gray-50'} transition`}>
                      <div className="w-16 shrink-0">
                        <span className={`text-xs font-bold ${i === 0 ? 'text-yellow-600' : 'text-gray-500'}`}>
                          {annee}/{anneeFin}
                        </span>
                        {i === 0 && <p className="text-xs text-yellow-500">★ Dernier</p>}
                      </div>
                      {s.winner && (
                        <>
                          <Image src={s.winner.crest} alt={s.winner.shortName} width={28} height={28} className="object-contain shrink-0" />
                          <span className={`text-sm font-semibold ${i === 0 ? 'text-yellow-700' : 'text-gray-800'}`}>
                            {s.winner.name}
                          </span>
                          {i === 0 && <span className="ml-auto text-lg">🏆</span>}
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
