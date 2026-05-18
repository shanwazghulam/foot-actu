import { NextResponse } from 'next/server'

const COMPETITIONS = ['FL1', 'PL', 'PD', 'SA', 'BL1', 'CL']
const HEADERS = { 'X-Auth-Token': process.env.FOOTBALL_API_TOKEN! }

export async function GET() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const date = `${y}-${m}-${d}`

  const results = await Promise.all(
    COMPETITIONS.map(async (code) => {
      const res = await fetch(
        `https://api.football-data.org/v4/competitions/${code}/matches?dateFrom=${date}&dateTo=${date}`,
        { headers: HEADERS, next: { revalidate: 30 } }
      )
      if (!res.ok) return []
      const data = await res.json()
      return data.matches ?? []
    })
  )

  const matches = results.flat().sort((a, b) => a.utcDate.localeCompare(b.utcDate))

  return NextResponse.json({ matches }, {
    headers: { 'Cache-Control': 'public, max-age=30' },
  })
}
