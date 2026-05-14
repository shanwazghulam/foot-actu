'use client'

import { useState } from 'react'
import Link from 'next/link'

type Question = {
  texte: string
  options: string[]
  bonneReponse: number
  explication?: string
}

type Quiz = {
  titre: string
  emoji: string
  difficulte: string
  questions: Question[]
}

const difficulteStyle: Record<string, string> = {
  facile: 'bg-green-100 text-green-700',
  moyen: 'bg-yellow-100 text-yellow-700',
  difficile: 'bg-red-100 text-red-700',
}

function ScoreEmoji(score: number, total: number) {
  const pct = score / total
  if (pct === 1) return '🏆'
  if (pct >= 0.8) return '🎉'
  if (pct >= 0.5) return '👍'
  return '📚'
}

export default function QuizPlayer({ quiz }: { quiz: Quiz }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [done, setDone] = useState(false)

  const question = quiz.questions[current]
  const total = quiz.questions.length
  const score = answers.filter((a, i) => a === quiz.questions[i].bonneReponse).length

  function pick(idx: number) {
    if (selected !== null) return
    setSelected(idx)
  }

  function next() {
    const newAnswers = [...answers, selected]
    setAnswers(newAnswers)
    if (current + 1 >= total) {
      setDone(true)
    } else {
      setCurrent(current + 1)
      setSelected(null)
    }
  }

  function restart() {
    setCurrent(0)
    setSelected(null)
    setAnswers([])
    setDone(false)
  }

  if (done) {
    const pct = Math.round((score / total) * 100)
    return (
      <div className="max-w-2xl mx-auto text-center">
        <Link href="/quiz" className="text-sm text-gray-500 hover:text-gray-800 transition mb-8 inline-block">
          ← Tous les quiz
        </Link>
        <div className="bg-white rounded-3xl border border-gray-200 p-10">
          <p className="text-7xl mb-4">{ScoreEmoji(score, total)}</p>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">{score} / {total}</h2>
          <p className="text-gray-500 mb-6">{pct}% de bonnes réponses</p>

          <div className="w-full bg-gray-100 rounded-full h-3 mb-8">
            <div
              className="h-3 rounded-full bg-green-500 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* Récap des réponses */}
          <div className="text-left space-y-3 mb-8">
            {quiz.questions.map((q, i) => {
              const correct = answers[i] === q.bonneReponse
              return (
                <div key={i} className={`rounded-xl p-4 ${correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className="text-sm font-semibold text-gray-800 mb-1">
                    {correct ? '✅' : '❌'} {q.texte}
                  </p>
                  {!correct && (
                    <p className="text-xs text-gray-600">
                      Bonne réponse : <strong>{q.options[q.bonneReponse]}</strong>
                    </p>
                  )}
                  {q.explication && (
                    <p className="text-xs text-gray-500 mt-1 italic">{q.explication}</p>
                  )}
                </div>
              )
            })}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={restart}
              className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-700 transition"
            >
              Rejouer
            </button>
            <Link
              href="/quiz"
              className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition"
            >
              Autres quiz
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/quiz" className="text-sm text-gray-500 hover:text-gray-800 transition mb-6 inline-block">
        ← Tous les quiz
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">
            {quiz.emoji || '🧠'} {quiz.titre}
          </h1>
          {quiz.difficulte && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficulteStyle[quiz.difficulte] ?? 'bg-gray-100 text-gray-600'}`}>
              {quiz.difficulte}
            </span>
          )}
        </div>
        <span className="text-sm font-bold text-gray-500">{current + 1} / {total}</span>
      </div>

      {/* Barre de progression */}
      <div className="w-full bg-gray-100 rounded-full h-2 mb-8">
        <div
          className="h-2 rounded-full bg-green-500 transition-all duration-500"
          style={{ width: `${((current) / total) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
        <p className="text-lg font-bold text-gray-900 leading-snug">{question.texte}</p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, idx) => {
          let style = 'bg-white border-gray-200 text-gray-800 hover:border-green-400 hover:bg-green-50'
          if (selected !== null) {
            if (idx === question.bonneReponse) style = 'bg-green-500 border-green-500 text-white'
            else if (idx === selected) style = 'bg-red-500 border-red-500 text-white'
            else style = 'bg-white border-gray-100 text-gray-400'
          }
          return (
            <button
              key={idx}
              onClick={() => pick(idx)}
              className={`w-full text-left px-5 py-4 rounded-xl border-2 font-medium transition-all ${style} ${selected !== null ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <span className="inline-block w-6 h-6 rounded-full border-2 border-current mr-3 text-xs text-center leading-5 font-bold">
                {String.fromCharCode(65 + idx)}
              </span>
              {option}
            </button>
          )
        })}
      </div>

      {/* Explication */}
      {selected !== null && question.explication && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 mb-4 text-sm text-blue-800">
          💡 {question.explication}
        </div>
      )}

      {/* Bouton suivant */}
      {selected !== null && (
        <button
          onClick={next}
          className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-700 transition text-base"
        >
          {current + 1 >= total ? 'Voir mes résultats →' : 'Question suivante →'}
        </button>
      )}
    </div>
  )
}
