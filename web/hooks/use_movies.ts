import { useEffect, useState } from "react"
import { fetchTMDB } from "@/lib/tmdb"

interface MoviesState {
  nowPlaying?: any
  popular?: any
  topRated?: any
  upcoming?: any
}

export function useMovies() {
  const [movies, setMovies] = useState<MoviesState>({})
  const [billboardMovie, setBillboardMovie] = useState<any>(null)
  const [category, setCategory] = useState("popular")
  const [loading, setLoading] = useState(true);

  async function loadMovies() {
    setLoading(true)

    const [nowPlaying, popular, topRated, upcoming] = await Promise.all([
      fetchTMDB("/movie/now_playing", {}),
      fetchTMDB("/movie/popular", {}),
      fetchTMDB("/movie/top_rated", {}),
      fetchTMDB("/movie/upcoming", {}),
    ]);

    setMovies({ nowPlaying, popular, topRated, upcoming })

    if (popular?.results?.length) {
      const randomIndex = Math.floor(Math.random() * popular.results.length)
      setBillboardMovie(popular.results[randomIndex])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadMovies()
  }, [])

  return {
    movies,
    billboardMovie,
    category,
    setCategory,
    loading,
  };
}