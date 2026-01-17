import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { TMDB_IMG_URL } from "@/lib/env"

interface Props {
  movie: any
}

export default function MovieCard({
  movie
}: Props) {
  return (
    <Link href={`/movie/${movie.id}`} className="block group relative">
      <div className="transition-transform duration-300 group-hover:scale-105 relative rounded-md overflow-hidden bg-zinc-800">
        <div className="aspect-[2/3] relative w-full">
          <Image
            src={`${TMDB_IMG_URL}${movie.poster_path}`}
            alt={movie.title || movie.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <h3 className="text-white text-sm font-bold truncate mb-1">{movie.title || movie.name}</h3>
          <div className="flex items-center justify-between text-xs text-gray-300">
            <div className="flex items-center gap-1 text-green-400 font-semibold">
              <Star className="w-3 h-3 fill-green-400" />
              {movie.vote_average?.toFixed(1)}
            </div>
            <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}