<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
        ];

        if ($request->filled('password')) {
            $rules['password'] = ['required', 'string', 'min:8', 'confirmed'];
            $rules['current_password'] = ['required', 'current_password'];
        }

        $validated = $request->validate($rules);

        $request->user()->fill([
            'name' => $validated['name'],
        ]);

        if ($request->filled('password')) {
            $request->user()->update([
                'password' => Hash::make($validated['password']),
            ]);
        }

        $request->user()->save();

        return response()->json([
            'message' => 'Profile updated.',
            'user' => $request->user(),
        ]);
    }
}
