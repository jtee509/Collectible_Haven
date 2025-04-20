import React, { useState, useEffect } from "react";

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

export default ImageCarousel;
