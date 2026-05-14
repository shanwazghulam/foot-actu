import { createClient } from 'next-sanity'

const sanity = createClient({
  projectId: 'rht4oigp',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

const quiz = await sanity.fetch(`*[_type == "quiz" && slug.current == "quiz-ligue-1"][0]`)
if (!quiz) { console.log('Quiz non trouvé'); process.exit(1) }

console.log('Quiz trouvé:', quiz._id)

const newQuestions = [...quiz.questions]
const idx = newQuestions.findIndex(q => q.texte.includes('PSG a-t-il remport'))
if (idx === -1) { console.log('Question non trouvée'); process.exit(1) }

console.log('Question à corriger:', newQuestions[idx].texte)

newQuestions[idx] = {
  ...newQuestions[idx],
  options: ['14', '12', '10', '16'],
  bonneReponse: 0,
  explication: 'Le PSG a remporté 14 titres de Ligue 1 à ce jour.',
}

await sanity.patch(quiz._id).set({ questions: newQuestions }).commit()
console.log('✓ Corrigé : PSG = 14 titres de Ligue 1')
