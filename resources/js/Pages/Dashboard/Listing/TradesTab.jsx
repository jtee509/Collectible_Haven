import React from "react";
import { useForm } from "@inertiajs/react";

const TradesTab = ({ openTrades, auth }) => {
    const { post } = useForm();

    const handleAcceptTrade = (tradeId) => {
        post(route("trade.accepted", tradeId));
    };

    const handleDeclineTrade = (tradeId) => {
        post(route("trade.rejected", tradeId));
    };

    return (
        <>
            {openTrades && openTrades.length > 0 ? (
                <div className="bg-yellow-100 p-4 rounded shadow mb-6">
                    <h2 className="text-lg font-bold mb-2">Trade Proposals</h2>
                    {openTrades.map((openTrade) => (
                        <div key={openTrade.id}>
                            <p className="mb-1">
                                <span className="font-semibold">From:</span>{" "}
                                {openTrade.buyer?.name}
                            </p>

                            <p className="mb-1">
                                <span className="font-semibold">
                                    Your Listing:
                                </span>{" "}
                                {openTrade.listing?.figurine?.name}{" "}
                                {openTrade.listing?.figurine?.text}– RM{" "}
                                {openTrade.listing?.price}
                            </p>

                            <p className="font-semibold mt-4">
                                Proposed Figurines in Trade:
                            </p>
                            <ul className="list-disc list-inside">
                                {openTrade.figurines?.map((fig) => (
                                    <li key={fig.id}>
                                        <div className="flex items-center gap-2">
                                            <span>
                                                {fig.name} {fig.text} (
                                                {fig.category}) – RM {fig.price}
                                            </span>
                                            {fig.rarity && (
                                                <span className="bg-purple-600 text-white text-xs font-semibold px-2 py-0.5 rounded">
                                                    Rare
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-4 space-x-4">
                                <button
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                    onClick={() =>
                                        handleAcceptTrade(openTrade.id)
                                    }
                                >
                                    Accept
                                </button>
                                <button
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                    onClick={() =>
                                        handleDeclineTrade(openTrade.id)
                                    }
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No open trade proposals.</p>
            )}
        </>
    );
};

export default TradesTab;
