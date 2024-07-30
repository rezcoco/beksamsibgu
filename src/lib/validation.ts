import { z } from "zod"

export const addVocabularySchema = z.object({
  hangul: z.string().min(1, "Hangul tidak boleh kosong"),
  translation: z.string().min(1, "Arti tidak boleh kosong"),
  chapter: z.number().min(1).max(60).optional(),
  reference: z.string().optional(),
  sentenceEx: z.string().optional(),
  translationEx: z.string().optional(),
  note: z.string().optional()
})
export type AddVocabularySchemaType = z.infer<typeof addVocabularySchema>