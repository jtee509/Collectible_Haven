<?php

namespace Database\Factories;

use Illuminate\Support\Facades\File;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PhotoFactory extends Factory
{
    public function definition()
    {
        // Get all image files from the specified directory
        $imageFiles = collect(File::files(public_path('storage/images/figures')))  // public_path() to access the public directory
            ->filter(fn($file) => in_array($file->getExtension(), ['jpg', 'jpeg', 'png', 'webp']))
            ->values()
            ->all();

        // If there are files, randomly select one
        $selectedImage = $imageFiles ? $imageFiles[array_rand($imageFiles)] : null;

        // Return only the relative path without the `storage/` prefix
        return [
            'path' => $selectedImage ? 'images/figures/' . basename($selectedImage) : null, // Removed `storage/`
        ];
    }
}
