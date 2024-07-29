"use server"

import { VocabulariesType } from "@/types/type";
import { readFile, writeFile } from "fs/promises";
import { revalidateTag } from "next/cache"
import path from "path";

export async function revalidateAction(tag: string) {
  revalidateTag(tag)
}

export async function serverGetVocabularies(): Promise<VocabulariesType[]> {
  const readPath = path.join(process.cwd(), "data", "vocabularies.json");

  const vocabJson = await readFile(readPath, {
    encoding: "utf-8",
  });

  return JSON.parse(vocabJson);
}

export async function serverDeleteVocabulary(id: string) {
  const writePath = path.join(process.cwd(), "data", "vocabularies.json");
  const vocabularies: Record<string, any>[] = await serverGetVocabularies()
  const deleted = vocabularies.filter((vocab) => vocab.id !== id)

  await writeFile(writePath, JSON.stringify(deleted), { encoding: "utf-8" })

  return true
}