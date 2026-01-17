import axios from "axios"
import { API_KEY, BASE_URL } from "./env"

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "en_US",
  }
})

export async function fetchTMDB(
  endpoint: string,
  params: Record<string, string>
) {
  try {
    const res = await tmdb.get(
      endpoint,
      {params}
    )

    return res.data
  } catch (error) {
    console.error(`error fetch data tmdb ${endpoint}:`, error)
    return null
  }
}