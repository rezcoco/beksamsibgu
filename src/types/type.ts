export type GetQueryVocabType = {
  id: string
  hangeul: string
  translation: string
  chapter: number | null
  reference: string | null
  sentenceEx: string | null
  translationEx: string | null
  predicate: string | null
  isRegular: number
  isAdj: number
  romanization: string
  pronunciation: string
  note: string | null,
  authorId: string
  createdAt: string,
  updatedAt: string
  tag: {
    id: string
    name: string
  } | null;
}

export type GetQueryVocabByIdType = {
  id: string
  hangeul: string
  translation: string
  chapter: number | null
  reference: string | null
  sentenceEx: string | null
  translationEx: string | null
  predicate: string | null
  isRegular: number
  isAdj: number
  romanization: string
  pronunciation: string
  note: string | null
  audioUrl: string | null
  authorId: string
  createdAt: string
  updatedAt: string
  author: {
    firstName: string
    lastName: string
    username: string
  }
  tag: {
    id: string
    name: string
  } | null;
}

export type GetQueryConjugationType = Array<{
  type: string
  conjugations: Array<{
    id: string
    conjugated: string | undefined
    conjugation: boolean
    romanization: string | undefined
    pronunciation: string | undefined
    type: TConjugationTypeValue
    tense: TConjugationTenseValue | null
    speechLevel: TSpeechLevelValue | null
    createdAt: string,
    updatedAt: string
  }>
}>

export type GetQueryUserType = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  picture: string;
  reputation: number;
  createdAt: string;
  updatedAt: string;
  role: "user" | "admin" | "superuser";
  totalVocabulary: number;
  totalReport: number;
  totalEditSuggestions: number;
};

export type GetQueryReportType = {
  id: string;
  message: string;
  createdAt: string;
  reporterId: string;
  vocabularyId: string;
  status: "pending" | "resolved"
  reporter: {
    firstName: string;
    lastName: string;
    username: string;
  };
  vocabulary: {
    hangeul: string;
  };
}

export type GetQueryEditSuggestionsType = GetQueryVocabType & {
  vocabularyId: string
  status: "pending" | "rejected" | "approved"
  author: {
    firstName: string
    lastName: string
    username: string
  };
  originVocabulary: GetQueryVocabType
  vocabularyHistory: null | GetQueryVocabType & {
    vocabularyId: string
    editSuggestionId: string
  }
}

export type GetQueryStatisticsType = {
  totalVocabulary: number
  totalReport: number
  totalUser: number
}

export const CONJUGATION_TYPE = {
  declarative_present: "declarative present",
  declarative_past: "declarative past",
  declarative_future: "declarative future",
  interrogative_present: "interrogative present",
  interrogative_past: "interrogative past",
  connective: "connective",
  determiner: "determiner",
  imperative: "imperative",
  suppositive: "suppositive"
} as const;
export type TConjugationType = typeof CONJUGATION_TYPE;
export type TConjugationTypeValue = TConjugationType[keyof TConjugationType];

export const CONJUGATION_TENSE = {
  present: "present",
  past: "past",
  future: "future"
} as const;
export type TConjugationTense = typeof CONJUGATION_TENSE;
export type TConjugationTenseValue = TConjugationTense[keyof TConjugationTense];

export const SPEECH_LEVEL = {
  informal_low: "informal low",
  informal_high: "informal high",
  formal_low: "formal low",
  formal_high: "formal high"
} as const;
export type TSpeechLevel = typeof SPEECH_LEVEL;
export type TSpeechLevelValue = TSpeechLevel[keyof TSpeechLevel];
