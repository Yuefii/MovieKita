import Link from "next/link"
import Image from "next/image"
import { Info } from "lucide-react"
import { TMDB_ORIGINAL_IMG_URL } from "@/lib/env"

interface Props {
  movie: any
}

export function Billboard({
  movie
}: Props) {
  if (!movie) return null

  return (
    <div className="relative h-[56.25vw] min-h-[400px] w-full bg-zinc-900">
      <div className="absolute top-0 left-0 w-full h-full brightness-[60%]">
        <Image
          src={TMDB_ORIGINAL_IMG_URL + `${movie.backdrop_path}`}
          alt={movie.title || movie.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
      </div>
      <div className="absolute top-[30%] md:top-[40%] left-4 md:left-12 max-w-xl z-10 space-y-4">
        <h1 className="text-2xl md:text-5xl lg:text-6xl line-clamp-2 font-bold text-white drop-shadow-lg">
          {movie.title || movie.name}
        </h1>
        <p className="text-white text-sm md:text-lg drop-shadow-md line-clamp-3 max-w-lg">
          {movie.overview}
        </p>
        <div className="flex items-center gap-3 mt-4">
          <Link href={`/movie/${movie.id}`} className="flex items-center gap-2 bg-blue-600 text-white px-4 md:px-6 py-2 md:py-2.5 rounded hover:bg-blue-600/50 transition font-semibold">
            <Info className="w-5 h-5" />
            More Info
          </Link>
        </div>
      </div>
    </div>
  )
}