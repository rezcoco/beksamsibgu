import { API_BASE_URL } from "@/constants";

export async function fetchData(path: string, tags: string[]) {
  try {
    const res = await fetch(API_BASE_URL + path, { next: { tags } })
    const json = await res.json()
    return json.data
  } catch (error) {
    throw new Error(error as any)
  }
}

export async function fetchVocabById(id: string) {
  try {
    const res = await fetch(API_BASE_URL + `/vocabularies/${id}`)
    const json = await res.json()

    return json.data
  } catch (error) {
    throw new Error(error as any)
  }
}