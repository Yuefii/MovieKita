<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserMoment extends Model
{
    use HasFactory;

    protected $fillable = [
        'movie_id',
        'user_name',
        'image_path',
        'location',
    ];
}