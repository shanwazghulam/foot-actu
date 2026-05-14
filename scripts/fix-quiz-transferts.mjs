import { createClient } from 'next-sanity'

const sanity = createClient({
  projectId: 'rht4oigp',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

// Fetch the quiz
const quiz = await sanity.fetch(`*[_type == "quiz" && slug.current == "quiz-transferts-records"][0]`)
if (!quiz) { console.log('Quiz non trouvé'); process.exit(1) }

console.log('Quiz trouvé:', quiz._id)
console.log('Questions actuelles:')
quiz.questions.forEach((q, i) => console.log(`  ${i}: ${q.texte}`))

// Replace question at index 4 (the wrong Mbappé/Monaco 80M€ question)
const newQuestions = [...quiz.questions]
newQuestions[4] = {
  _type: 'question',
  _key: quiz.questions[4]._key,
  texte: 'Pour quel montant Cristiano Ronaldo a-t-il été transféré à la Juventus en 2018 ?',
  options: ['117 millions €', '100 millions €', '80 millions €', '150 millions €'],
  bonneReponse: 0,
  explication: 'Le Real Madrid a vendu Cristiano Ronaldo à la Juventus pour 117M€ en juillet 2018.',
}

await sanity.patch(quiz._id).set({ questions: newQuestions }).commit()
console.log('\n✓ Question corrigée !')
