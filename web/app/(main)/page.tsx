"use client"

import Link from "next/link";

import Navbar from "@/components/Navbar";
import MovieList from "@/components/MovieList";
import MovieSlider from "@/components/MovieSlider";
import { Billboard } from "@/components/Billboard";
import { useMovies } from "@/hooks/use_movies";
import { useMovieSearch } from "@/hooks/use_movie_search";

export default function Page() {
  const {
    movies,
    billboardMovie,
    category,
    setCategory,
  } = useMovies()

  const {
    isSearching,
    searchResults,
    handleSearch,
  } = useMovieSearch(movies)

  return (
    <>
      <Navbar onSearch={handleSearch} />
      {isSearching ? (
        <main className="pt-24 px-4 pb-12 transition-all duration-300 min-h-screen">
          <MovieList title={`Search Results`} movies={searchResults} />
        </main>
      ) : (
        <div className="overflow-x-hidden">
          <Billboard movie={billboardMovie} />
          <div className="pb-40 -mt-24 md:-mt-48 relative z-20 pl-0 md:pl-0 space-y-4 md:space-y-8">
            {movies.nowPlaying && (
              <MovieSlider title="Now Playing" movies={movies.nowPlaying.results} />
            )}
            <div className="px-4 md:px-12 flex gap-4 my-6 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setCategory("popular")}
                className={`px-6 py-2 rounded cursor-pointer font-semibold text-sm transition-all duration-300 border ${category === "popular"
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-transparent border-gray-600 text-gray-300 hover:border-white hover:text-white"
                  }`}
              >
                Popular
              </button>
              <button
                onClick={() => setCategory("top_rated")}
                className={`px-6 py-2 rounded cursor-pointer font-semibold text-sm transition-all duration-300 border ${category === "top_rated"
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-transparent border-gray-600 text-gray-300 hover:border-white hover:text-white"
                  }`}
              >
                Top Rated
              </button>
              <button
                onClick={() => setCategory("upcoming")}
                className={`px-6 py-2 rounded cursor-pointer font-semibold text-sm transition-all duration-300 border ${category === "upcoming"
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-transparent border-gray-600 text-gray-300 hover:border-white hover:text-white"
                  }`}
              >
                Upcoming
              </button>
            </div>
            <div className="animate-in fade-in duration-500">
              {category === "popular" && movies.popular && (
                <MovieList title="Popular Movies" movies={movies.popular.results.slice(0, 12)} />
              )}
              {category === "top_rated" && movies.topRated && (
                <MovieList title="Top Rated Movies" movies={movies.topRated.results.slice(0, 12)} />
              )}
              {category === "upcoming" && movies.upcoming && (
                <MovieList title="Upcoming Movies" movies={movies.upcoming.results.slice(0, 12)} />
              )}
            </div>

            <div className="flex justify-center pb-8">
              <Link
                href={`/category/${category}`}
                className="px-8 py-3 rounded-md bg-blue-600/20 border border-blue-500/50 hover:bg-blue-600 hover:text-white text-blue-200 transition-all duration-300 font-semibold flex items-center gap-2"
              >
                Show More
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}