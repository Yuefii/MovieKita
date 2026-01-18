<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMomentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'movie_id' => 'required',
            'user_name' => 'required|string',
            'image' => 'required|image|max:10240',
            'location' => 'required|string',
        ];
    }
}
