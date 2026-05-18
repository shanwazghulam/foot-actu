export type TropheeEquipe = {
  competition: string
  emoji: string
  titres: number
  annees?: string
}

export type PalmaresEquipe = {
  fdoId: number
  trophees: TropheeEquipe[]
}

export const palmaresEquipes: Record<number, TropheeEquipe[]> = {
  // === LIGUE 1 ===
  524: [ // PSG
    { competition: 'Ligue 1', emoji: '🇫🇷', titres: 14 },
    { competition: 'Coupe de France', emoji: '🏆', titres: 15 },
    { competition: 'Coupe de la Ligue', emoji: '🥇', titres: 9 },
    { competition: 'Ligue des Champions', emoji: '⭐', titres: 1, annees: '2025' },
  ],
  521: [ // Lille
    { competition: 'Ligue 1', emoji: '🇫🇷', titres: 4, annees: '1946, 1954, 2011, 2021' },
    { competition: 'Coupe de France', emoji: '🏆', titres: 6 },
  ],
  548: [ // Monaco
    { competition: 'Ligue 1', emoji: '🇫🇷', titres: 8, annees: 'dont 2017' },
    { competition: 'Coupe de France', emoji: '🏆', titres: 5 },
    { competition: 'Ligue des Champions', emoji: '⭐', titres: 0, annees: 'Finaliste 2004' },
  ],
  516: [ // Marseille
    { competition: 'Ligue 1', emoji: '🇫🇷', titres: 9 },
    { competition: 'Coupe de France', emoji: '🏆', titres: 10 },
    { competition: 'Ligue des Champions', emoji: '⭐', titres: 1, annees: '1993' },
  ],
  523: [ // Lyon
    { competition: 'Ligue 1', emoji: '🇫🇷', titres: 7, annees: '2002-2008 consécutifs' },
    { competition: 'Coupe de France', emoji: '🏆', titres: 5 },
  ],

  // === PREMIER LEAGUE ===
  64: [ // Liverpool
    { competition: 'Premier League', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', titres: 19 },
    { competition: 'FA Cup', emoji: '🏆', titres: 8 },
    { competition: 'Ligue des Champions', emoji: '⭐', titres: 6, annees: '1977, 1978, 1981, 1984, 2005, 2019' },
    { competition: 'UEFA Cup', emoji: '🥇', titres: 3 },
  ],
  65: [ // Manchester City
    { competition: 'Premier League', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', titres: 10 },
    { competition: 'FA Cup', emoji: '🏆', titres: 7 },
    { competition: 'Ligue des Champions', emoji: '⭐', titres: 1, annees: '2023' },
    { competition: 'League Cup', emoji: '🥇', titres: 8 },
  ],
  66: [ // Manchester United
    { competition: 'Premier League', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', titres: 20 },
    { competition: 'FA Cup', emoji: '🏆', titres: 12 },
    { competition: 'Ligue des Champions', emoji: '⭐', titres: 3, annees: '1968, 1999, 2008' },
    { competition: 'League Cup', emoji: '🥇', titres: 6 },
  ],
  61: [ // Chelsea
    { competition: 'Premier League', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', titres: 6 },
    { competition: 'FA Cup', emoji: '🏆', titres: 8 },
    { competition: 'Ligue des Champions', emoji: '⭐', titres: 2, annees: '2012, 2021' },
    { competition: 'Europa League', emoji: '🥈', titres: 2 },
  ],
  57: [ // Arsenal
    { competition: 'Premier League', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', titres: 13 },
    { competition: 'FA Cup', emoji: '🏆', titres: 14 },
  ],

  // === LALIGA ===
  86: [ // Real Madrid
    { competition: 'LaLiga', emoji: '🇪🇸', titres: 36 },
    { competition: 'Copa del Rey', emoji: '🏆', titres: 20 },
    { competition: 'Ligue des Champions', emoji: '⭐', titres: 15, annees: 'Record absolu' },
    { competition: 'UEFA Super Cup', emoji: '🥇', titres: 5 },
  ],
  81: [ // FC Barcelona
    { competition: 'LaLiga', emoji: '🇪🇸', titres: 27 },
    { competition: 'Copa del Rey', emoji: '🏆', titres: 31 },
    { competition: 'Ligue des Champions', emoji: '⭐', titres: 5, annees: '1992, 2006, 2009, 2011, 2015' },
  ],
  78: [ // Atlético Madrid
    { competition: 'LaLiga', emoji: '🇪🇸', titres: 11, annees: 'dont 2021' },
    { competition: 'Copa del Rey', emoji: '🏆', titres: 10 },
    { competition: 'Europa League', emoji: '🥈', titres: 3, annees: '2010, 2012, 2018' },
    { competition: 'Ligue des Champions', emoji: '⭐', titres: 0, annees: 'Finaliste 2014, 2016' },
  ],

  // === SERIE A ===
  108: [ // Inter Milan
    { competition: 'Serie A', emoji: '🇮🇹', titres: 20 },
    { competition: 'Coppa Italia', emoji: '🏆', titres: 9 },
    { competition: 'Ligue des Champions', emoji: '⭐', titres: 3, annees: '1964, 1965, 2010' },
    { competition: 'UEFA Cup', emoji: '🥇', titres: 3 },
  ],
  109: [ // Juventus
    { competition: 'Serie A', emoji: '🇮🇹', titres: 36 },
    { competition: 'Coppa Italia', emoji: '🏆', titres: 15 },
    { competition: 'Ligue des Champions', emoji: '⭐', titres: 2, annees: '1985, 1996' },
  ],
  98: [ // AC Milan
    { competition: 'Serie A', emoji: '🇮🇹', titres: 19 },
    { competition: 'Coppa Italia', emoji: '🏆', titres: 5 },
    { competition: 'Ligue des Champions', emoji: '⭐', titres: 7, annees: '1963, 1969, 1989, 1990, 1994, 2003, 2007' },
  ],
  113: [ // Napoli
    { competition: 'Serie A', emoji: '🇮🇹', titres: 3, annees: '1987, 1990, 2023' },
    { competition: 'Coppa Italia', emoji: '🏆', titres: 6 },
    { competition: 'UEFA Cup', emoji: '🥇', titres: 1, annees: '1989' },
  ],
  100: [ // Roma
    { competition: 'Serie A', emoji: '🇮🇹', titres: 3, annees: '1942, 1983, 2001' },
    { competition: 'Coppa Italia', emoji: '🏆', titres: 9 },
    { competition: 'UEFA Fairs Cup', emoji: '🥇', titres: 1, annees: '1961' },
  ],

  // === BUNDESLIGA ===
  5: [ // Bayern Munich
    { competition: 'Bundesliga', emoji: '🇩🇪', titres: 33 },
    { competition: 'DFB-Pokal', emoji: '🏆', titres: 20 },
    { competition: 'Ligue des Champions', emoji: '⭐', titres: 6, annees: '1974, 1975, 1976, 2001, 2013, 2020' },
  ],
  4: [ // Borussia Dortmund
    { competition: 'Bundesliga', emoji: '🇩🇪', titres: 8 },
    { competition: 'DFB-Pokal', emoji: '🏆', titres: 5 },
    { competition: 'Ligue des Champions', emoji: '⭐', titres: 1, annees: '1997' },
  ],
  3: [ // Bayer Leverkusen
    { competition: 'Bundesliga', emoji: '🇩🇪', titres: 1, annees: '2024 — invaincu' },
    { competition: 'DFB-Pokal', emoji: '🏆', titres: 1, annees: '2024' },
  ],
}
