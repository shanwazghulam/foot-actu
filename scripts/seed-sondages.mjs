import { createClient } from 'next-sanity'

const sanity = createClient({
  projectId: 'rht4oigp',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

const sondages = [
  {
    _type: 'sondage',
    question: 'Qui sera le meilleur joueur du Mondial 2026 ?',
    slug: { _type: 'slug', current: 'meilleur-joueur-mondial-2026' },
    emoji: '🌍',
    actif: true,
    options: [
      { _type: 'object', texte: 'Kylian Mbappé', votes: 0 },
      { _type: 'object', texte: 'Erling Haaland', votes: 0 },
      { _type: 'object', texte: 'Vinicius Jr', votes: 0 },
      { _type: 'object', texte: 'Jude Bellingham', votes: 0 },
    ],
  },
  {
    _type: 'sondage',
    question: 'Quel club remportera la Ligue des Champions cette saison ?',
    slug: { _type: 'slug', current: 'vainqueur-ligue-des-champions' },
    emoji: '🏆',
    actif: true,
    options: [
      { _type: 'object', texte: 'Real Madrid', votes: 0 },
      { _type: 'object', texte: 'Manchester City', votes: 0 },
      { _type: 'object', texte: 'FC Barcelone', votes: 0 },
      { _type: 'object', texte: 'PSG', votes: 0 },
      { _type: 'object', texte: 'Arsenal', votes: 0 },
    ],
  },
  {
    _type: 'sondage',
    question: 'Quel est le meilleur championnat du monde ?',
    slug: { _type: 'slug', current: 'meilleur-championnat-monde' },
    emoji: '⚽',
    actif: true,
    options: [
      { _type: 'object', texte: 'Premier League 🏴󠁧󠁢󠁥󠁮󠁧󠁿', votes: 0 },
      { _type: 'object', texte: 'LaLiga 🇪🇸', votes: 0 },
      { _type: 'object', texte: 'Ligue 1 🇫🇷', votes: 0 },
      { _type: 'object', texte: 'Serie A 🇮🇹', votes: 0 },
      { _type: 'object', texte: 'Bundesliga 🇩🇪', votes: 0 },
    ],
  },
  {
    _type: 'sondage',
    question: 'Mbappé ou Vinicius Jr : qui est le meilleur joueur du monde actuellement ?',
    slug: { _type: 'slug', current: 'mbappe-vs-vinicius' },
    emoji: '🔥',
    actif: true,
    options: [
      { _type: 'object', texte: 'Kylian Mbappé', votes: 0 },
      { _type: 'object', texte: 'Vinicius Jr', votes: 0 },
    ],
  },
]

for (const s of sondages) {
  const doc = await sanity.create(s)
  console.log(`✓ Sondage créé : ${s.question} (${doc._id})`)
}

console.log('\nDone !')
