import React from "react";
import MarketplaceLayout from "@/Layouts/MarketplaceLayout";
import { Link } from "@inertiajs/react";

const PurchaseFailure = () => {
    return (
        <MarketplaceLayout>
            <div className="max-w-xl mx-auto py-12 text-center">
                <h1 className="text-3xl font-bold text-red-600 mb-4">
                    ❌ Payment Failed
                </h1>
                <p className="text-lg text-gray-700 mb-6">
                    Unfortunately, your payment could not be completed. Please
                    check your card details and try again.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                >
                    Return to Marketplace
                </Link>
            </div>
        </MarketplaceLayout>
    );
};

export default PurchaseFailure;
