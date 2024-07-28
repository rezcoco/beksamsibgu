"use server"

import { readFile } from "fs/promises";
import { revalidateTag } from "next/cache"
import path from "path";

export async function revalidateAction(tag: string) {
  revalidateTag(tag)
}

export async function serverGetVocabularies() {
  const readPath = path.join(process.cwd(), "data", "vocabularies.json");

  const vocabulariesJson = await readFile(readPath, {
    encoding: "utf-8",
  });

  const vocabularies: Record<string, any>[] = await JSON.parse(
    vocabulariesJson
  );

  return vocabularies
}