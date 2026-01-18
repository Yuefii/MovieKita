"use client";

import Image from "next/image";
import useSWR from "swr";
import axios from "@/lib/axios";
import Navbar from "@/components/Navbar";
import AdminChart from "@/components/AdminChart";
import { useAuth } from "@/hooks/use_auth";
import { useMovies } from "@/hooks/use_movies";
import { useRouter } from "next/navigation";
import { TMDB_IMG_URL } from "@/lib/env";
import { useEffect, useState } from "react";
import { BarChart2, TrendingUp, Film, Users } from "lucide-react";

export default function Page() {
    const { user } = useAuth({ middleware: 'auth' })
    const { movies } = useMovies()
    const router = useRouter()
    const { data: statsData } = useSWR('/api/admin/stats', () =>
        axios
            .get('/api/admin/stats')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error
            }),
    )

    const [chartData, setChartData] = useState<any[]>([])
    const [overview, setOverview] = useState({
        total_uploads: 0,
        active_movies: 0,
        total_users: 0
    })

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/')
        }
    }, [user, router])

    useEffect(() => {
        if (statsData && movies.nowPlaying?.results) {
            const { stats, total_users } = statsData;

            const mergedData = stats
                .map((stat: any) => {
                    const movie = movies.nowPlaying?.results.find((m: any) => m.id === stat.movie_id)
                    if (movie) {
                        return {
                            movieId: stat.movie_id,
                            title: movie.title,
                            total: stat.total,
                            poster_path: movie.poster_path
                        }
                    }
                    return null
                })
                .filter((item: any) => item !== null)
                .slice(0, 5)

            setChartData(mergedData)

            setOverview({
                total_uploads: stats.reduce((acc: number, curr: any) => acc + curr.total, 0),
                active_movies: stats.length,
                total_users: total_users
            })
        }
    }, [statsData, movies.nowPlaying])

    if (!user || user.role !== 'admin') {
        return null
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans">
            <Navbar />
            <div className="pt-28 md:pt-32 p-6 md:p-12 relative">
                <div className="max-w-6xl mx-auto space-y-12">
                    <header className="flex items-center justify-between border-b border-zinc-800 pb-6">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-white">Dashboard</h1>
                            <p className="text-zinc-300 text-sm mt-1 font-mono">
                                System Overview & Statistics
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="px-3 py-1 bg-zinc-900 rounded-md border border-zinc-800 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-[10px] text-zinc-400 font-mono tracking-wider">LIVE</span>
                            </div>
                        </div>
                    </header>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900/50 transition duration-300 rounded-md">
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-xs font-mono text-zinc-300 uppercase tracking-widest">Total Uploads</span>
                                <TrendingUp className="w-4 h-4 text-zinc-600" />
                            </div>
                            <p className="text-4xl font-light text-white">{overview.total_uploads}</p>
                        </div>
                        <div className="p-6 border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900/50 transition duration-300 rounded-md">
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-xs font-mono text-zinc-300 uppercase tracking-widest">Active Movies</span>
                                <Film className="w-4 h-4 text-zinc-600" />
                            </div>
                            <p className="text-4xl font-light text-white">{overview.active_movies}</p>
                        </div>
                        <div className="p-6 border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900/50 transition duration-300 rounded-md">
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-xs font-mono text-zinc-300 uppercase tracking-widest">Total Users</span>
                                <Users className="w-4 h-4 text-zinc-600" />
                            </div>
                            <p className="text-4xl font-light text-white">{overview.total_users}</p>
                        </div>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 p-8 border border-zinc-800 bg-zinc-950/30 rounded-md">
                            <div className="flex items-center gap-3 mb-10">
                                <BarChart2 className="w-4 h-4 text-blue-600" />
                                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Top Movies Engagement</h2>
                            </div>
                            <AdminChart data={chartData} />
                        </div>
                        <div className="border border-zinc-800 bg-zinc-950/30 p-8 flex flex-col items-center text-center justify-center rounded-md">
                            {chartData.length > 0 ? (
                                <>
                                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-blue-600 mb-6 border-b border-blue-600/50 pb-2">Top Performer</span>
                                    <div className="relative w-32 h-48 mb-6 grayscale hover:grayscale-0 transition duration-500 border border-zinc-800">
                                        {chartData[0].poster_path ? (
                                            <Image
                                                src={`${TMDB_IMG_URL}${chartData[0].poster_path}`}
                                                alt={chartData[0].title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700 text-xs">NO IMG</div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-lg leading-tight text-white mb-2">{chartData[0].title}</p>
                                        <p className="text-2xl font-light text-zinc-400">{chartData[0].total} <span className="text-xs text-zinc-600 font-mono">UPLOADS</span></p>
                                    </div>
                                </>
                            ) : (
                                <p className="text-zinc-600 text-sm font-mono">NO DATA</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}