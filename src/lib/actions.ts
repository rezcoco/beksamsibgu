"use server"

import { db } from "@/drizzle/client"
import { vocabulariesTable } from "@/drizzle/schema"
import { sql } from "drizzle-orm"
import { revalidateTag } from "next/cache"

const pageSize = 20

export async function revalidateAction(tag: string) {
  revalidateTag(tag)
}

export async function selectVocabularies(params: {
  page?: number
}) {
  const { page = 1 } = params
  const offset = (page - 1) * pageSize

  try {
    const vocabs = db.select({
      record: vocabulariesTable,
      count: sql<number>`count(*) over()`
    })
      .from(vocabulariesTable)
      .offset(offset)
      .limit(pageSize)

    return vocabs
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message)
  }
}