import { client } from '@/sanity/client'
import { quizBySlugQuery } from '@/sanity/queries'
import { notFound } from 'next/navigation'
import QuizPlayer from './QuizPlayer'

export const revalidate = 60

export default async function QuizDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const quiz = await client.fetch(quizBySlugQuery, { slug })
  if (!quiz || !quiz.questions?.length) notFound()
  return <QuizPlayer quiz={quiz} />
}
