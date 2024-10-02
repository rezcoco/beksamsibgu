import { isHangeul } from "hangeul-js"
import { z } from "zod"

export const mutationVocabSchema = z.object({
  hangeul: z.string().min(1, "hangeul tidak boleh kosong").refine(value => isHangeul(value), "masukan input hangeul"),
  translation: z.string().min(1, "arti tidak boleh kosong"),
  isRegular: z.boolean().default(true),
  isAdj: z.boolean().default(false),
  chapter: z.number().min(1).max(60).optional(),
  reference: z.string().optional(),
  sentenceEx: z.string().optional().refine((value) => {
    if (value) {
      return isHangeul(value)
    }

    return true
  }, "masukan input hangeul"),
  predicate: z.string().optional().refine((value) => {
    if (value) {
      return isHangeul(value)
    }

    return true
  }, "masukan input hangeul"),
  translationEx: z.string().optional(),
  note: z.string().optional(),
  tag: z.string().optional()
})

export const reportSchema = z.object({
  message: z.string().min(1, "Pesan tidak boleh kosong")
})

export type ReportSchemaType = z.infer<typeof reportSchema>
export type MutationVocabType = z.infer<typeof mutationVocabSchema>