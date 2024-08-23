import { z } from "zod"

export const insertVocabSchema = z.object({
  hangeul: z.string().min(1, "hangul tidak boleh kosong"),
  translation: z.string().min(1, "arti tidak boleh kosong"),
  isRegular: z.boolean().default(true),
  chapter: z.number().min(1).max(60).optional(),
  reference: z.string().optional(),
  sentenceEx: z.string().optional(),
  predicate: z.string().optional(),
  translationEx: z.string().optional(),
  note: z.string().optional()
})

export type InsertVocabType = z.infer<typeof insertVocabSchema>