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
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
            'location' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'location.required' => 'Location is required. Make sure GPS is enabled and location permission is granted.',
            'image.required' => 'Image is required.',
            'image.image' => 'File must be an image.',
            'image.max' => 'Image size must not exceed 5MB.',
            'user_name.required' => 'User name is required.',
        ];
    }
}
