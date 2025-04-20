import React from "react";
import MarketplaceLayout from "@/Layouts/MarketplaceLayout";

const PurchaseSuccess = () => {
    return (
        <MarketplaceLayout>
            <div className="max-w-xl mx-auto py-12 text-center">
                <h1 className="text-3xl font-bold text-green-700 mb-4">
                    🎉 Payment Successful!
                </h1>
                <p className="text-lg text-gray-700">
                    Your figurine will be shipped soon. Thank you for your
                    purchase!
                </p>
            </div>
        </MarketplaceLayout>
    );
};

export default PurchaseSuccess;
