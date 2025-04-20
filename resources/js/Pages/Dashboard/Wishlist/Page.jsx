import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage, router } from "@inertiajs/react";
import { TrashIcon } from "@heroicons/react/24/solid";

// 🔄 Carousel Component
const ImageCarousel = ({ photos }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const showPrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? photos.length - 1 : prevIndex - 1
        );
    };

    const showNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === photos.length - 1 ? 0 : prevIndex + 1
        );
    };

    const photoPaths = photos?.map((photo) => photo.path || photo);

    if (!photoPaths || photoPaths.length === 0) {
        return (
            <img
                src="/images/logo.png"
                alt="No image"
                className="w-full h-60 object-cover rounded-lg mb-4"
            />
        );
    }

    return (
        <div className="relative w-full h-60 mb-4 overflow-hidden rounded-lg">
            <img
                src={`/storage/${photoPaths[currentIndex]}`}
                alt={`Figurine ${currentIndex + 1}`}
                className="w-full h-60 object-cover"
            />
            {photoPaths.length > 1 && (
                <>
                    <button
                        onClick={showPrev}
                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 px-2 py-1 rounded-full shadow"
                    >
                        ‹
                    </button>
                    <button
                        onClick={showNext}
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 px-2 py-1 rounded-full shadow"
                    >
                        ›
                    </button>
                </>
            )}
        </div>
    );
};

// 🧩 Wishlist Component
const Wishlist = ({ wishlist }) => {
    const handleRemove = (figurineId) => {
        router.post(route("wishlist.remove", figurineId));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Wishlist
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold mb-6">Your Wishlist</h1>

                    {wishlist.length === 0 ? (
                        <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                            <p className="text-gray-600">
                                Your wishlist is empty.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                {wishlist.map((figurine) => (
                                    <div
                                        key={figurine.id}
                                        className="p-4 border rounded-lg shadow-sm bg-white flex flex-col h-full"
                                    >
                                        <ImageCarousel
                                            photos={figurine.photos}
                                        />

                                        <div className="flex-grow">
                                            <h2 className="text-lg font-semibold">
                                                {figurine.name} {figurine.text}
                                            </h2>
                                            <p className="text-gray-500">
                                                {figurine.category}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() =>
                                                handleRemove(figurine.id)
                                            }
                                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center gap-2 w-full"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                            <span>Remove from Wishlist</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Wishlist;
