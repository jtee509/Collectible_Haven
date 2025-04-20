import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import MarketplaceFilters from "./MarketplaceFilters";

const MobileFiltersModal = ({
    isOpen,
    onClose,
    resetFilters,
    selectedCategory,
    setSelectedCategory,
    showRareOnly,
    setShowRareOnly,
    searchTerm,
    setSearchTerm,
    priceRange,
    currentPriceRange,
    handlePriceChange,
    categories,
    selectedName,
    setSelectedName,
    selectedCondition,
    setSelectedCondition,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 bg-white">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>

            <MarketplaceFilters
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                showRareOnly={showRareOnly}
                setShowRareOnly={setShowRareOnly}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                priceRange={priceRange}
                currentPriceRange={currentPriceRange}
                handlePriceChange={handlePriceChange}
                categories={categories}
                selectedName={selectedName}
                setSelectedName={setSelectedName}
                selectedCondition={selectedCondition}
                setSelectedCondition={setSelectedCondition}
            />

            <div className="mt-6 space-y-4">
                <button
                    onClick={resetFilters}
                    className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                    Reset Filters
                </button>

                <button
                    onClick={onClose}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                >
                    Apply Filters
                </button>
            </div>
        </div>
    );
};

export default MobileFiltersModal;
