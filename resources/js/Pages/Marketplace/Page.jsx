import React, { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import MarketplaceLayout from "@/Layouts/MarketplaceLayout";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import {
    AdjustmentsHorizontalIcon,
    ShareIcon,
} from "@heroicons/react/24/outline";
import MarketplaceFilters from "./MarketplaceFilters";
import MobileFiltersModal from "./MobileFiltersModal";
import ImageCarousel from "./ImageCarousel";
import {
    FacebookShareButton,
    TwitterShareButton,
    FacebookIcon,
    XIcon,
} from "react-share";

const Marketplace = ({ listings, wishlist = [], categories }) => {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [userWishlist, setUserWishlist] = useState(wishlist);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showRareOnly, setShowRareOnly] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [priceRange, setPriceRange] = useState([1, Infinity]);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [currentPriceRange, setCurrentPriceRange] = useState(priceRange);

    // Additional state for the new filters (name and condition)
    const [selectedName, setSelectedName] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("");

    const filteredListings = listings.filter((item) => {
        const matchesCategory = selectedCategory
            ? item.figurine.category === selectedCategory
            : true;
        const matchesRarity = showRareOnly ? item.figurine.rarity : true;
        const matchesSearch =
            item.figurine.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            item.figurine.category
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            item.figurine.text
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());
        const matchesPrice =
            item.price >= currentPriceRange[0] &&
            item.price <= currentPriceRange[1];

        // Filter by name and condition
        const matchesName = selectedName
            ? item.figurine.name
                  .toLowerCase()
                  .includes(selectedName.toLowerCase())
            : true;
        const matchesCondition = selectedCondition
            ? item.figurine.condition === selectedCondition
            : true;

        return (
            matchesCategory &&
            matchesRarity &&
            matchesSearch &&
            matchesPrice &&
            matchesName &&
            matchesCondition
        );
    });

    const handlePriceChange = (value) => {
        setCurrentPriceRange(value);
    };

    const resetFilters = () => {
        setSelectedCategory("");
        setShowRareOnly(false);
        setSearchTerm("");
        setCurrentPriceRange(priceRange);
        setSelectedName(""); // Reset name filter
        setSelectedCondition(""); // Reset condition filter
    };

    const isWishlisted = (figurineId) => userWishlist.includes(figurineId);

    const handleWishlistClick = (figurineId) => {
        handleProtectedClick(() => {
            const alreadyWishlisted = isWishlisted(figurineId);

            router.post(
                `/wishlist/${figurineId}/${
                    alreadyWishlisted ? "remove" : "add"
                }`,
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setUserWishlist((prev) =>
                            alreadyWishlisted
                                ? prev.filter((id) => id !== figurineId)
                                : [...prev, figurineId]
                        );
                    },
                }
            );
        });
    };

    const handleShare = (item) => {
        const shareUrl = `${window.location.origin}/listing/${item.id}`;
        const shareText = `Check out this ${item.figurine.name} ${item.figurine.text} on Figurine Marketplace!`;

        return (
            <div className="absolute top-3 left-2 bg-white rounded-lg shadow-lg p-2 z-10">
                <div className="flex flex-col gap-2">
                    <FacebookShareButton
                        url={shareUrl}
                        quote={shareText}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        <FacebookIcon size={32} round />
                        <span className="text-xs">Share on Facebook</span>
                    </FacebookShareButton>

                    <TwitterShareButton
                        url={shareUrl}
                        title={shareText}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-400 text-white rounded hover:bg-blue-500"
                    >
                        <XIcon size={20} round />
                        <span className="text-xs">Share on X</span>
                    </TwitterShareButton>
                </div>
            </div>
        );
    };

    const [activeShareId, setActiveShareId] = useState(null);

    useEffect(() => {
        if (listings.length > 0) {
            const prices = listings.map((item) => item.price);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            setPriceRange([minPrice, maxPrice]);
        }
    }, [listings]);

    const handleProtectedClick = (callback) => {
        if (!user) {
            router.visit("/login");
        } else {
            callback();
        }
    };

    return (
        <MarketplaceLayout>
            <main className="py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header with mobile filter button */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">
                            Marketplace Listings
                        </h2>
                        <button
                            type="button"
                            className="md:hidden flex items-center gap-2 text-gray-700 hover:text-gray-900"
                            onClick={() => setMobileFiltersOpen(true)}
                        >
                            <AdjustmentsHorizontalIcon className="h-5 w-5" />
                            <span>Filters</span>
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Mobile Filters Modal */}
                        <MobileFiltersModal
                            isOpen={mobileFiltersOpen}
                            onClose={() => setMobileFiltersOpen(false)}
                            resetFilters={resetFilters}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            showRareOnly={showRareOnly}
                            setShowRareOnly={setShowRareOnly}
                            priceRange={priceRange}
                            currentPriceRange={currentPriceRange}
                            handlePriceChange={handlePriceChange}
                            categories={categories}
                            selectedName={selectedName}
                            setSelectedName={setSelectedName}
                            selectedCondition={selectedCondition}
                            setSelectedCondition={setSelectedCondition}
                        />

                        {/* Desktop Filters */}
                        <div className="hidden md:block w-full md:w-1/4 bg-white p-6 rounded-lg shadow-md h-full">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Filters
                                </h3>
                                <button
                                    onClick={resetFilters}
                                    className="text-sm text-purple-600 hover:text-purple-800"
                                >
                                    Reset all
                                </button>
                            </div>
                            <MarketplaceFilters
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                                showRareOnly={showRareOnly}
                                setShowRareOnly={setShowRareOnly}
                                priceRange={priceRange}
                                currentPriceRange={currentPriceRange}
                                handlePriceChange={handlePriceChange}
                                categories={categories}
                                selectedName={selectedName}
                                setSelectedName={setSelectedName}
                                selectedCondition={selectedCondition}
                                setSelectedCondition={setSelectedCondition}
                            />
                        </div>

                        {/* Listings Grid */}
                        <div className="w-full md:w-3/4">
                            {filteredListings.length === 0 ? (
                                <div className="bg-white rounded-xl shadow p-8 text-center">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No listings found
                                    </h3>
                                    <p className="text-gray-500">
                                        Try adjusting your search or filter
                                        criteria
                                    </p>
                                    <button
                                        onClick={resetFilters}
                                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
                                    >
                                        Reset all filters
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredListings.map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 relative flex flex-col h-full"
                                        >
                                            <button
                                                onClick={() =>
                                                    handleWishlistClick(
                                                        item.figurine.id
                                                    )
                                                }
                                                className="absolute top-6 right-4 text-gray-400 hover:text-red-500 z-10"
                                                title={
                                                    isWishlisted(
                                                        item.figurine.id
                                                    )
                                                        ? "Remove from Wishlist"
                                                        : "Add to Wishlist"
                                                }
                                            >
                                                {isWishlisted(
                                                    item.figurine.id
                                                ) ? (
                                                    <SolidHeartIcon className="h-6 w-6 text-red-500" />
                                                ) : (
                                                    <OutlineHeartIcon className="h-6 w-6" />
                                                )}
                                            </button>

                                            {/* Share Button */}
                                            <div className="absolute top-6 left-4 z-10">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveShareId(
                                                            activeShareId ===
                                                                item.id
                                                                ? null
                                                                : item.id
                                                        );
                                                    }}
                                                    className="text-gray-400 hover:text-blue-500"
                                                    title="Share this listing"
                                                >
                                                    <ShareIcon className="h-6 w-6" />
                                                </button>
                                                {activeShareId === item.id &&
                                                    handleShare(item)}
                                            </div>
                                            <ImageCarousel
                                                photos={item.figurine.photos}
                                            />

                                            {/* Duplicate Banner and Rare Banner */}
                                            <div className="absolute -top-2 -left-2 flex flex-row gap-1">
                                                {item.figurine.rarity === 1 && (
                                                    <div className="bg-purple-500 text-white px-2 py-1 text-xs rounded">
                                                        Rare
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    {item.figurine.name}{" "}
                                                    {item.figurine.text}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {item.figurine.category}
                                                </p>
                                                <div className="mt-2 text-xl font-bold text-purple-600">
                                                    RM {item.price}
                                                </div>
                                                <div className="mt-2 text-md text-gray-700">
                                                    Available Stock |{" "}
                                                    {item.stock}
                                                </div>
                                                <div className="mt-2 text-sm text-gray-700">
                                                    <p>
                                                        <span className="font-semibold">
                                                            Seller:
                                                        </span>{" "}
                                                        {item.seller.name}
                                                    </p>
                                                    <p>
                                                        <span className="font-semibold">
                                                            Sales:
                                                        </span>{" "}
                                                        {
                                                            item.seller
                                                                .total_sales
                                                        }
                                                    </p>
                                                    <p>
                                                        <span className="font-semibold">
                                                            Rating:
                                                        </span>{" "}
                                                        {item.seller.rating ??
                                                            "N/A"}
                                                    </p>
                                                </div>{" "}
                                            </div>

                                            <div className="flex items-center justify-center space-x-4 mt-4">
                                                {user &&
                                                item.user_id === user.id ? (
                                                    <div className="w-full border border-purple-400 bg-purple-50 text-purple-800 font-semibold py-2 rounded-lg text-center">
                                                        Your Listing
                                                    </div>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                handleProtectedClick(
                                                                    () =>
                                                                        router.visit(
                                                                            `/purchase/${item.id}`
                                                                        )
                                                                )
                                                            }
                                                            className="w-full border border-white bg-purple-600 text-white font-semibold py-2 rounded-lg text-center"
                                                        >
                                                            {" "}
                                                            Buy
                                                        </button>

                                                        {item.is_tradeable ? (
                                                            <>
                                                                <div className="text-center text-gray-600">
                                                                    or
                                                                </div>
                                                                <button
                                                                    onClick={() =>
                                                                        handleProtectedClick(
                                                                            () =>
                                                                                router.visit(
                                                                                    `/listing/${item.id}/trade`
                                                                                )
                                                                        )
                                                                    }
                                                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
                                                                >
                                                                    Trade
                                                                </button>
                                                            </>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </MarketplaceLayout>
    );
};

export default Marketplace;
