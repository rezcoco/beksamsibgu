import { RankingInfo } from "@tanstack/match-sorter-utils"
import { FilterFn } from "@tanstack/react-table"

declare module '@tanstack/react-table' {
  //add fuzzy filter to the filterFns
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

export type GetQueryResponseType = {
  id: string
  hangeul: string
  translation: string
  chapter: number | null
  reference: string | null
  sentenceEx: string | null
  translationEx: string | null
  predicate: string | null
  isRegular: number
  romanization: string
  pronunciation: string
  note: string | null,
  audioUrl: string | null
  authorId: string
  createdAt: string,
  updatedAt: string
}

export type GetQueryResponseByIdType = {
  id: string
  hangeul: string
  translation: string
  chapter: number | null
  reference: string | null
  sentenceEx: string | null
  translationEx: string | null
  predicate: string | null
  isRegular: number
  romanization: string
  pronunciation: string
  note: string | null
  audioUrl: string | null
  authorId: string
  createdAt: string
  updatedAt: string
  conjugationTypes: Array<{
    id: string
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
  author: {
    name: string
    username: string
  }
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
