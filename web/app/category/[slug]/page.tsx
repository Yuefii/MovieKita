import Navbar from "@/components/Navbar";
import MovieList from "@/components/MovieList";
import Pagination from "@/components/Pagination";
import { notFound } from "next/navigation";
import { fetchTMDB } from "@/lib/tmdb";

const CATEGORIES: Record<string, string> = {
    popular: "Popular Movies",
    top_rated: "Top Rated Movies",
    upcoming: "Upcoming Movies",
};

interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}

export default async function Page({ params, searchParams }: Props) {
    const { slug } = await params;
    const { page } = await searchParams;

    const title = CATEGORIES[slug];

    if (!title) {
        notFound();
    }

    const currentPage = Number(page) || 1;
    const endpoint = `/movie/${slug}`;

    const data = await fetchTMDB(endpoint, { page: currentPage.toString() });

    if (!data || !data.results) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center">
                <p>Failed to load movies.</p>
            </main>
        );
    }

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-12 min-h-screen bg-black">
                <div className="">
                    <MovieList
                        title={title}
                        movies={data.results.slice(0, 18)}
                    />
                    <Pagination
                        currentPage={data.page}
                        totalPages={Math.min(data.total_pages, 500)}
                        baseUrl={`/category/${slug}`}
                    />
                </div>
            </main>
        </>
    );
}
