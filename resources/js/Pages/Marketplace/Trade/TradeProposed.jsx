import React from "react";
import { Head } from "@inertiajs/react";
import MarketplaceLayout from "@/Layouts/MarketplaceLayout";

const TradeProposedPage = ({ trade }) => {
    return (
        <MarketplaceLayout>
            <div>
                <Head title="Trade Proposal Success" />

                <div className="max-w-7xl mx-auto px-4 py-10">
                    <h1 className="text-3xl font-semibold mb-6">
                        Trade Proposal Submitted
                    </h1>

                    <p className="text-lg mb-6">
                        Your trade proposal has been successfully submitted.
                        Here's a summary of your proposal:
                    </p>

                    {/* Buyer’s Figurines Offered */}
                    <div className="mb-6">
                        <h2 className="text-xl font-medium mb-4">
                            Your Proposed Figurines
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {trade.figurines.map((figurine) => (
                                <div
                                    key={figurine.id}
                                    className="border p-4 rounded-lg shadow-md"
                                >
                                    <img
                                        src={figurine.photo}
                                        alt={figurine.name}
                                        className="w-full h-48 object-cover mb-4 rounded-lg"
                                    />
                                    <h3 className="text-lg font-semibold">
                                        {figurine.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {figurine.category}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Trade Listing Details */}
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                        <h3 className="text-xl font-medium mb-4">
                            Trade Listing Details
                        </h3>

                        <div className="flex items-center mb-4">
                            <img
                                src={
                                    trade.listing.figurine.photos?.[0]?.path ||
                                    "/placeholder.jpg"
                                }
                                alt={trade.listing.figurine.name}
                                className="w-32 h-32 object-cover rounded-lg mr-6"
                            />
                            <div>
                                <h4 className="text-lg font-semibold">
                                    {trade.listing.figurine.name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                    {trade.listing.figurine.category}
                                </p>
                            </div>
                        </div>

                        <h4 className="text-lg font-medium mb-4">
                            Seller: {trade.listing.seller.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                            You are proposing a trade for{" "}
                            {trade.listing.figurine.name} with{" "}
                            {trade.listing.seller.name}.
                        </p>
                    </div>

                    {/* Trade Status */}
                    <div className="bg-gray-100 p-4 rounded-lg text-center">
                        <p className="text-lg font-semibold text-green-600">
                            Trade Status: {trade.status}
                        </p>
                        <p className="text-sm text-gray-600">
                            Your proposal is now awaiting the seller's response.
                        </p>
                    </div>
                </div>
            </div>
        </MarketplaceLayout>
    );
};

export default TradeProposedPage;
