"use client";

interface ChartData {
    movieId: number;
    title: string;
    total: number;
}

export default function AdminChart({ data }: { data: ChartData[] }) {
    if (!data || data.length === 0) {
        return <div className="text-zinc-500 text-sm font-mono py-12 border border-dashed border-zinc-800 rounded text-center">NO DATA AVAILABLE</div>;
    }

    const maxTotal = Math.max(...data.map((d) => d.total));

    return (
        <div className="space-y-6">
            {data.map((item, index) => {
                const percentage = (item.total / maxTotal) * 100;
                const isTop = index === 0;

                return (
                    <div key={item.movieId} className="group">
                        <div className="flex items-end justify-between mb-2">
                            <div className="flex items-baseline gap-3">
                                <span className={`font-mono text-sm ${isTop ? 'text-blue-600 font-bold' : 'text-zinc-600'}`}>
                                    {String(index + 1).padStart(2, '0')}.
                                </span>
                                <span className={`font-medium truncate max-w-[200px] md:max-w-xs ${isTop ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200 transition'}`}>
                                    {item.title}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-xs text-zinc-500">{item.total}</span>
                                <span className="text-[10px] text-zinc-700 bg-zinc-900 px-1 rounded">{Math.round(percentage)}%</span>
                            </div>
                        </div>

                        <div className="w-full bg-zinc-900 h-1 overflow-hidden">
                            <div
                                className={`h-full transition-all duration-700 ease-out ${isTop ? 'bg-blue-600' : 'bg-zinc-700'}`}
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
