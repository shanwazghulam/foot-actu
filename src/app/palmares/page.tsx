import Image from 'next/image'

export const revalidate = 86400

type Champion = { saison: string; club: string; crest: string }

const palmares: Record<string, { nom: string; emoji: string; color: string; champions: Champion[] }> = {
  'Ligue 1': {
    nom: 'Ligue 1', emoji: '🇫🇷', color: 'border-blue-400',
    champions: [
      { saison: '2024/25', club: 'Paris Saint-Germain', crest: 'https://crests.football-data.org/524.png' },
      { saison: '2023/24', club: 'Paris Saint-Germain', crest: 'https://crests.football-data.org/524.png' },
      { saison: '2022/23', club: 'Paris Saint-Germain', crest: 'https://crests.football-data.org/524.png' },
      { saison: '2021/22', club: 'Paris Saint-Germain', crest: 'https://crests.football-data.org/524.png' },
      { saison: '2020/21', club: 'LOSC Lille',          crest: 'https://crests.football-data.org/521.png' },
      { saison: '2019/20', club: 'Paris Saint-Germain', crest: 'https://crests.football-data.org/524.png' },
      { saison: '2018/19', club: 'Paris Saint-Germain', crest: 'https://crests.football-data.org/524.png' },
      { saison: '2017/18', club: 'Paris Saint-Germain', crest: 'https://crests.football-data.org/524.png' },
      { saison: '2016/17', club: 'AS Monaco',           crest: 'https://crests.football-data.org/548.png' },
      { saison: '2015/16', club: 'Paris Saint-Germain', crest: 'https://crests.football-data.org/524.png' },
    ],
  },
  'Premier League': {
    nom: 'Premier League', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: 'border-purple-400',
    champions: [
      { saison: '2024/25', club: 'Liverpool FC',        crest: 'https://crests.football-data.org/64.png' },
      { saison: '2023/24', club: 'Manchester City',     crest: 'https://crests.football-data.org/65.png' },
      { saison: '2022/23', club: 'Manchester City',     crest: 'https://crests.football-data.org/65.png' },
      { saison: '2021/22', club: 'Manchester City',     crest: 'https://crests.football-data.org/65.png' },
      { saison: '2020/21', club: 'Manchester City',     crest: 'https://crests.football-data.org/65.png' },
      { saison: '2019/20', club: 'Liverpool FC',        crest: 'https://crests.football-data.org/64.png' },
      { saison: '2018/19', club: 'Manchester City',     crest: 'https://crests.football-data.org/65.png' },
      { saison: '2017/18', club: 'Manchester City',     crest: 'https://crests.football-data.org/65.png' },
      { saison: '2016/17', club: 'Chelsea FC',          crest: 'https://crests.football-data.org/61.png' },
      { saison: '2015/16', club: 'Leicester City',      crest: 'https://crests.football-data.org/338.png' },
    ],
  },
  'LaLiga': {
    nom: 'LaLiga', emoji: '🇪🇸', color: 'border-red-400',
    champions: [
      { saison: '2024/25', club: 'FC Barcelona',        crest: 'https://crests.football-data.org/81.png' },
      { saison: '2023/24', club: 'Real Madrid CF',      crest: 'https://crests.football-data.org/86.png' },
      { saison: '2022/23', club: 'FC Barcelona',        crest: 'https://crests.football-data.org/81.png' },
      { saison: '2021/22', club: 'Real Madrid CF',      crest: 'https://crests.football-data.org/86.png' },
      { saison: '2020/21', club: 'Atlético Madrid',     crest: 'https://crests.football-data.org/78.png' },
      { saison: '2019/20', club: 'Real Madrid CF',      crest: 'https://crests.football-data.org/86.png' },
      { saison: '2018/19', club: 'FC Barcelona',        crest: 'https://crests.football-data.org/81.png' },
      { saison: '2017/18', club: 'FC Barcelona',        crest: 'https://crests.football-data.org/81.png' },
      { saison: '2016/17', club: 'Real Madrid CF',      crest: 'https://crests.football-data.org/86.png' },
      { saison: '2015/16', club: 'FC Barcelona',        crest: 'https://crests.football-data.org/81.png' },
    ],
  },
  'Serie A': {
    nom: 'Serie A', emoji: '🇮🇹', color: 'border-green-400',
    champions: [
      { saison: '2024/25', club: 'Inter Milan',         crest: 'https://crests.football-data.org/108.png' },
      { saison: '2023/24', club: 'Inter Milan',         crest: 'https://crests.football-data.org/108.png' },
      { saison: '2022/23', club: 'SSC Napoli',          crest: 'https://crests.football-data.org/113.png' },
      { saison: '2021/22', club: 'AC Milan',            crest: 'https://crests.football-data.org/98.png' },
      { saison: '2020/21', club: 'Inter Milan',         crest: 'https://crests.football-data.org/108.png' },
      { saison: '2019/20', club: 'Juventus FC',         crest: 'https://crests.football-data.org/109.png' },
      { saison: '2018/19', club: 'Juventus FC',         crest: 'https://crests.football-data.org/109.png' },
      { saison: '2017/18', club: 'Juventus FC',         crest: 'https://crests.football-data.org/109.png' },
      { saison: '2016/17', club: 'Juventus FC',         crest: 'https://crests.football-data.org/109.png' },
      { saison: '2015/16', club: 'Juventus FC',         crest: 'https://crests.football-data.org/109.png' },
    ],
  },
  'Bundesliga': {
    nom: 'Bundesliga', emoji: '🇩🇪', color: 'border-gray-400',
    champions: [
      { saison: '2024/25', club: 'Bayern Munich',       crest: 'https://crests.football-data.org/5.png' },
      { saison: '2023/24', club: 'Bayer Leverkusen',    crest: 'https://crests.football-data.org/3.png' },
      { saison: '2022/23', club: 'Bayern Munich',       crest: 'https://crests.football-data.org/5.png' },
      { saison: '2021/22', club: 'Bayern Munich',       crest: 'https://crests.football-data.org/5.png' },
      { saison: '2020/21', club: 'Bayern Munich',       crest: 'https://crests.football-data.org/5.png' },
      { saison: '2019/20', club: 'Bayern Munich',       crest: 'https://crests.football-data.org/5.png' },
      { saison: '2018/19', club: 'Bayern Munich',       crest: 'https://crests.football-data.org/5.png' },
      { saison: '2017/18', club: 'Bayern Munich',       crest: 'https://crests.football-data.org/5.png' },
      { saison: '2016/17', club: 'Bayern Munich',       crest: 'https://crests.football-data.org/5.png' },
      { saison: '2015/16', club: 'Bayern Munich',       crest: 'https://crests.football-data.org/5.png' },
    ],
  },
}

