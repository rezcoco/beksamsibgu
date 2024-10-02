export const PRODUCTION_HOSTNAME_URL = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!
export const API_UTILS_URL = process.env.NEXT_PUBLIC_API_UTILS_URL!

export const allowedRoles = ["admin", "superuser"]

export const editSuggestionsStatusFilter = [
  {
    status: "pending",
    value: 0
  },
  {
    status: "rejected",
    value: 1
  },
  {
    status: "approved",
    value: 2
  }
] as const

export const editSuggestionsCreatedByFilter = [
  {
    createdBy: "saya",
    value: 0
  }, {
    createdBy: "orang lain",
    value: 1
  }
]

export const ACHIEVEMENTS: {
  value: string
  points: number
  name: string
  description: string
}[] = [
    {
      value: "wordsmith",
      points: 100,
      name: "Wordsmith",
      description: "Master of vocabulary.",
    },
    {
      value: "editor_extraordinaire",
      points: 200,
      name: "Editor Extraordinaire",
      description: "Perfecting every word.",
    },
    {
      value: "linguistic_guardian",
      points: 300,
      name: "Linguistic Guardian",
      description: "Reporting with precision.",
    },
    {
      value: "language_nerd",
      points: 500,
      name: "Languange Nerd",
      description: "Maniac vocabularies.",
    },
    {
      value: "grammar_guru",
      points: 700,
      name: "Grammar Guru",
      description: "A true language expert.",
    },
    {
      value: "lexicon_legend",
      points: 1000,
      name: "Lexicon Legend",
      description: "A Legendary contributor",
    },
    {
      value: "vocabulary_virtuoso",
      points: 1500,
      name: "Vocabulary Virtuoso",
      description: "A virtuoso of words.",
    },
    {
      value: "the_creator",
      points: 2000,
      name: "The Creator",
      description: "Top level contributor",
    }
  ]
export const ACHIEVEMENTS_ICONS: Record<number, Record<"icon", string>> = {
  100: {
    icon: " 🖋️ "
  },
  200: {
    icon: "✏️"
  },
  300: {
    icon: " 🛡️"
  },
  500: {
    icon: " 🤓"
  },
  700: {
    icon: " 📚 "
  },
  1000: {
    icon: " 🏆 "
  },
  1500: {
    icon: " 🎼 "
  },
  2000: {
    icon: " 🏛️ "
  }
}