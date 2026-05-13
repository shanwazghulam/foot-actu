import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  const res = await fetch(
    'https://api.football-data.org/v4/matches?competitions=PL,FL1,PD,SA,BL1,CL,DED,PPL',
    {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_API_TOKEN! },
      next: { revalidate: 0 },
    }
  )

  if (!res.ok) {
    return NextResponse.json({ matches: [] }, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