export default function PalmaresPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">🏆 Palmarès</h1>
        <p className="text-gray-500">Les 10 derniers champions des 5 grands championnats</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.values(palmares).map(({ nom, emoji, color, champions }) => (
          <div key={nom} className={`bg-white rounded-2xl border-2 ${color} overflow-hidden`}>
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <span className="text-xl">{emoji}</span>
              <h2 className="font-bold text-gray-800">{nom}</h2>
            </div>

            <div className="divide-y divide-gray-50">
              {champions.map((c, i) => (
                <div key={c.saison} className={`flex items-center gap-3 px-5 py-3 ${i === 0 ? 'bg-yellow-50' : 'hover:bg-gray-50'} transition`}>
                  <div className="w-16 shrink-0">
                    <span className={`text-xs font-bold ${i === 0 ? 'text-yellow-600' : 'text-gray-500'}`}>
                      {c.saison}
                    </span>
                    {i === 0 && <p className="text-xs text-yellow-500">★ Dernier</p>}
                  </div>
                  <Image
                    src={c.crest}
                    alt={c.club}
                    width={28}
                    height={28}
                    className="object-contain shrink-0"
                  />
                  <span className={`text-sm font-semibold ${i === 0 ? 'text-yellow-700' : 'text-gray-800'}`}>
                    {c.club}
                  </span>
                  {i === 0 && <span className="ml-auto text-lg">🏆</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
