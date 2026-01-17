import 'swiper/css';
import 'swiper/css/navigation';
import MovieCard from './MovieCard';
import { Navigation, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  title: string,
  movies: any[],
}
export default function MovieSlider({
  title,
  movies,
}: Props) {
  const sliderID = title.replace(/\s+/g, '-').replace(/[^\w-]/g, '').toLowerCase()

  return (
    <div className="px-4 md:px-12 mt-4 space-y-2 mb-8 group/slider">
      <h2 className="text-white text-md md:text-xl lg:text-2xl font-semibold mb-3 font-sans opacity-90 hover:opacity-100 transition duration-200 cursor-pointer">
        {title}
      </h2>
      <div className="relative group">
        <Swiper
          modules={[Navigation, A11y]}
          spaceBetween={8}
          slidesPerView={3}
          navigation={{
            nextEl: `.swiper-button-next-${sliderID}`,
            prevEl: `.swiper-button-prev-${sliderID}`,
            disabledClass: 'opacity-0 cursor-auto pointer-events-none'
          }}
          loop={false}
          breakpoints={{
            320: { slidesPerView: 2.3, spaceBetween: 8 },
            640: { slidesPerView: 3.5, spaceBetween: 8 },
            768: { slidesPerView: 4.5, spaceBetween: 8 },
            1024: { slidesPerView: 6, spaceBetween: 10 },
            1280: { slidesPerView: 8, spaceBetween: 10 },
          }}
          className="!overflow-visible md:!overflow-hidden"
        >
          {movies.map((movie) => (
            <SwiperSlide key={movie.id} className="transition duration-500">
              <MovieCard movie={movie} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className={`swiper-button-prev-${sliderID} absolute -left-4 md:-left-12 top-0 bottom-0 z-40 w-8 md:w-12 cursor-pointer flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition duration-300 hover:bg-black/50 h-full`}>
          <ChevronLeft className="text-white w-6 h-6 md:w-10 md:h-10 transform hover:scale-125 transition" />
        </div>
        <div className={`swiper-button-next-${sliderID} absolute -right-4 md:-right-12 top-0 bottom-0 z-40 w-8 md:w-12 cursor-pointer flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition duration-300 hover:bg-black/50 h-full`}>
          <ChevronRight className="text-white w-6 h-6 md:w-10 md:h-10 transform hover:scale-125 transition" />
        </div>
      </div>
    </div>
  )
}