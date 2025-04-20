import React, { useState, useRef, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import {
    TrashIcon,
    MagnifyingGlassIcon,
    ChevronUpDownIcon,
} from "@heroicons/react/24/outline";

const ListingsTab = ({ figurines, listings, auth }) => {
    const { data, setData, post, processing, errors } = useForm({
        figurine_id: "",
        price: "",
        is_tradeable: false,
        is_duplicate: false,
        stock: "",
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Filter figurines based on search term
    const filteredFigurines = figurines.filter(
        (fig) =>
            fig.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fig.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fig.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();

        if (parseFloat(data.price) < 0) {
            alert("Price cannot be negative.");
            return;
        }

        const figurine = figurines.find(
            (fig) => fig.id === parseInt(data.figurine_id)
        );
        if (figurine && parseInt(data.stock) > figurine.quantity) {
            alert(
                "Stock cannot be greater than the available stock of the figurine."
            );
            return;
        }

        post(route("dashboard.listing.store"));
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this listing?")) {
            post(route("dashboard.listing.destroy", id));
        }
    };

    const handleFigurineSelect = (figurineId) => {
        setData("figurine_id", figurineId);
        setIsDropdownOpen(false);
        setSearchTerm(
            figurines.find((fig) => fig.id === figurineId)?.name || ""
        );
    };

    return (
        <div>
            {/* Form Section for Listing a Figurine */}
            <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                <h2 className="font-medium text-gray-900 mb-4">
                    List a Figurine
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label>Choose a Figurine</label>
                        <div className="relative" ref={dropdownRef}>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by name, text or category..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setIsDropdownOpen(true);
                                    }}
                                    onClick={() => setIsDropdownOpen(true)}
                                    className="w-full pl-10 border rounded p-2 pr-10"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <ChevronUpDownIcon
                                        className="h-5 w-5 text-gray-400 cursor-pointer"
                                        onClick={() =>
                                            setIsDropdownOpen(!isDropdownOpen)
                                        }
                                    />
                                </div>
                            </div>

                            {isDropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                    {filteredFigurines.length === 0 ? (
                                        <div className="px-4 py-2 text-gray-700">
                                            No figurines found
                                        </div>
                                    ) : (
                                        filteredFigurines.map((fig) => (
                                            <div
                                                key={fig.id}
                                                onClick={() =>
                                                    handleFigurineSelect(fig.id)
                                                }
                                                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                                                    data.figurine_id ===
                                                    fig.id.toString()
                                                        ? "bg-blue-50"
                                                        : ""
                                                }`}
                                            >
                                                <div className="font-medium">
                                                    {fig.name} {fig.text}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {fig.category} (Stock:{" "}
                                                    {fig.quantity})
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                        {errors.figurine_id && (
                            <div className="text-red-500 text-sm">
                                {errors.figurine_id}
                            </div>
                        )}
                    </div>

                    {/* Rest of your form remains the same */}
                    <div>
                        <label>Price</label>
                        <input
                            type="number"
                            value={data.price}
                            onChange={(e) => setData("price", e.target.value)}
                            className="w-full border rounded p-2"
                        />
                        {errors.price && (
                            <div className="text-red-500 text-sm">
                                {errors.price}
                            </div>
                        )}
                    </div>

                    <div>
                        <label>Stock</label>
                        <input
                            type="number"
                            value={data.stock}
                            onChange={(e) => setData("stock", e.target.value)}
                            className="w-full border rounded p-2"
                        />
                        {errors.stock && (
                            <div className="text-red-500 text-sm">
                                {errors.stock}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="is_tradeable"
                            checked={data.is_tradeable}
                            onChange={(e) =>
                                setData("is_tradeable", e.target.checked)
                            }
                            className="h-4 w-4"
                        />
                        <label htmlFor="is_tradeable">Open to Trade</label>
                    </div>
                    {errors.is_tradeable && (
                        <div className="text-red-500 text-sm">
                            {errors.is_tradeable}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Submit
                    </button>
                </form>
            </div>

            {/* Active Listings Section */}
            <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 mt-4">
                <h2 className="font-medium text-gray-900 mb-4">
                    Your Active Listings
                </h2>
                {listings.length === 0 ? (
                    <p>No active listings yet.</p>
                ) : (
                    <div className="space-y-4">
                        {listings.map((listing) => (
                            <div
                                key={listing.id}
                                className="flex justify-between items-center p-4 border rounded shadow-sm"
                            >
                                <div className="flex-1">
                                    <p className="font-semibold">
                                        {listing.figurine.name}{" "}
                                        {listing.figurine.text} (
                                        {listing.figurine.category})
                                    </p>
                                </div>
                                <div className="flex-1 text-right">
                                    <p className="text-green-700 font-semibold">
                                        RM{" "}
                                        {parseFloat(listing.price).toFixed(2)}
                                    </p>
                                    <p
                                        className={
                                            listing.is_tradeable
                                                ? "text-green-600"
                                                : "text-gray-600"
                                        }
                                    >
                                        {listing.is_tradeable
                                            ? "Tradeable"
                                            : "Not Tradeable"}
                                    </p>
                                    <p>Stock: {listing.stock}</p>
                                </div>
                                <div className="pl-4">
                                    <button
                                        onClick={() => handleDelete(listing.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListingsTab;
