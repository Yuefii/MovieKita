import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import MovieMoment from "@/components/MovieMoment"
import { fetchTMDB } from "@/lib/tmdb"
import { Calendar, Camera, Clock, Star } from "lucide-react"
import { TMDB_IMG_URL, TMDB_ORIGINAL_IMG_URL } from "@/lib/env"

interface Props {
  params: { id: string }
}

export default async function Page({
  params,
}: Props) {
  const { id } = await params
  const movie = await fetchTMDB(`/movie/${id}`, {})

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Navbar />
      <div className="relative h-[70vh] w-full">
        <div className="absolute inset-0">
          <Image
            src={TMDB_ORIGINAL_IMG_URL + `${movie.backdrop_path || movie.poster_path}`}
            alt={movie.title}
            fill
            className="object-cover brightness-[40%]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col md:flex-row gap-8 items-end">
          <div className="relative w-40 h-60 md:w-64 md:h-96 flex-shrink-0 shadow-2xl rounded-lg overflow-hidden border border-white/10 hidden md:block">
            <Image
              src={TMDB_IMG_URL + `${movie.poster_path}`}
              alt={movie.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-4 max-w-4xl z-10">
            <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg font-sans">
              {movie.title}
            </h1>
            <div className="flex items-center gap-4 text-sm md:text-base text-gray-300">
              <div className="flex items-center gap-1 text-green-400 font-semibold">
                <Star className="w-4 h-4 fill-green-400" />
                {movie.vote_average.toFixed(1)} Match
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {movie.release_date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {movie.runtime} min
              </div>
            </div>
            <p className="text-gray-200 text-lg leading-relaxed max-w-2xl drop-shadow-md">
              {movie.overview}
            </p>
            <div className="pt-4">
              <Link
                href={`/upload?movieId=${movie.id}&movieTitle=${encodeURIComponent(movie.title)}`}
                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-md flex items-center gap-2 w-fit hover:bg-blue-600/50 transition"
              >
                <Camera className="w-5 h-5" />
                Upload Momen
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="px-8 pb-24 max-w-7xl mx-auto">
        <MovieMoment movieId={movie.id.toString()} />
      </div>
    </div>
  )
}