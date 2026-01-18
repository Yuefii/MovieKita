"use client";

import axios from "@/lib/axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MapPin, User, Calendar, Loader2 } from "lucide-react";

interface Moment {
    id: number;
    user_name: string;
    image_url: string;
    location: string;
    created_at: string;
}

interface PaginatedResponse {
    data: Moment[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    movieId: string;
}

export default function Page({
    movieId
}: Props) {
    const [moments, setMoments] = useState<Moment[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchMoments = async (pageToFetch: number, isLoadMore = false) => {
        try {
            if (isLoadMore) setLoadingMore(true);
            else setLoading(true);

            const res = await axios.get<PaginatedResponse>(`/api/moments?movie_id=${movieId}&page=${pageToFetch}`);

            if (isLoadMore) {
                setMoments(prev => [...prev, ...res.data.data]);
            } else {
                setMoments(res.data.data);
            }

            setPage(res.data.current_page);
            setLastPage(res.data.last_page);
        } catch (error) {
            console.error("Failed to fetch moments", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (movieId) {
            setMoments([]);
            setPage(1);
            fetchMoments(1);
        }
    }, [movieId]);

    const handleLoadMore = () => {
        if (page < lastPage && !loadingMore) {
            fetchMoments(page + 1, true);
        }
    };

    if (loading) {
        return (
            <div className="w-full py-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (moments.length === 0) {
        return null;
    }

    return (
        <div className="mt-12 border-t border-white/10 pt-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                User Moments
                <span className="text-sm font-normal text-gray-400 bg-white/10 px-2 py-0.5 rounded-full">
                    {moments.length}+
                </span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {moments.map((moment) => (
                    <div
                        key={moment.id}
                        className="group relative aspect-[3/4] rounded-lg overflow-hidden bg-[#262626] border border-white/5 hover:border-white/20 transition-all duration-300"
                    >
                        <Image
                            src={moment.image_url}
                            alt={`Moment by ${moment.user_name}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                            <div className="space-y-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <div className="flex items-center gap-2 text-white font-medium">
                                    <User className="w-3 h-3 text-blue-400" />
                                    <span className="truncate">{moment.user_name}</span>
                                </div>
                                {moment.location && (
                                    <div className="flex items-center gap-2 text-xs text-gray-300">
                                        <MapPin className="w-3 h-3 text-red-400 flex-shrink-0" />
                                        <span className="truncate">{moment.location}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{moment.created_at}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {page < lastPage && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md font-medium transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loadingMore ? "Loading..." : "Show More"}
                    </button>
                </div>
            )}
        </div>
    );
}
