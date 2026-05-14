import { defineField, defineType } from 'sanity'

export const quiz = defineType({
  name: 'quiz',
  title: 'Quiz',
  type: 'document',
  fields: [
    defineField({ name: 'titre', title: 'Titre', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'titre' }, validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
    defineField({ name: 'emoji', title: 'Emoji', type: 'string' }),
    defineField({
      name: 'difficulte',
      title: 'Difficulté',
      type: 'string',
      options: {
        list: [
          { title: '🟢 Facile', value: 'facile' },
          { title: '🟡 Moyen', value: 'moyen' },
          { title: '🔴 Difficile', value: 'difficile' },
        ],
      },
    }),
    defineField({
      name: 'questions',
      title: 'Questions',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'question',
          title: 'Question',
          fields: [
            defineField({ name: 'texte', title: 'Question', type: 'string', validation: (r) => r.required() }),
            defineField({
              name: 'options',
              title: 'Options (4 réponses)',
              type: 'array',
              of: [{ type: 'string' }],
              validation: (r) => r.min(2).max(4),
            }),
            defineField({
              name: 'bonneReponse',
              title: 'Index bonne réponse (0, 1, 2 ou 3)',
              type: 'number',
              validation: (r) => r.required().min(0).max(3),
            }),
            defineField({ name: 'explication', title: 'Explication (optionnel)', type: 'string' }),
          ],
          preview: { select: { title: 'texte' } },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'titre', subtitle: 'difficulte' },
  },
})
