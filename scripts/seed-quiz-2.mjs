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
    titre: 'Premier League : le quiz ultime',
    slug: { _type: 'slug', current: 'quiz-premier-league' },
    description: 'T\'y connais-tu vraiment en Premier League ? Prouve-le !',
    emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    difficulte: 'moyen',
    questions: [
      { _type: 'question', texte: 'Quel joueur détient le record de buts en une saison de Premier League ?', options: ['Mohamed Salah', 'Erling Haaland', 'Alan Shearer', 'Andrew Cole'], bonneReponse: 1, explication: 'Haaland a inscrit 36 buts en une seule saison 2022-2023, un record absolu.' },
      { _type: 'question', texte: 'Quel club a le plus de titres en Premier League ?', options: ['Manchester United', 'Manchester City', 'Liverpool', 'Chelsea'], bonneReponse: 0, explication: 'Man United domine avec 20 titres, devant Man City (10) et Liverpool (19 dont 1 en PL).' },
      { _type: 'question', texte: 'Qui a marqué le but le plus rapide de l\'histoire de la Premier League ?', options: ['Shane Long', 'Ledley King', 'Alan Shearer', 'Robbie Fowler'], bonneReponse: 0, explication: 'Shane Long a marqué après seulement 7,69 secondes avec Southampton en 2019.' },
      { _type: 'question', texte: 'Quel entraîneur a remporté le plus de titres de Premier League ?', options: ['Alex Ferguson', 'Pep Guardiola', 'Arsène Wenger', 'José Mourinho'], bonneReponse: 0, explication: 'Sir Alex Ferguson a remporté 13 titres de Premier League avec Manchester United.' },
      { _type: 'question', texte: 'Quel club a réalisé la saison "invincible" en Premier League ?', options: ['Arsenal', 'Manchester City', 'Chelsea', 'Liverpool'], bonneReponse: 0, explication: 'Arsenal d\'Arsène Wenger n\'a perdu aucun match en 2003-2004 (38 matchs).' },
      { _type: 'question', texte: 'Quel joueur a remporté le plus de fois le titre de meilleur buteur de Premier League ?', options: ['Alan Shearer', 'Thierry Henry', 'Sergio Agüero', 'Harry Kane'], bonneReponse: 0, explication: 'Alan Shearer a remporté le trophée de meilleur buteur 3 fois en Premier League.' },
      { _type: 'question', texte: 'En quelle année a été créée la Premier League ?', options: ['1992', '1988', '1985', '1995'], bonneReponse: 0, explication: 'La Premier League a été fondée en 1992, remplaçant la First Division.' },
      { _type: 'question', texte: 'Quel club a gagné la Premier League avec le plus grand écart de points ?', options: ['Manchester City', 'Chelsea', 'Manchester United', 'Liverpool'], bonneReponse: 0, explication: 'Man City a terminé avec 19 points d\'avance en 2017-2018, un record.' },
    ],
  },
  {
    _type: 'quiz',
    titre: 'LaLiga & El Clásico',
    slug: { _type: 'slug', current: 'quiz-laliga-clasico' },
    description: 'Real Madrid vs Barça, histoire et records du championnat espagnol.',
    emoji: '🇪🇸',
    difficulte: 'moyen',
    questions: [
      { _type: 'question', texte: 'Combien de fois le Real Madrid a-t-il remporté la Ligue des Champions ?', options: ['15', '13', '14', '12'], bonneReponse: 0, explication: 'Le Real Madrid est le club le plus titré en C1 avec 15 victoires.' },
      { _type: 'question', texte: 'Qui est le meilleur buteur de l\'histoire d\'El Clásico ?', options: ['Lionel Messi', 'Cristiano Ronaldo', 'Raul', 'Ronaldo Nazário'], bonneReponse: 0, explication: 'Messi détient le record de buts dans El Clásico avec 26 buts.' },
      { _type: 'question', texte: 'Quel club a remporté le plus de titres de LaLiga ?', options: ['Real Madrid', 'FC Barcelone', 'Atlético Madrid', 'Athletic Bilbao'], bonneReponse: 0, explication: 'Le Real Madrid est le club le plus titré en LaLiga avec 36 championnats.' },
      { _type: 'question', texte: 'Comment surnomme-t-on le stade du Real Madrid ?', options: ['La Forteresse Blanche', 'El Bernabéu', 'La Cathédrale', 'La Casa Blanca'], bonneReponse: 1, explication: 'Le stade du Real Madrid s\'appelle le Santiago Bernabéu, surnommé "El Bernabéu".' },
      { _type: 'question', texte: 'Quel joueur du Barça est surnommé "El Pistolero" ?', options: ['Luis Suárez', 'Neymar', 'Dani Alves', 'Xavi'], bonneReponse: 0, explication: 'Luis Suárez est surnommé "El Pistolero" en référence à sa célébration.' },
      { _type: 'question', texte: 'Quel score record a été atteint dans un Clásico ?', options: ['11-1', '8-2', '5-0', '7-3'], bonneReponse: 0, explication: 'Le Real Madrid a écrasé le Barça 11-1 en 1943, un record historique.' },
      { _type: 'question', texte: 'Vinicius Jr joue dans quelle position ?', options: ['Ailier gauche', 'Attaquant centre', 'Milieu offensif', 'Ailier droit'], bonneReponse: 0, explication: 'Vinicius Jr est ailier gauche au Real Madrid et en sélection brésilienne.' },
      { _type: 'question', texte: 'Quelle ville accueille à la fois le Real Madrid et l\'Atlético Madrid ?', options: ['Madrid', 'Barcelone', 'Séville', 'Valence'], bonneReponse: 0, explication: 'Madrid est la seule ville européenne à accueillir deux clubs finalistes de C1 réguliers.' },
    ],
  },
  {
    _type: 'quiz',
    titre: 'Histoire de la Coupe du Monde',
    slug: { _type: 'slug', current: 'quiz-coupe-du-monde' },
    description: 'Des origines à nos jours, teste tes connaissances sur la compétition reine du football.',
    emoji: '🌍',
    difficulte: 'difficile',
    questions: [
      { _type: 'question', texte: 'En quelle année a eu lieu la première Coupe du Monde ?', options: ['1930', '1926', '1934', '1938'], bonneReponse: 0, explication: 'La première Coupe du Monde a eu lieu en Uruguay en 1930, remportée par le pays hôte.' },
      { _type: 'question', texte: 'Quel pays accueillera la Coupe du Monde 2026 ?', options: ['USA/Canada/Mexique', 'Arabie Saoudite', 'Argentine', 'Chine'], bonneReponse: 0, explication: 'Le Mondial 2026 sera organisé conjointement par les États-Unis, le Canada et le Mexique.' },
      { _type: 'question', texte: 'Qui a remporté la Coupe du Monde 2022 au Qatar ?', options: ['Argentine', 'France', 'Brésil', 'Angleterre'], bonneReponse: 0, explication: 'L\'Argentine a battu la France en finale aux tirs au but après un match légendaire (3-3).' },
      { _type: 'question', texte: 'Quel joueur a remporté la Coupe du Monde le plus de fois ?', options: ['Pelé', 'Ronaldo', 'Zidane', 'Beckenbauer'], bonneReponse: 0, explication: 'Pelé est le seul joueur à avoir remporté 3 Coupes du Monde (1958, 1962, 1970).' },
      { _type: 'question', texte: 'Quel est le plus grand nombre de buts marqués dans un seul match de Coupe du Monde ?', options: ['12', '10', '9', '11'], bonneReponse: 0, explication: 'L\'Autriche a battu la Suisse 7-5 en 1954, soit 12 buts au total dans un match.' },
      { _type: 'question', texte: 'Quelle est la nation hôte qui n\'a jamais organisé la Coupe du Monde ?', options: ['Angleterre', 'Espagne', 'Italie', 'Brésil'], bonneReponse: 0, explication: 'Faux ! L\'Angleterre a organisé et remporté le Mondial 1966.' },
      { _type: 'question', texte: 'Combien de Coupes du Monde la France a-t-elle remportées ?', options: ['2', '1', '3', '0'], bonneReponse: 0, explication: 'La France a remporté 2 Coupes du Monde : 1998 (à domicile) et 2018 (en Russie).' },
      { _type: 'question', texte: 'Quel gardien a arrêté le plus de penalties en Coupe du Monde ?', options: ['Diogo Costa', 'Manuel Neuer', 'Iker Casillas', 'Gianluigi Buffon'], bonneReponse: 0, explication: 'Diogo Costa (Portugal) a arrêté 3 penalties lors d\'un même tir au but en 2022.' },
    ],
  },
  {
    _type: 'quiz',
    titre: 'Transferts records du foot mondial',
    slug: { _type: 'slug', current: 'quiz-transferts-records' },
    description: 'Millions, records et surprises... connais-tu vraiment le mercato ?',
    emoji: '💸',
    difficulte: 'moyen',
    questions: [
      { _type: 'question', texte: 'Quel est le transfert le plus cher de l\'histoire du football ?', options: ['Neymar au PSG (222M€)', 'Mbappé au Real (180M€)', 'Dembélé au Barça (135M€)', 'Griezmann à l\'Atlético (120M€)'], bonneReponse: 0, explication: 'Neymar reste le transfert le plus cher de l\'histoire avec 222M€ versés par le PSG au Barça en 2017.' },
      { _type: 'question', texte: 'Combien le PSG a-t-il payé pour recruter Neymar ?', options: ['222 millions €', '180 millions €', '200 millions €', '250 millions €'], bonneReponse: 0, explication: '222 millions d\'euros, un montant qui a choqué le monde du football en 2017.' },
      { _type: 'question', texte: 'Kylian Mbappé a rejoint le Real Madrid pour quel montant ?', options: ['Gratuit (fin de contrat)', '180 millions €', '200 millions €', '150 millions €'], bonneReponse: 0, explication: 'Mbappé a rejoint le Real Madrid gratuitement en 2024, son contrat au PSG étant terminé.' },
      { _type: 'question', texte: 'Quel club a dépensé le plus d\'argent en transferts dans l\'histoire ?', options: ['PSG', 'Chelsea', 'Manchester City', 'Real Madrid'], bonneReponse: 1, explication: 'Chelsea est le club ayant dépensé le plus en transferts au total dans l\'histoire du football.' },
      { _type: 'question', texte: 'Quel joueur a été vendu pour 80M€ par Monaco en 2017 ?', options: ['Kylian Mbappé', 'Thomas Lemar', 'Tiémoué Bakayoko', 'Bernardo Silva'], bonneReponse: 0, explication: 'Mbappé a été prêté puis acheté définitivement par le PSG pour 180M€ total.' },
      { _type: 'question', texte: 'Quel est le transfert le plus cher pour un gardien de but ?', options: ['Alisson au Liverpool (67M€)', 'Ederson à City (35M€)', 'Kepa à Chelsea (80M€)', 'Courtois au Real (35M€)'], bonneReponse: 2, explication: 'Kepa Arrizabalaga a été transféré à Chelsea pour 80M€ en 2018, record pour un gardien.' },
      { _type: 'question', texte: 'Combien a coûté Jude Bellingham au Real Madrid ?', options: ['103 millions €', '150 millions €', '80 millions €', '120 millions €'], bonneReponse: 0, explication: 'Bellingham a rejoint le Real Madrid pour environ 103M€ depuis Dortmund en 2023.' },
      { _type: 'question', texte: 'Quel défenseur détient le record de transfert à son poste ?', options: ['Harry Maguire (87M€)', 'Virgil van Dijk (85M€)', 'Kalidou Koulibaly (40M€)', 'Raphaël Varane (50M€)'], bonneReponse: 0, explication: 'Harry Maguire reste le défenseur le plus cher de l\'histoire avec 87M€ payés par Man United.' },
    ],
  },
  {
    _type: 'quiz',
    titre: 'Foot insolite et anecdotes',
    slug: { _type: 'slug', current: 'quiz-foot-insolite' },
    description: 'Les faits les plus fous, incroyables et insolites du football mondial !',
    emoji: '🤯',
    difficulte: 'difficile',
    questions: [
      { _type: 'question', texte: 'Quel joueur a marqué... dans son propre camp lors d\'un Mondial et contre son équipe ?', options: ['Andrés Escobar (Colombie 1994)', 'Djimi Traoré', 'Richard Dunne', 'Sami Hyypiä'], bonneReponse: 0, explication: 'Escobar a marqué contre son camp au Mondial 1994 et a été assassiné à son retour en Colombie.' },
      { _type: 'question', texte: 'Quel club professionnel a comme mascotte... un bourdon ?', options: ['Manchester City', 'Watford', 'Brentford', 'Norwich City'], bonneReponse: 0, explication: 'Manchester City a comme mascotte "Moonchester" mais la ville est associée aux abeilles/bourdons.' },
      { _type: 'question', texte: 'Quelle est la plus longue série d\'invincibilité en championnat ?', options: ['Steaua Bucarest (104 matchs)', 'Arsenal (49 matchs)', 'Celtic (69 matchs)', 'PSG (36 matchs)'], bonneReponse: 0, explication: 'Le Steaua Bucarest a établi un record de 104 matchs sans défaite en championnat roumain.' },
      { _type: 'question', texte: 'Quel arbitre a sifflé la fin d\'un match... 10 minutes trop tôt ?', options: ['Anders Frisk en 1999', 'Pierluigi Collina', 'Howard Webb', 'Mark Clattenburg'], bonneReponse: 0, explication: 'Anders Frisk a sifflé prématurément la fin d\'un match, un incident marquant de l\'histoire arbitrale.' },
      { _type: 'question', texte: 'Quel joueur a été expulsé le plus rapidement de l\'histoire (6 secondes) ?', options: ['Lee Todd', 'Vinnie Jones', 'David Batty', 'Roy Keane'], bonneReponse: 0, explication: 'Lee Todd a reçu un carton rouge 6 secondes après le coup d\'envoi pour insulte à l\'arbitre en 2000.' },
      { _type: 'question', texte: 'Combien de fois Zlatan Ibrahimovic a-t-il marqué de la tête malgré sa grande taille ?', options: ['Rarement, il préfère les retournés', 'Il n\'a jamais marqué de la tête', 'Régulièrement', 'Seulement 2 fois'], bonneReponse: 0, explication: 'Zlatan, malgré 1m95, est célèbre pour ses buts acrobatiques plutôt que de la tête.' },
      { _type: 'question', texte: 'Quel pays a inventé le football ?', options: ['Angleterre', 'Écosse', 'France', 'Italie'], bonneReponse: 0, explication: 'Les règles officielles du football ont été codifiées en Angleterre en 1863 par la Football Association.' },
      { _type: 'question', texte: 'Quel célèbre joueur a refusé une offre de 100M€ pour rester dans son club ?', options: ['Lionel Messi (Barça, 2017)', 'Francesco Totti (Roma)', 'Steven Gerrard (Liverpool)', 'Xavi (Barça)'], bonneReponse: 1, explication: 'Francesco Totti a refusé de nombreuses offres, notamment du Real Madrid, pour rester à la Roma toute sa carrière.' },
    ],
  },
  {
    _type: 'quiz',
    titre: 'Devine le joueur',
    slug: { _type: 'slug', current: 'quiz-devine-le-joueur' },
    description: '3 indices pour deviner le joueur. Seras-tu rapide ?',
    emoji: '🕵️',
    difficulte: 'moyen',
    questions: [
      { _type: 'question', texte: '🇧🇷 Brésilien · ⚽ Attaquant · 🏆 A joué au Barça, au PSG et à Santos', options: ['Neymar Jr', 'Ronaldo Nazário', 'Kaká', 'Rivaldo'], bonneReponse: 0, explication: 'Neymar a joué à Santos (2009-2013), au Barça (2013-2017) puis au PSG (2017-2023).' },
      { _type: 'question', texte: '🇵🇹 Portugais · 🥅 Gardien · 🏆 Vainqueur de l\'Euro 2016', options: ['Rui Patrício', 'José Sá', 'Diogo Costa', 'Eduardo'], bonneReponse: 0, explication: 'Rui Patrício était le gardien du Portugal lors de la victoire à l\'Euro 2016 en France.' },
      { _type: 'question', texte: '🇦🇷 Argentin · 🎯 Milieu · Surnommé "La Brujita"', options: ['Juan Román Riquelme', 'Pablo Aimar', 'Ariel Ortega', 'Javier Zanetti'], bonneReponse: 0, explication: 'Juan Román Riquelme, surnommé "La Brujita" (le sorcier), est une légende de Boca Juniors.' },
      { _type: 'question', texte: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Anglais · ⚡ Ailier · A joué à Chelsea, Man City et au Ballon d\'Or 2022', options: ['Phil Foden', 'Raheem Sterling', 'Bukayo Saka', 'Marcus Rashford'], bonneReponse: 0, explication: 'Phil Foden a remporté le Ballon d\'Or 2024 avec Man City. Attention au piège de l\'année !' },
      { _type: 'question', texte: '🇩🇪 Allemand · 🧤 Gardien · Célèbre pour son "sweeper-keeper"', options: ['Manuel Neuer', 'Oliver Kahn', 'Sepp Maier', 'Jens Lehmann'], bonneReponse: 0, explication: 'Manuel Neuer a révolutionné le poste de gardien avec son jeu de libéro-gardien.' },
      { _type: 'question', texte: '🇸🇳 Sénégalais · ⚽ Attaquant · Vainqueur de la Premier League et de la CAN 2022', options: ['Sadio Mané', 'Edouard Mendy', 'Kalidou Koulibaly', 'Idrissa Gueye'], bonneReponse: 0, explication: 'Sadio Mané a remporté la CAN 2022 avec le Sénégal et la PL avec Liverpool.' },
      { _type: 'question', texte: '🇳🇴 Norvégien · 💪 Avant-centre · Machine à buts en Premier League', options: ['Erling Haaland', 'Ole Gunnar Solskjær', 'Jan Åge Fjørtoft', 'John Carew'], bonneReponse: 0, explication: 'Erling Haaland, le "Cyborg" de Man City, bat record sur record en Premier League.' },
      { _type: 'question', texte: '🇫🇷 Français · 🎯 Milieu défensif · Surnommé "la pieuvre"', options: ['N\'Golo Kanté', 'Paul Pogba', 'Patrick Vieira', 'Lassana Diarra'], bonneReponse: 0, explication: 'N\'Golo Kanté est surnommé "la pieuvre" pour sa capacité à être partout sur le terrain.' },
    ],
  },
]

for (const q of quizzes) {
  const doc = await sanity.create(q)
  console.log(`✓ ${q.titre} (${doc._id})`)
}
console.log(`\n${quizzes.length} quiz créés !`)
