import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import path from "path"
import { readFile } from "fs/promises";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
