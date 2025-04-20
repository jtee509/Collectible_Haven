import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import ListingsTab from "./ListingsTab";
import TradesTab from "./TradesTab";
import ReviewsTab from "./ReviewsTab";

const Listing = ({ auth, figurines, listings, openTrades, sales, trades }) => {
    const [activeTab, setActiveTab] = useState("listings");

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Trade & Sell
                </h2>
            }
        >
            <Head title="Create Listing" />
            <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                    Sales {auth.user.total_sales} - Rating {auth.user.rating}
                </div>

                {/* Tab Navigation */}
                <div className="flex space-x-4 border-b">
                    <button
                        onClick={() => setActiveTab("listings")}
                        className={`py-2 px-4 font-medium text-gray-900 ${
                            activeTab === "listings"
                                ? "border-b-2 border-blue-600"
                                : ""
                        }`}
                    >
                        Listings
                    </button>
                    <button
                        onClick={() => setActiveTab("trades")}
                        className={`py-2 px-4 font-medium text-gray-900 ${
                            activeTab === "trades"
                                ? "border-b-2 border-blue-600"
                                : ""
                        }`}
                    >
                        Trades
                    </button>
                    <button
                        onClick={() => setActiveTab("reviews")}
                        className={`py-2 px-4 font-medium text-gray-900 ${
                            activeTab === "reviews"
                                ? "border-b-2 border-blue-600"
                                : ""
                        }`}
                    >
                        Reviews
                    </button>
                </div>

                {/* Content for Active Tab */}
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {activeTab === "listings" && (
                        <ListingsTab
                            figurines={figurines}
                            listings={listings}
                            auth={auth}
                        />
                    )}
                    {activeTab === "trades" && (
                        <TradesTab openTrades={openTrades} auth={auth} />
                    )}
                    {activeTab === "reviews" && (
                        <ReviewsTab sales={sales} trades={trades} auth={auth} />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Listing;
