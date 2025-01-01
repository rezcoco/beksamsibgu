import { GetQueryUserType, GetQueryVocabType } from "@/types/type"
import { create } from "zustand"

type Store = {
  vocabularies: GetQueryVocabType[],
  setVocabularies: (vocabularies: GetQueryVocabType[]) => void,
}

export const useDataStore = create<Store>()((set) => ({
  vocabularies: [],
  setVocabularies: (vocabularies) => set(() => ({ vocabularies })),
}))