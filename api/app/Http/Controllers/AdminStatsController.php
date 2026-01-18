<?php

namespace App\Http\Controllers;

use App\Models\UserMoment;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class AdminStatsController extends Controller
{
    public function index()
    {
        $stats = UserMoment::select('movie_id', DB::raw('count(*) as total'))
            ->groupBy('movie_id')
            ->orderByDesc('total')
            ->limit(100)
            ->get();

        $totalUsers = User::count();

        return response()->json([
            'stats' => $stats,
            'total_users' => $totalUsers
        ]);
    }
}
