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
    titre: 'Les Bleus : équipe de France',
    slug: { _type: 'slug', current: 'quiz-equipe-de-france' },
    description: 'Tu te crois incollable sur les Bleus ? Prouve-le !',
    emoji: '🇫🇷',
    difficulte: 'moyen',
    questions: [
      { _type: 'question', texte: 'En quelle année la France a-t-elle remporté sa première Coupe du Monde ?', options: ['1998', '2002', '1994', '1990'], bonneReponse: 0, explication: 'La France a remporté le Mondial 1998 à domicile, en battant le Brésil 3-0 en finale.' },
      { _type: 'question', texte: 'Qui a marqué un doublé en finale de la Coupe du Monde 2022 ?', options: ['Kylian Mbappé', 'Olivier Giroud', 'Antoine Griezmann', 'Karim Benzema'], bonneReponse: 0, explication: 'Mbappé a inscrit un doublé en fin de match pour égaliser à 2-2, puis un 3e but en prolongation. La France a perdu aux tirs au but.' },
      { _type: 'question', texte: 'Quel joueur français détient le record de buts en équipe de France ?', options: ['Olivier Giroud', 'Thierry Henry', 'Zinedine Zidane', 'Michel Platini'], bonneReponse: 0, explication: 'Olivier Giroud est le meilleur buteur de l\'histoire des Bleus avec 57 buts.' },
      { _type: 'question', texte: 'Combien de fois la France a-t-elle remporté l\'Euro ?', options: ['2', '1', '3', '0'], bonneReponse: 0, explication: 'La France a remporté l\'Euro 1984 (Platini) et l\'Euro 2000 (en Belgique/Pays-Bas).' },
      { _type: 'question', texte: 'Qui était le sélectionneur de la France lors du Mondial 1998 ?', options: ['Aimé Jacquet', 'Roger Lemerre', 'Didier Deschamps', 'Raymond Domenech'], bonneReponse: 0, explication: 'Aimé Jacquet a mené les Bleus au titre mondial en 1998 avant de passer la main à Roger Lemerre.' },
      { _type: 'question', texte: 'Quel numéro de maillot porte traditionnellement le gardien titulaire en équipe de France ?', options: ['1', '16', '23', '12'], bonneReponse: 0, explication: 'Le numéro 1 est le numéro traditionnel du gardien titulaire en équipe de France.' },
      { _type: 'question', texte: 'Zinedine Zidane a été expulsé lors de quelle finale de Coupe du Monde ?', options: ['2006', '2002', '1998', '2010'], bonneReponse: 0, explication: 'Zidane a reçu un carton rouge en finale du Mondial 2006 pour un coup de tête sur Materazzi.' },
      { _type: 'question', texte: 'Quel stade est le domicile de l\'équipe de France ?', options: ['Stade de France', 'Parc des Princes', 'Groupama Stadium', 'Vélodrome'], bonneReponse: 0, explication: 'Le Stade de France à Saint-Denis (93), avec 81 000 places, est le stade national des Bleus.' },
    ],
  },
  {
    _type: 'quiz',
    titre: 'Gardiens de légende',
    slug: { _type: 'slug', current: 'quiz-gardiens-legende' },
    description: 'Les meilleurs portiers de l\'histoire du football mondial.',
    emoji: '🧤',
    difficulte: 'difficile',
    questions: [
      { _type: 'question', texte: 'Quel gardien est surnommé "Il Grande" et a remporté 5 Coupes du Monde ?', options: ['Aucun, record impossible', 'Gianluigi Buffon', 'Lev Yachine', 'Peter Schmeichel'], bonneReponse: 1, explication: 'Gianluigi Buffon a joué 5 Coupes du Monde avec l\'Italie, un record pour un gardien européen.' },
      { _type: 'question', texte: 'Quel est le seul gardien à avoir remporté le Ballon d\'Or ?', options: ['Lev Yachine', 'Gianluigi Buffon', 'Manuel Neuer', 'Oliver Kahn'], bonneReponse: 0, explication: 'Lev Yachine, le légendaire gardien soviétique, est le seul gardien de l\'histoire à avoir remporté le Ballon d\'Or en 1963.' },
      { _type: 'question', texte: 'Quel gardien est surnommé "The Special One of goalkeeping" pour son jeu au pied ?', options: ['Manuel Neuer', 'Alisson Becker', 'Marc-André ter Stegen', 'Kepa'], bonneReponse: 0, explication: 'Manuel Neuer a révolutionné le poste avec son rôle de "sweeper-keeper", jouant loin de ses buts.' },
      { _type: 'question', texte: 'Quel gardien a réalisé le plus de clean sheets en Premier League ?', options: ['Petr Cech', 'David Seaman', 'Edwin van der Sar', 'Joe Hart'], bonneReponse: 0, explication: 'Petr Cech détient le record de clean sheets en Premier League avec 202 matchs sans encaisser.' },
      { _type: 'question', texte: 'Pour quel montant Kepa Arrizabalaga a-t-il été transféré à Chelsea, record pour un gardien ?', options: ['80 millions €', '67 millions €', '90 millions €', '55 millions €'], bonneReponse: 0, explication: 'Kepa a rejoint Chelsea depuis l\'Athletic Bilbao pour 80M€ en 2018, record mondial pour un gardien.' },
      { _type: 'question', texte: 'Quel gardien est célèbre pour son "coup du scorpion" ?', options: ['René Higuita', 'Jorge Campos', 'Rogério Ceni', 'José Luis Chilavert'], bonneReponse: 0, explication: 'René Higuita, le gardien colombien excentrique, a réalisé son célèbre arrêt "scorpion" contre l\'Angleterre en 1995.' },
      { _type: 'question', texte: 'Quel gardien a marqué le plus de buts dans sa carrière professionnelle ?', options: ['Rogério Ceni', 'José Luis Chilavert', 'Jorge Campos', 'René Higuita'], bonneReponse: 0, explication: 'Rogério Ceni (Brésil) a marqué 131 buts au cours de sa carrière, un record absolu pour un gardien.' },
      { _type: 'question', texte: 'Dans quel pays est né le style "sweeper-keeper" popularisé par Manuel Neuer ?', options: ['Allemagne', 'Pays-Bas', 'Italie', 'Espagne'], bonneReponse: 0, explication: 'Bien que Neuer soit allemand, le concept a des racines néerlandaises (avec des gardiens comme Van der Sar), mais Neuer l\'a popularisé mondialement.' },
    ],
  },
  {
    _type: 'quiz',
    titre: 'Stades mythiques du monde',
    slug: { _type: 'slug', current: 'quiz-stades-mythiques' },
    description: 'Des cathédrales du foot à travers le monde. Les connais-tu ?',
    emoji: '🏟️',
    difficulte: 'moyen',
    questions: [
      { _type: 'question', texte: 'Quel est le stade de football avec la plus grande capacité au monde ?', options: ['Rungrado 1er Mai (Corée du Nord)', 'Camp Nou (Barcelone)', 'Wembley (Londres)', 'Rose Bowl (Los Angeles)'], bonneReponse: 0, explication: 'Le stade Rungrado en Corée du Nord peut accueillir 114 000 spectateurs, le plus grand au monde.' },
      { _type: 'question', texte: 'Dans quelle ville se trouve le stade San Siro ?', options: ['Milan', 'Rome', 'Naples', 'Turin'], bonneReponse: 0, explication: 'Le San Siro (Giuseppe Meazza) est partagé par l\'AC Milan et l\'Inter Milan à Milan.' },
      { _type: 'question', texte: 'Quel stade accueille les finales de Champions League le plus souvent dans l\'histoire ?', options: ['Wembley', 'Santiago Bernabéu', 'Hampden Park', 'Stade de France'], bonneReponse: 0, explication: 'Wembley a accueilli le plus grand nombre de finales de Coupe d\'Europe/Ligue des Champions.' },
      { _type: 'question', texte: 'Combien de spectateurs peut accueillir le Stade de France ?', options: ['81 338', '75 000', '90 000', '68 000'], bonneReponse: 0, explication: 'Le Stade de France à Saint-Denis peut accueillir 81 338 spectateurs.' },
      { _type: 'question', texte: 'Quel club joue au Signal Iduna Park, célèbre pour son "Mur jaune" ?', options: ['Borussia Dortmund', 'Bayern Munich', 'Schalke 04', 'Bayer Leverkusen'], bonneReponse: 0, explication: 'Le Signal Iduna Park du BVB est célèbre pour sa tribune Südtribüne, surnommée le "Mur jaune", avec 25 000 places debout.' },
      { _type: 'question', texte: 'Le stade Maracanã est situé dans quelle ville ?', options: ['Rio de Janeiro', 'São Paulo', 'Brasilia', 'Buenos Aires'], bonneReponse: 0, explication: 'Le Maracanã est le stade mythique de Rio de Janeiro, qui a accueilli deux finales de Coupe du Monde (1950, 2014).' },
      { _type: 'question', texte: 'Quel est le surnom du stade de l\'Atlético Madrid inauguré en 2017 ?', options: ['Civitas Metropolitano', 'Wanda Metropolitano', 'Estadio Atlético', 'La Forteresse Rouge'], bonneReponse: 1, explication: 'Le stade de l\'Atlético Madrid s\'appelait Wanda Metropolitano lors de son inauguration en 2017, rebaptisé Civitas Metropolitano depuis.' },
      { _type: 'question', texte: 'Dans quelle ville se trouve le célèbre stade Azteca ?', options: ['Mexico City', 'Buenos Aires', 'Bogotá', 'Lima'], bonneReponse: 0, explication: 'Le stade Azteca à Mexico a accueilli deux finales de Coupe du Monde (1970 et 1986).' },
    ],
  },
  {
    _type: 'quiz',
    titre: 'Le foot africain',
    slug: { _type: 'slug', current: 'quiz-foot-africain' },
    description: 'CAN, joueurs et clubs du continent africain. Tu t\'y connais ?',
    emoji: '🌍',
    difficulte: 'difficile',
    questions: [
      { _type: 'question', texte: 'Quel pays a remporté le plus de Coupes d\'Afrique des Nations ?', options: ['Égypte', 'Ghana', 'Sénégal', 'Cameroun'], bonneReponse: 0, explication: 'L\'Égypte est le pays le plus titré de la CAN avec 7 victoires.' },
      { _type: 'question', texte: 'Qui est le meilleur buteur de l\'histoire de la CAN ?', options: ['Hossam Hassan', 'Samuel Eto\'o', 'Didier Drogba', 'Nwankwo Kanu'], bonneReponse: 0, explication: 'Hossam Hassan (Égypte) est le meilleur buteur de l\'histoire de la CAN avec 18 buts.' },
      { _type: 'question', texte: 'Samuel Eto\'o a remporté la Ligue des Champions avec quels clubs ?', options: ['Barça et Inter Milan', 'Real Madrid et Chelsea', 'Barça et Bayern', 'Inter et PSG'], bonneReponse: 0, explication: 'Eto\'o a remporté la C1 avec le Barça (2006, 2009) et l\'Inter Milan (2010), seul joueur à faire le triplé consécutif.' },
      { _type: 'question', texte: 'Quelle nation africaine a atteint les demi-finales de la Coupe du Monde pour la première fois en 2022 ?', options: ['Maroc', 'Sénégal', 'Ghana', 'Cameroun'], bonneReponse: 0, explication: 'Le Maroc a écrit l\'histoire en 2022 en devenant la première équipe africaine à atteindre les demi-finales d\'un Mondial.' },
      { _type: 'question', texte: 'Quel joueur africain a remporté le Ballon d\'Or ?', options: ['George Weah', 'Samuel Eto\'o', 'Didier Drogba', 'Michael Essien'], bonneReponse: 0, explication: 'George Weah (Libéria) a remporté le Ballon d\'Or 1995, seul joueur africain à ce jour.' },
      { _type: 'question', texte: 'Quel pays africain a participé à la première Coupe du Monde ?', options: ['Égypte', 'Afrique du Sud', 'Maroc', 'Nigeria'], bonneReponse: 0, explication: 'L\'Égypte a été le premier pays africain à participer à une Coupe du Monde, en 1934 en Italie.' },
      { _type: 'question', texte: 'Sadio Mané a quitté Liverpool pour quel club en 2022 ?', options: ['Bayern Munich', 'Al-Nassr', 'PSG', 'Barcelona'], bonneReponse: 0, explication: 'Sadio Mané a rejoint le Bayern Munich pour environ 32M€ en 2022 après 6 saisons à Liverpool.' },
      { _type: 'question', texte: 'La CAN 2021 (jouée en 2022) s\'est déroulée dans quel pays ?', options: ['Cameroun', 'Côte d\'Ivoire', 'Sénégal', 'Égypte'], bonneReponse: 0, explication: 'La CAN 2021 a été organisée au Cameroun et remportée par le Sénégal, sacré pour la première fois.' },
    ],
  },
  {
    _type: 'quiz',
    titre: 'Entraîneurs légendaires',
    slug: { _type: 'slug', current: 'quiz-entraineurs-legendaires' },
    description: 'Pep, Mourinho, Klopp... connais-tu les plus grands coachs de l\'histoire ?',
    emoji: '👔',
    difficulte: 'moyen',
    questions: [
      { _type: 'question', texte: 'Quel entraîneur a remporté la Ligue des Champions avec 3 clubs différents ?', options: ['Aucun, c\'est impossible', 'José Mourinho', 'Carlo Ancelotti', 'Pep Guardiola'], bonneReponse: 2, explication: 'Carlo Ancelotti a remporté la C1 avec l\'AC Milan (2003, 2007), le Real Madrid (2014, 2022) et... c\'est tout. En réalité, personne n\'a gagné avec 3 clubs différents.' },
      { _type: 'question', texte: 'Combien de fois Sir Alex Ferguson a-t-il remporté la Premier League ?', options: ['13', '10', '11', '15'], bonneReponse: 0, explication: 'Sir Alex Ferguson a remporté 13 titres de Premier League avec Manchester United entre 1993 et 2013.' },
      { _type: 'question', texte: 'Quel est le surnom de José Mourinho ?', options: ['The Special One', 'The Chosen One', 'The Only One', 'The Great One'], bonneReponse: 0, explication: 'Mourinho s\'est lui-même surnommé "The Special One" lors de sa première conférence de presse à Chelsea en 2004.' },
      { _type: 'question', texte: 'Pep Guardiola a remporté la Ligue des Champions avec combien de clubs différents ?', options: ['2', '1', '3', '4'], bonneReponse: 0, explication: 'Guardiola a remporté la C1 avec le Barça (2009, 2011) et Manchester City (2023).' },
      { _type: 'question', texte: 'Quel entraîneur a inventé le "pressing gegenpressing" popularisé à Dortmund ?', options: ['Jürgen Klopp', 'Ralf Rangnick', 'Thomas Tuchel', 'Hansi Flick'], bonneReponse: 0, explication: 'Jürgen Klopp a rendu célèbre le "gegenpressing" (contre-pressing immédiat) au Borussia Dortmund puis à Liverpool.' },
      { _type: 'question', texte: 'Arsène Wenger a entraîné Arsenal pendant combien d\'années ?', options: ['22', '17', '25', '19'], bonneReponse: 0, explication: 'Arsène Wenger a dirigé Arsenal de 1996 à 2018, soit 22 ans, une longévité exceptionnelle dans le foot moderne.' },
      { _type: 'question', texte: 'Quel entraîneur a mené l\'Atletico Madrid à son dernier titre de LaLiga ?', options: ['Diego Simeone', 'Quique Sánchez Flores', 'Mauricio Pochettino', 'Luis García'], bonneReponse: 0, explication: 'Diego Simeone a mené l\'Atlético à son dernier titre de LaLiga en 2020-2021.' },
      { _type: 'question', texte: 'Qui a remporté la Ligue des Champions comme joueur ET comme entraîneur ?', options: ['Zinedine Zidane', 'Pep Guardiola', 'Carlo Ancelotti', 'Didier Deschamps'], bonneReponse: 0, explication: 'Zidane a remporté la C1 comme joueur (2002) et comme entraîneur du Real Madrid (2016, 2017, 2018).' },
    ],
  },
  {
    _type: 'quiz',
    titre: 'Séries A & Serie A : l\'Italie du foot',
    slug: { _type: 'slug', current: 'quiz-serie-a-italie' },
    description: 'La Juventus, l\'Inter, le Milan... le calcio dans tous ses états !',
    emoji: '🇮🇹',
    difficulte: 'difficile',
    questions: [
      { _type: 'question', texte: 'Quel club a remporté le plus de titres de Serie A ?', options: ['Juventus', 'Inter Milan', 'AC Milan', 'AS Roma'], bonneReponse: 0, explication: 'La Juventus est le club le plus titré de Serie A avec 36 championnats.' },
      { _type: 'question', texte: 'Quel joueur est surnommé "Il Fenomeno" en Italie ?', options: ['Ronaldo Nazário', 'Roberto Baggio', 'Francesco Totti', 'Alessandro Del Piero'], bonneReponse: 0, explication: 'Ronaldo Nazário (le Brésilien) est surnommé "Il Fenomeno" pour ses performances légendaires à l\'Inter Milan et au Barça.' },
      { _type: 'question', texte: 'Combien de fois l\'Italie a-t-elle remporté la Coupe du Monde ?', options: ['4', '3', '5', '2'], bonneReponse: 0, explication: 'L\'Italie a remporté 4 Coupes du Monde : 1934, 1938, 1982 et 2006.' },
      { _type: 'question', texte: 'Quel club partage le stade San Siro avec l\'AC Milan ?', options: ['Inter Milan', 'AS Roma', 'Lazio', 'Napoli'], bonneReponse: 0, explication: 'Le San Siro (Giuseppe Meazza) est partagé par l\'AC Milan et l\'Inter Milan depuis des décennies.' },
      { _type: 'question', texte: 'Quel joueur a porté le numéro 10 de la Juventus après Del Piero ?', options: ['Paul Pogba', 'Carlos Tevez', 'Carlitos', 'Andrea Pirlo'], bonneReponse: 0, explication: 'Paul Pogba a porté le légendaire numéro 10 de la Juventus après le départ d\'Alessandro Del Piero.' },
      { _type: 'question', texte: 'Quel est le derby entre l\'AC Milan et l\'Inter ?', options: ['Derby della Madonnina', 'Derby d\'Italia', 'Derby del Sole', 'Derby Eternale'], bonneReponse: 0, explication: 'Le "Derby della Madonnina" est le derby milanais entre l\'AC Milan et l\'Inter, nommé d\'après la statue de la Vierge sur le Dôme de Milan.' },
      { _type: 'question', texte: 'Quel joueur a battu le record de buts en Serie A en une saison ?', options: ['Gonzalo Higuaín', 'Luca Toni', 'Zlatan Ibrahimović', 'Gabriel Batistuta'], bonneReponse: 0, explication: 'Gonzalo Higuaín a marqué 36 buts en Serie A en 2015-2016 avec Naples, un record absolu.' },
      { _type: 'question', texte: 'Francesco Totti a joué toute sa carrière dans quel club ?', options: ['AS Roma', 'Lazio', 'Inter Milan', 'Juventus'], bonneReponse: 0, explication: 'Totti est le symbole ultime de la fidélité : il a joué 25 ans à l\'AS Roma et refusé toutes les offres des grands clubs.' },
    ],
  },
]

for (const q of quizzes) {
  const doc = await sanity.create(q)
  console.log(`✓ ${q.emoji} ${q.titre} (${doc._id})`)
}
console.log(`\n${quizzes.length} quiz créés !`)
