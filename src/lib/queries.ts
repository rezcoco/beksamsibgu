import { API_BASE_URL } from "@/constants";
import { axiosRequest } from "./axios";

export async function fetchData(path: string, tags: string[]) {
  const res = await fetch(API_BASE_URL + path, { next: { tags } })
  const json = await res.json()
  return json.data
}

export async function getVocabularies() {
  const res = await axiosRequest.get("/vocabulary")
  return res.data
}