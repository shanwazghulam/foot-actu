import { createClient } from 'next-sanity'

const sanity = createClient({
  projectId: 'rht4oigp',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

const quizzes = [
  {
    _type: 'quiz',
    titre: 'Légendes du football européen',
    slug: { _type: 'slug', current: 'legendes-football-europeen' },
    description: 'Teste tes connaissances sur les plus grandes légendes des 5 championnats européens.',
    emoji: '🏆',
    difficulte: 'moyen',
    questions: [
      {
        _type: 'question',
        texte: 'Combien de Ballons d\'Or Lionel Messi a-t-il remportés ?',
        options: ['7', '8', '6', '5'],
        bonneReponse: 1,
        explication: 'Messi a remporté 8 Ballons d\'Or, un record absolu.',
      },
      {
        _type: 'question',
        texte: 'Quel club Cristiano Ronaldo n\'a-t-il JAMAIS rejoint ?',
        options: ['PSG', 'Real Madrid', 'Manchester United', 'Juventus'],
        bonneReponse: 0,
        explication: 'Ronaldo a joué à Sporting, Man United, Real Madrid, Juventus et Al-Nassr, mais jamais au PSG.',
      },
      {
        _type: 'question',
        texte: 'Qui est le meilleur buteur de l\'histoire de la Ligue des Champions ?',
        options: ['Cristiano Ronaldo', 'Lionel Messi', 'Robert Lewandowski', 'Raul'],
        bonneReponse: 0,
        explication: 'Cristiano Ronaldo détient le record avec plus de 140 buts en Ligue des Champions.',
      },
      {
        _type: 'question',
        texte: 'Quel pays a remporté le plus de Coupes du Monde ?',
        options: ['Brésil', 'Allemagne', 'Italie', 'France'],
        bonneReponse: 0,
        explication: 'Le Brésil est le pays le plus titré avec 5 Coupes du Monde (1958, 1962, 1970, 1994, 2002).',
      },
      {
        _type: 'question',
        texte: 'Dans quel stade se joue la finale de la Ligue des Champions 2025 ?',
        options: ['Allianz Arena', 'Santiago Bernabéu', 'Wembley', 'San Siro'],
        bonneReponse: 0,
        explication: 'La finale de la Ligue des Champions 2025 se joue à l\'Allianz Arena de Munich.',
      },
      {
        _type: 'question',
        texte: 'Quel joueur a marqué le but "de la main de Dieu" en 1986 ?',
        options: ['Diego Maradona', 'Pelé', 'Zinedine Zidane', 'Ronaldo'],
        bonneReponse: 0,
        explication: 'Diego Maradona a marqué ce but controversé contre l\'Angleterre lors du Mondial 1986.',
      },
      {
        _type: 'question',
        texte: 'Quel club a remporté le plus de titres en Premier League ?',
        options: ['Manchester United', 'Manchester City', 'Liverpool', 'Arsenal'],
        bonneReponse: 0,
        explication: 'Manchester United est le club le plus titré en Premier League avec 20 titres.',
      },
      {
        _type: 'question',
        texte: 'Kylian Mbappé a rejoint quel club en 2024 ?',
        options: ['Real Madrid', 'Manchester City', 'Bayern Munich', 'Liverpool'],
        bonneReponse: 0,
        explication: 'Mbappé a rejoint le Real Madrid à l\'été 2024 en tant que joueur libre.',
      },
      {
        _type: 'question',
        texte: 'Combien d\'équipes participent à la phase de ligue de la Champions League depuis 2024 ?',
        options: ['36', '32', '24', '48'],
        bonneReponse: 0,
        explication: 'Le nouveau format de la Ligue des Champions compte 36 équipes en phase de ligue depuis 2024.',
      },
      {
        _type: 'question',
        texte: 'Quel gardien est surnommé "La Pulga" ?',
        options: ['Aucun, c\'est le surnom de Messi', 'Manuel Neuer', 'Gianluigi Buffon', 'Iker Casillas'],
        bonneReponse: 0,
        explication: '"La Pulga" (la Puce) est le surnom de Lionel Messi, pas d\'un gardien.',
      },
    ],
  },
  {
    _type: 'quiz',
    titre: 'La Ligue 1 dans tous ses états',
    slug: { _type: 'slug', current: 'quiz-ligue-1' },
    description: 'Tu te crois incollable sur le championnat de France ? Prouve-le !',
    emoji: '🇫🇷',
    difficulte: 'difficile',
    questions: [
      {
        _type: 'question',
        texte: 'Qui est le meilleur buteur de l\'histoire de la Ligue 1 ?',
        options: ['Delio Onnis', 'Zlatan Ibrahimovic', 'Hervé Revelli', 'Carlos Bianchi'],
        bonneReponse: 0,
        explication: 'Delio Onnis détient le record avec 299 buts en Ligue 1, loin devant Ibrahimovic.',
      },
      {
        _type: 'question',
        texte: 'Combien de fois le PSG a-t-il remporté la Ligue 1 ?',
        options: ['12', '10', '8', '15'],
        bonneReponse: 0,
        explication: 'Le PSG a remporté 12 titres de Ligue 1 à ce jour.',
      },
      {
        _type: 'question',
        texte: 'Quel club a remporté le plus de titres en Ligue 1 (hors PSG) ?',
        options: ['Marseille', 'Lyon', 'Saint-Étienne', 'Monaco'],
        bonneReponse: 2,
        explication: 'Saint-Étienne est le club le plus titré de l\'histoire de la Ligue 1 avec 10 titres.',
      },
      {
        _type: 'question',
        texte: 'Dans quel stade évolue l\'Olympique de Marseille ?',
        options: ['Vélodrome', 'Parc des Princes', 'Groupama Stadium', 'Stade de France'],
        bonneReponse: 0,
        explication: 'L\'OM joue au Stade Orange Vélodrome, qui peut accueillir 67 000 spectateurs.',
      },
      {
        _type: 'question',
        texte: 'Quel entraîneur a mené Lyon à 7 titres consécutifs de Ligue 1 ?',
        options: ['Gérard Houllier', 'Paul Le Guen', 'Alain Perrin', 'Claude Puel'],
        bonneReponse: 0,
        explication: 'Gérard Houllier a lancé la domination lyonnaise avant d\'être suivi par d\'autres entraîneurs.',
      },
    ],
  },
]

for (const q of quizzes) {
  const doc = await sanity.create(q)
  console.log(`✓ Quiz créé : ${q.titre} (${doc._id})`)
}

console.log('\nDone !')
