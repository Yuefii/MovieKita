import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
}

export default function Pagination({ 
    currentPage, 
    totalPages, 
    baseUrl 
}: Props) {
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    const getPageNumbers = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        range.push(1);

        for (let i = currentPage - delta; i <= currentPage + delta; i++) {
            if (i < totalPages && i > 1) {
                range.push(i);
            }
        }

        if (totalPages > 1) {
            range.push(totalPages);
        }

        let l;

        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    };

    const pages = getPageNumbers();

    return (
        <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
            {prevPage ? (
                <Link
                    href={`${baseUrl}?page=${prevPage}`}
                    className="p-2 rounded-md bg-zinc-800/50 border border-gray-700 hover:bg-blue-600 hover:border-blue-500 hover:text-white text-gray-400 transition-all duration-300"
                    title="Previous Page"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Link>
            ) : (
                <button
                    disabled
                    className="p-2 rounded-md bg-zinc-900 border border-gray-800 text-gray-700 cursor-not-allowed"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
            )}
            <div className="flex items-center gap-2">
                {pages.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`dots-${index}`} className="px-2 text-gray-500 font-semibold select-none">
                                ...
                            </span>
                        );
                    }
                    const isCurrent = page === currentPage;
                    return (
                        <Link
                            key={`page-${page}`}
                            href={`${baseUrl}?page=${page}`}
                            className={`min-w-[40px] h-10 flex items-center justify-center rounded-md font-semibold text-sm transition-all duration-300 border ${isCurrent
                                ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                                : "bg-zinc-800/50 border-gray-700 text-gray-400 hover:bg-zinc-700 hover:text-white hover:border-gray-500"
                                }`}
                        >
                            {page}
                        </Link>
                    );
                })}
            </div>
            {nextPage ? (
                <Link
                    href={`${baseUrl}?page=${nextPage}`}
                    className="p-2 rounded-md bg-zinc-800/50 border border-gray-700 hover:bg-blue-600 hover:border-blue-500 hover:text-white text-gray-400 transition-all duration-300"
                    title="Next Page"
                >
                    <ChevronRight className="w-5 h-5" />
                </Link>
            ) : (
                <button
                    disabled
                    className="p-2 rounded-md bg-zinc-900 border border-gray-800 text-gray-700 cursor-not-allowed"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}
