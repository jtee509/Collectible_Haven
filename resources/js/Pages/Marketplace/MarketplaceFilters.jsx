import React from "react";
import CategoryDropdown from "@/Components/CategoryDropdown";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const MarketplaceFilters = ({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    showRareOnly,
    setShowRareOnly,
    priceRange,
    currentPriceRange,
    handlePriceChange,
    resetFilters,
    categories,
    selectedCondition,
    setSelectedCondition,
    selectedName,
    setSelectedName,
}) => {
    const handleMinPriceChange = (e) => {
        const newMin = Math.min(Number(e.target.value), currentPriceRange[1]);
        handlePriceChange([newMin, currentPriceRange[1]]);
    };

    const handleMaxPriceChange = (e) => {
        const newMax = Math.max(Number(e.target.value), currentPriceRange[0]);
        handlePriceChange([currentPriceRange[0], newMax]);
    };

    return (
        <div className="space-y-6">
            {/* Search Filter */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                </label>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Search by name,series,text.."
                />
            </div>

            {/* Category Dropdown */}
            <div>
                <CategoryDropdown
                    categories={categories}
                    selectedCategory={selectedCategory}
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    onCategoryChange={setSelectedCategory}
                />
            </div>

            {/* Rare Filter Checkbox */}
            <div className="flex items-center">
                <input
                    id="rare-filter"
                    name="rare-filter"
                    type="checkbox"
                    checked={showRareOnly}
                    onChange={() => setShowRareOnly(!showRareOnly)}
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label
                    htmlFor="rare-filter"
                    className="ml-2 text-sm text-gray-700"
                >
                    Rare only
                </label>
            </div>

            {/* Condition Filter */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition
                </label>
                <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-full border rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500"
                >
                    <option value="">Any condition</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                </select>
            </div>

            {/* Name Filter */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Figurine Name
                </label>
                <select
                    value={selectedName}
                    onChange={(e) => setSelectedName(e.target.value)}
                    className="w-full border rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500"
                >
                    <option value="">Any name</option>
                    <option value="Molly">Molly</option>
                    <option value="Hirono">Hirono</option>
                    <option value="Dimoo">Dimoo</option>
                </select>
            </div>

            {/* Price Range Filter */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range (RM)
                </label>

                {/* Price Input Fields */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">
                            Min Price
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                RM
                            </span>
                            <input
                                type="number"
                                min={priceRange[0]}
                                max={priceRange[1]}
                                value={currentPriceRange[0]}
                                onChange={handleMinPriceChange}
                                className="w-full pl-10 border rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">
                            Max Price
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                RM
                            </span>
                            <input
                                type="number"
                                min={priceRange[0]}
                                max={priceRange[1]}
                                value={currentPriceRange[1]}
                                onChange={handleMaxPriceChange}
                                className="w-full pl-10 border rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Price Range Slider */}
                <div className="flex items-center justify-between mb-2 text-sm text-purple-700 font-semibold">
                    <span>RM {currentPriceRange[0]}</span>
                    <span>RM {currentPriceRange[1]}</span>
                </div>
                <Slider
                    range
                    min={priceRange[0]}
                    max={priceRange[1]}
                    value={currentPriceRange}
                    onChange={handlePriceChange}
                    trackStyle={[{ backgroundColor: "#8b5cf6", height: 6 }]}
                    handleStyle={[
                        {
                            backgroundColor: "#fff",
                            borderColor: "#8b5cf6",
                            height: 20,
                            width: 20,
                            marginTop: -7,
                        },
                        {
                            backgroundColor: "#fff",
                            borderColor: "#8b5cf6",
                            height: 20,
                            width: 20,
                            marginTop: -7,
                        },
                    ]}
                    railStyle={{ backgroundColor: "#e5e7eb", height: 6 }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>RM {priceRange[0]}</span>
                    <span>RM {priceRange[1]}</span>
                </div>
            </div>
        </div>
    );
};

export default MarketplaceFilters;
