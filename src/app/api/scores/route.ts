import { NextResponse } from 'next/server'

const COMPETITIONS = 'FL1,PL,PD,SA,BL1'
const HEADERS = { 'X-Auth-Token': process.env.FOOTBALL_API_TOKEN! }

export async function GET() {
  const today = new Date().toISOString().slice(0, 10)

  const res = await fetch(
    `https://api.football-data.org/v4/matches?dateFrom=${today}&dateTo=${today}&competitions=${COMPETITIONS}`,
    { headers: HEADERS, next: { revalidate: 0 } }
  )

  const data = await res.json()
  let matches = data.matches ?? []

  if (matches.length === 0) {
    const upcoming = await fetch(
      `https://api.football-data.org/v4/matches?status=SCHEDULED&competitions=${COMPETITIONS}`,
      { headers: HEADERS, next: { revalidate: 300 } }
    )
    const upData = await upcoming.json()
    matches = (upData.matches ?? []).slice(0, 10)
  }

  return NextResponse.json(matches, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
