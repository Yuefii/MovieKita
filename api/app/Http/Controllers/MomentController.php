<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\UserMoment;
use Illuminate\Http\Request;
use App\Http\Requests\StoreMomentRequest;

class MomentController extends Controller
{
  public function index(Request $request)
  {
    $request->validate([
      'movie_id' => 'required'
    ]);

    $moments = UserMoment::where('movie_id', $request->movie_id)
      ->orderBy('created_at', 'desc')
      ->get()
      ->map(function ($moment) {
        return [
          'id' => $moment->id,
          'user_name' => $moment->user_name,
          'image_url' => asset('storage/' . $moment->image_path),
          'location' => $moment->location,
          'created_at' => $moment->created_at->diffForHumans(),
        ];
      });

    return response()->json($moments);
  }

  public function store(StoreMomentRequest $request)
  {
    $validated = $request->validated();

    if ($request->hasFile('image')) {
      $path = $request->file('image')->store('moments', 'public');

      $moment = UserMoment::create([
        'movie_id' => $request->movie_id,
        'user_name' => $request->user_name,
        'image_path' => $path,
        'location' => $request->location,
      ]);

      return response()->json([
        'message' => 'moment uploaded successfully',
        'data' => $moment
      ], 201);
    }

    return response()->json(['message' => 'image upload failed'], 500);
  }
}
