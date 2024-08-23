import { API_BASE_URL } from "@/constants";

export async function fetchData(path: string, tags: string[]) {
  try {
    const res = await fetch(API_BASE_URL + path, {
      next: { tags },
      headers: {
        "Accept": "application/json"
      }
    })
    const json = await res.json()
    return json.data
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function fetchVocabById(id: string, tags: string[]) {
  try {
    const res = await fetch(API_BASE_URL + `/vocabularies/${id}`, {
      next: { tags }, headers: {
        "Accept": "application/json"
      }
    })
    const json = await res.json()

    return json.data
  } catch (error) {
    console.error(error)
    return []
  }
}