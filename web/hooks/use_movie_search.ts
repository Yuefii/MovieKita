import { useState, useMemo } from "react";

export function useMovieSearch(movies: any) {
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const allMovies = useMemo(() => {
    return [
      ...(movies.nowPlaying?.results || []),
      ...(movies.popular?.results || []),
      ...(movies.topRated?.results || []),
      ...(movies.upcoming?.results || []),
    ];
  }, [movies]);

  const uniqueMovies = useMemo(() => {
    return Array.from(
      new Map(allMovies.map((m: any) => [m.id, m])).values()
    );
  }, [allMovies])

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setIsSearching(false)
      setSearchResults([])
      return;
    }

    setIsSearching(true)

    const results = uniqueMovies.filter((movie: any) =>
      movie.title?.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results)
  };

  return {
    isSearching,
    searchResults,
    handleSearch,
  };
}
