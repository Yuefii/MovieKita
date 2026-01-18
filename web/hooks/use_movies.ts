import { useEffect, useState } from "react"
import { fetchTMDB } from "@/lib/tmdb"

interface MovieResult {
  results: any[]
  page: number
  total_pages: number
}

interface MoviesState {
  nowPlaying?: MovieResult
  popular?: MovieResult
  topRated?: MovieResult
  upcoming?: MovieResult
}

export function useMovies() {
  const [movies, setMovies] = useState<MoviesState>({})
  const [billboardMovie, setBillboardMovie] = useState<any>(null)
  const [category, setCategory] = useState("popular")
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

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

  async function loadMore() {
    if (loadingMore) return;

    let currentCategoryState: MovieResult | undefined;
    let endpoint = "";

    switch (category) {
      case "popular":
        currentCategoryState = movies.popular;
        endpoint = "/movie/popular";
        break;
      case "top_rated":
        currentCategoryState = movies.topRated;
        endpoint = "/movie/top_rated";
        break;
      case "upcoming":
        currentCategoryState = movies.upcoming;
        endpoint = "/movie/upcoming";
        break;
      default:
        return;
    }

    if (!currentCategoryState || currentCategoryState.page >= currentCategoryState.total_pages) {
      return;
    }

    setLoadingMore(true);
    
    const nextPage = currentCategoryState.page + 1;
    const data = await fetchTMDB(endpoint, { page: nextPage.toString() });

    if (data && data.results) {
      setMovies(prev => {
        const prevCategoryState = prev[category as keyof MoviesState];
        if (!prevCategoryState) return prev;

        return {
          ...prev,
          [category]: {
            ...data,
            results: [...prevCategoryState.results, ...data.results]
          }
        }
      });
    }

    setLoadingMore(false);
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
    loadMore,
    loadingMore,
  };
}