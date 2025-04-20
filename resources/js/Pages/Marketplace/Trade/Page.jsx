import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import MarketplaceLayout from "@/Layouts/MarketplaceLayout";

const ProposeTrade = ({ listing, userFigurines }) => {
    const { data, setData, post, processing, errors } = useForm({
        proposed_figurine_ids: [],
    });

    const handleCheckboxChange = (id) => {
        const newSelection = data.proposed_figurine_ids.includes(id)
            ? data.proposed_figurine_ids.filter((fid) => fid !== id)
            : [...data.proposed_figurine_ids, id];

        setData("proposed_figurine_ids", newSelection);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("trade.propose", listing.id), {
            data: {
                proposed_figurine_ids: data.proposed_figurine_ids,
            },
        });
    };

    return (
        <MarketplaceLayout>
            <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Propose Trade</h1>

                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-2">
                        Listing Details
                    </h2>
                    <div className="border p-4 rounded space-y-2">
                        <p>
                            <strong>Name:</strong> {listing.figurine.name}{" "}
                            {listing.figurine.text}
                        </p>
                        <p>
                            <strong>Category:</strong>{" "}
                            {listing.figurine.category}
                        </p>
                        <div className="flex items-center gap-2">
                            {listing.figurine.rarity === 1 && (
                                <span className="bg-purple-600 text-white text-xs font-semibold px-2 py-0.5 rounded">
                                    Rare
                                </span>
                            )}
                        </div>
                        <p>
                            <strong>Price:</strong> ${listing.figurine.price}
                        </p>
                        <p>
                            <strong>Seller:</strong> {listing.seller.name}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <h2 className="text-lg font-semibold mb-2">
                        Your Figurines
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        {userFigurines.length === 0 && (
                            <p className="text-sm text-gray-600">
                                You have no figurines to offer.
                            </p>
                        )}

                        {userFigurines.map((fig) => (
                            <label
                                key={fig.id}
                                className="flex items-start gap-2 border p-3 rounded hover:bg-gray-50 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    value={fig.id}
                                    checked={data.proposed_figurine_ids.includes(
                                        fig.id
                                    )}
                                    onChange={() =>
                                        handleCheckboxChange(fig.id)
                                    }
                                    className="mt-1"
                                />
                                <div>
                                    <p className="font-medium">
                                        {fig.name} {fig.text}
                                    </p>
                                    <div className="text-sm text-gray-600 flex items-center gap-2">
                                        {fig.rarity === 1 && (
                                            <span className="bg-purple-600 text-white text-xs font-semibold px-2 py-0.5 rounded">
                                                Rare
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Category: {fig.category}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Value: ${fig.price}
                                    </p>
                                </div>
                            </label>
                        ))}
                    </div>

                    {errors.proposed_figurine_ids && (
                        <p className="text-red-600 mb-4">
                            {errors.proposed_figurine_ids}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {processing ? "Submitting..." : "Submit Trade Proposal"}
                    </button>
                </form>
            </div>
        </MarketplaceLayout>
    );
};

export default ProposeTrade;
