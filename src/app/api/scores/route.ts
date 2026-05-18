import { NextResponse } from 'next/server'

const COMPETITIONS = ['FL1', 'PL', 'PD', 'SA', 'BL1']
const HEADERS = { 'X-Auth-Token': process.env.FOOTBALL_API_TOKEN! }

export async function GET() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const today = `${y}-${m}-${d}`

  const results = await Promise.all(
    COMPETITIONS.map(async (code) => {
      const res = await fetch(
        `https://api.football-data.org/v4/competitions/${code}/matches?dateFrom=${today}&dateTo=${today}`,
        { headers: HEADERS, cache: 'no-store' }
      )
      if (!res.ok) return []
      const data = await res.json()
      return data.matches ?? []
    })
  )

  let matches = results.flat().sort((a, b) => a.utcDate.localeCompare(b.utcDate))

  // Si aucun match aujourd'hui, on cherche les prochains matchs programmés
  if (matches.length === 0) {
    const upcoming = await Promise.all(
      COMPETITIONS.map(async (code) => {
        const res = await fetch(
          `https://api.football-data.org/v4/competitions/${code}/matches?status=SCHEDULED`,
          { headers: HEADERS, next: { revalidate: 3600 } }
        )
        if (!res.ok) return []
        const data = await res.json()
        return (data.matches ?? []).filter((m: { utcDate: string }) => new Date(m.utcDate) > now)
      })
    )
    matches = upcoming.flat()
      .sort((a, b) => a.utcDate.localeCompare(b.utcDate))
      .slice(0, 10)
  }

  return NextResponse.json(matches, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
