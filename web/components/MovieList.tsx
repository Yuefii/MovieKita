import MovieCard from "./MovieCard"

interface Props {
  title: string,
  movies: any[]
}

export default function MovieList({
  title,
  movies,
}: Props) {
  return (
    <section className="mb-8 px-4 md:px-12 mt-4">
      <h2 className="text-white text-md md:text-xl lg:text-2xl font-semibold mb-3 font-sans opacity-90 transition duration-200">
        {title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  )
}