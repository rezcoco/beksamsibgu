import { API_BASE_URL } from "@/constants";
import axios from "axios";

export async function fetchData(path: string, tags?: string[]) {
  try {
    const res = await fetch(API_BASE_URL + path, {
      next: { tags },
      headers: {
        "Accept": "application/json"
      }
    })

    if (!res.ok) {
      throw new Error(res.statusText, { cause: res })
    }

    const json = await res.json()
    return json.data
  } catch (error: any) {
    console.error(error)
    throw new Error(error?.message, { cause: error })
  }
}

export const axiosRequest = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  }
})