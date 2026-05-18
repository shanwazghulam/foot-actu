import { NextResponse, NextRequest } from 'next/server'

const HEADERS = { 'X-Auth-Token': process.env.FOOTBALL_API_TOKEN! }

async function fetchComp(code: string, date: string) {
  const res = await fetch(
    `https://api.football-data.org/v4/competitions/${code}/matches?dateFrom=${date}&dateTo=${date}`,
    { headers: HEADERS, next: { revalidate: 3600 } }
  )
  if (!res.ok) return []
  const data = await res.json()
  return data.matches ?? []
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date') ?? new Date().toISOString().slice(0, 10)

  // On séquence par batches de 2 pour éviter le rate limit (10 req/min)
  const batch1 = await Promise.all([fetchComp('FL1', date), fetchComp('PL', date)])
  await new Promise(r => setTimeout(r, 1000))
  const batch2 = await Promise.all([fetchComp('PD', date), fetchComp('SA', date)])
  await new Promise(r => setTimeout(r, 1000))
  const batch3 = await fetchComp('BL1', date)

  const matches = [...batch1.flat(), ...batch2.flat(), ...(Array.isArray(batch3) ? batch3 : [])]
    .sort((a, b) => a.utcDate.localeCompare(b.utcDate))

  return NextResponse.json({ matches }, {
    headers: { 'Cache-Control': 'public, max-age=3600' },
  })
}
