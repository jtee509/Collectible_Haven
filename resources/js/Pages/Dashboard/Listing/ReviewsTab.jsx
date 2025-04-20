import React, { useState } from "react";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";

const ReviewsTab = ({ sales, trades, auth }) => {
    const [ratings, setRatings] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRatingSubmit = async (e, itemId, type) => {
        e.preventDefault();
        const selected = ratings[itemId];

        if (!selected || !selected.rating) return;

        try {
            setIsSubmitting(true);
            router.post(route("dashboard.rate.user"), {
                rateable_id: itemId,
                rateable_type: type,
                rating: parseInt(selected.rating),
            });

            toast.success("Rating submitted successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Error submitting rating");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
            <h2 className="font-medium text-gray-900 mb-4">User Reviews</h2>

            {/* Sales Section */}
            {sales && sales.length > 0 ? (
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Sales</h3>
                    {sales.map((sale) => (
                        <div
                            key={sale.id}
                            className="border p-4 rounded shadow-sm bg-yellow-50"
                        >
                            <p className="font-semibold">
                                Sold to: {sale.buyer.name}
                            </p>
                            <p className="text-gray-800">
                                Figurine:{" "}
                                <span className="italic">
                                    {sale.listing.figurine.name}{" "}
                                    {sale.listing.figurine.text}{" "}
                                </span>
                            </p>
                            <p
                                className={`font-medium ${
                                    sale.is_rated
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {sale.is_rated ? "Rated" : "Not yet rated"}
                            </p>

                            {/* Seller rates buyer */}
                            {sale.seller.id === auth.user.id &&
                                !sale.is_rated && (
                                    <form
                                        onSubmit={(e) =>
                                            handleRatingSubmit(
                                                e,
                                                sale.id,
                                                "sale"
                                            )
                                        }
                                        className="mt-2 space-y-2"
                                    >
                                        <label className="block text-sm font-medium text-gray-700">
                                            Rate buyer
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <select
                                                className="border rounded px-2 py-1"
                                                required
                                                value={
                                                    ratings[sale.id]?.rating ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    setRatings((prev) => ({
                                                        ...prev,
                                                        [sale.id]: {
                                                            rating: e.target
                                                                .value,
                                                            target: "buyer",
                                                        },
                                                    }))
                                                }
                                            >
                                                <option value="" disabled>
                                                    Select rating
                                                </option>
                                                {[1, 2, 3, 4, 5].map((num) => (
                                                    <option
                                                        key={num}
                                                        value={num}
                                                    >
                                                        {num}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                type="submit"
                                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                                disabled={isSubmitting}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                )}

                            {/* Buyer rates seller */}
                            {sale.buyer.id === auth.user.id &&
                                !sale.is_rated && (
                                    <form
                                        onSubmit={(e) =>
                                            handleRatingSubmit(
                                                e,
                                                sale.id,
                                                "sale"
                                            )
                                        }
                                        className="mt-2 space-y-2"
                                    >
                                        <label className="block text-sm font-medium text-gray-700">
                                            Rate seller
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <select
                                                className="border rounded px-2 py-1"
                                                required
                                                value={
                                                    ratings[sale.id]?.rating ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    setRatings((prev) => ({
                                                        ...prev,
                                                        [sale.id]: {
                                                            rating: e.target
                                                                .value,
                                                            target: "seller",
                                                        },
                                                    }))
                                                }
                                            >
                                                <option value="" disabled>
                                                    Select rating
                                                </option>
                                                {[1, 2, 3, 4, 5].map((num) => (
                                                    <option
                                                        key={num}
                                                        value={num}
                                                    >
                                                        {num}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                type="submit"
                                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                                disabled={isSubmitting}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="font-small text-gray-900">No sales yet.</p>
            )}

            {/* Trades Section */}
            {trades && trades.length > 0 ? (
                <div className="space-y-4 mt-8">
                    <h3 className="font-semibold text-lg">Trades</h3>
                    {trades.map((trade) => (
                        <div
                            key={trade.id}
                            className="border p-4 rounded shadow-sm bg-yellow-50"
                        >
                            <p className="font-semibold">
                                Trade between: {trade.seller.name} and{" "}
                                {trade.buyer.name}
                            </p>
                            <p className="text-gray-800">
                                Figurine:{" "}
                                <span className="italic">
                                    {trade.listing.figurine.name}{" "}
                                    {trade.listing.figurine.text}
                                </span>
                            </p>

                            <p
                                className={`font-medium ${
                                    trade.is_rated
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {trade.is_rated ? "Rated" : "Not yet rated"}
                            </p>

                            {/* Seller rates buyer */}
                            {trade.seller.id === auth.user.id &&
                                !trade.is_rated && (
                                    <form
                                        onSubmit={(e) =>
                                            handleRatingSubmit(
                                                e,
                                                trade.id,
                                                "trade"
                                            )
                                        }
                                        className="mt-2 space-y-2"
                                    >
                                        <label className="block text-sm font-medium text-gray-700">
                                            Rate buyer
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <select
                                                className="border rounded px-2 py-1"
                                                required
                                                value={
                                                    ratings[trade.id]?.rating ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    setRatings((prev) => ({
                                                        ...prev,
                                                        [trade.id]: {
                                                            rating: e.target
                                                                .value,
                                                            target: "buyer",
                                                        },
                                                    }))
                                                }
                                            >
                                                <option value="" disabled>
                                                    Select rating
                                                </option>
                                                {[1, 2, 3, 4, 5].map((num) => (
                                                    <option
                                                        key={num}
                                                        value={num}
                                                    >
                                                        {num}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                type="submit"
                                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                                disabled={isSubmitting}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                )}

                            {/* Buyer rates seller */}
                            {trade.buyer.id === auth.user.id &&
                                !trade.is_rated && (
                                    <form
                                        onSubmit={(e) =>
                                            handleRatingSubmit(
                                                e,
                                                trade.id,
                                                "trade"
                                            )
                                        }
                                        className="mt-2 space-y-2"
                                    >
                                        <label className="block text-sm font-medium text-gray-700">
                                            Rate seller
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <select
                                                className="border rounded px-2 py-1"
                                                required
                                                value={
                                                    ratings[trade.id]?.rating ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    setRatings((prev) => ({
                                                        ...prev,
                                                        [trade.id]: {
                                                            rating: e.target
                                                                .value,
                                                            target: "seller",
                                                        },
                                                    }))
                                                }
                                            >
                                                <option value="" disabled>
                                                    Select rating
                                                </option>
                                                {[1, 2, 3, 4, 5].map((num) => (
                                                    <option
                                                        key={num}
                                                        value={num}
                                                    >
                                                        {num}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                type="submit"
                                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                                disabled={isSubmitting}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="font-small text-gray-900">No trades yet.</p>
            )}
        </div>
    );
};

export default ReviewsTab;
