import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    PencilSquareIcon,
    XMarkIcon,
    TrashIcon,
    PlusIcon,
} from "@heroicons/react/24/solid";
import { Head, Link, router } from "@inertiajs/react";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";

export default function Dashboard({
    figurines: initialFigurines,
    wishlist: initialWishlist,
}) {
    const [figurines, setFigurines] = useState(initialFigurines);
    const [sortOrder, setSortOrder] = useState("asc");
    const [sortType, setSortType] = useState("name");
    const [search, setSearch] = useState("");
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [wishlist, setWishlist] = useState(initialWishlist); // Initialize wishlist with passed data

    const handleWishlist = (id) => {
        // Check if the figurine is already in the wishlist
        const isInWishlist = wishlist.includes(id);

        // Update the wishlist immediately in the state for UI responsiveness
        setWishlist((prevWishlist) => {
            if (isInWishlist) {
                // If it's in the wishlist, remove it
                return prevWishlist.filter((itemId) => itemId !== id);
            } else {
                // If it's not in the wishlist, add it
                return [...prevWishlist, id];
            }
        });

        // Send request to update the wishlist on the server
        if (isInWishlist) {
            // Remove from wishlist on the server
            router.post(`/wishlist/${id}/remove`, {
                preserveScroll: true,
                onError: (errors) => {
                    console.error(errors);
                },
            });
        } else {
            // Add to wishlist on the server
            router.post(`/wishlist/${id}/add`, {
                preserveScroll: true,
                onError: (errors) => {
                    console.error(errors);
                },
            });
        }
    };

    // Filter figurines based on the search query
    const filteredFigurines = figurines.filter((f) => {
        const query = search.toLowerCase();
        return (
            f.name?.toLowerCase().includes(query) ||
            f.series?.toLowerCase().includes(query) ||
            f.text?.toLowerCase().includes(query) ||
            f.condition?.toLowerCase().includes(query) ||
            f.category?.toLowerCase().includes(query) ||
            f.purchase_date?.toString().includes(query)
        );
    });

    // Carousel component for displaying photos
    const Carousel = ({ photos }) => {
        const [currentIndex, setCurrentIndex] = useState(0);

        const nextPhoto = () => {
            if (currentIndex < photos.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                setCurrentIndex(0);
            }
        };

        const prevPhoto = () => {
            if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
            } else {
                setCurrentIndex(photos.length - 1);
            }
        };

        return (
            <div className="relative">
                {photos.length > 1 && (
                    <button
                        onClick={prevPhoto}
                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 px-2 py-1 rounded-full shadow"
                    >
                        &#10094;
                    </button>
                )}
                {photos.length > 0 ? (
                    <img
                        src={`/storage/${photos[currentIndex]}`}
                        alt={`Figurine ${currentIndex + 1}`}
                        className="w-full h-60 object-cover rounded"
                    />
                ) : (
                    <img
                        src="/images/logo.png" // Path to your fallback logo
                        alt="Default logo"
                        className="w-full h-60 object-contain rounded"
                    />
                )}
                {photos.length > 1 && (
                    <button
                        onClick={nextPhoto}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 px-2 py-1 rounded-full shadow"
                    >
                        &#10095;
                    </button>
                )}
            </div>
        );
    };

    // Delete figurine by ID
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this figurine?")) {
            router.post(
                `/figurines/${id}/delete`,
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setFigurines((prev) => prev.filter((f) => f.id !== id));
                    },
                    onError: (errors) => {
                        console.error("Failed to delete:", errors);
                    },
                }
            );
        }
    };

    // Sort figurines by field and order
    const handleSort = (type) => {
        let order = "asc";
        if (type === sortType && sortOrder === "asc") {
            order = "desc";
        }

        const sorted = [...figurines].sort((a, b) => {
            const valA = a[type];
            const valB = b[type];

            // Handle null or undefined
            if (valA === null || valA === undefined)
                return order === "asc" ? 1 : -1;
            if (valB === null || valB === undefined)
                return order === "asc" ? -1 : 1;

            const isNumber =
                typeof valA === "number" && typeof valB === "number";

            if (isNumber) {
                return order === "asc" ? valA - valB : valB - valA;
            } else {
                const strA = valA.toString().toLowerCase();
                const strB = valB.toString().toLowerCase();
                if (strA < strB) return order === "asc" ? -1 : 1;
                if (strA > strB) return order === "asc" ? 1 : -1;
                return 0;
            }
        });

        setFigurines(sorted);
        setSortType(type);
        setSortOrder(order);
        setShowSortOptions(false);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    My Figurine Collection
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex justify-between items-center">
                        <div className="relative">
                            <button
                                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-blue-700"
                                onClick={() =>
                                    setShowSortOptions(!showSortOptions)
                                }
                            >
                                Sort by {sortType} ({sortOrder})
                            </button>
                            {showSortOptions && (
                                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10">
                                    <ul className="text-gray-700">
                                        {["name", "category", "rarity"].map(
                                            (type) => (
                                                <li key={type}>
                                                    <button
                                                        onClick={() =>
                                                            handleSort(type)
                                                        }
                                                        className={`block px-4 py-2 text-sm  ${
                                                            sortType === type
                                                                ? ""
                                                                : ""
                                                        }`}
                                                    >
                                                        {`Sort by ${
                                                            type
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                            type.slice(1)
                                                        }`}
                                                    </button>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <Link
                            href={route("dashboard.add")}
                            className="px-4 py-2 bg-purple-600 text-white rounded  flex items-center gap-2"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Add Figurine
                        </Link>
                    </div>

                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search by name, series, condition , etc..."
                            className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="bg-white shadow rounded-lg p-6">
                        {filteredFigurines.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10">
                                <p className="text-xl font-semibold text-gray-600 mb-4">
                                    You don't have any figurines yet. Start
                                    adding!
                                </p>
                                <Link
                                    href={route("dashboard.add")}
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                >
                                    Add Figurine
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredFigurines.map((f) => (
                                    <div
                                        key={f.id}
                                        className="bg-gray-100 rounded p-4 relative h-full"
                                    >
                                        <div className="absolute -top-2 -left-2 flex flex-row gap-1">
                                            {f.rarity === 1 && (
                                                <div className="bg-purple-500 text-white px-2 py-1 text-xs rounded">
                                                    Rare
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-2">
                                            <h3 className="text-lg font-semibold">
                                                {f.name} {f.text}
                                            </h3>
                                            <p className="text-sm line-clamp-3">
                                                {f.description}
                                            </p>
                                            <p className="text-sm line-clamp-3">
                                                {f.category}
                                            </p>

                                            <p className="text-sm">
                                                Price: RM{f.price} | Tradeable:{" "}
                                                {f.is_tradeable ? "Yes" : "No"}
                                            </p>

                                            <p className="text-sm line-clamp-3">
                                                Stock {f.quantity}
                                            </p>

                                            {f.photos &&
                                                f.photos.length > 0 && (
                                                    <Carousel
                                                        photos={f.photos.map(
                                                            (photo) =>
                                                                photo.path
                                                        )}
                                                    />
                                                )}
                                        </div>

                                        <div className="flex justify-between mt-4 items-center">
                                            <div className="flex gap-3">
                                                <Link
                                                    href={`/dashboard/${f.id}/edit`}
                                                    className="text-purple-600 hover:text-purple-800"
                                                >
                                                    <PencilSquareIcon className="w-6 h-6" />
                                                </Link>
                                                <button
                                                    title="Wishlist"
                                                    onClick={() =>
                                                        handleWishlist(f.id)
                                                    }
                                                    className="text-pink-600 hover:text-pink-800"
                                                >
                                                    {wishlist.includes(f.id) ? (
                                                        <SolidHeartIcon className="h-6 w-6 text-red-500" />
                                                    ) : (
                                                        <OutlineHeartIcon className="h-6 w-6" />
                                                    )}
                                                </button>
                                            </div>

                                            <div className="relative group">
                                                <button
                                                    onClick={() =>
                                                        handleDelete(f.id)
                                                    }
                                                    disabled={f.is_locked == 1}
                                                    className={`text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed`}
                                                >
                                                    <TrashIcon className="w-6 h-6" />
                                                </button>

                                                {f.is_locked == 1 && (
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 z-10 shadow-lg whitespace-nowrap">
                                                        Product on a active
                                                        sale/trade
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
