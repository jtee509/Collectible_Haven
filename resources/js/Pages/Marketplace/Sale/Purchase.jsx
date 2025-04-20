import React, { useState } from "react";
import { router } from "@inertiajs/react";
import MarketplaceLayout from "@/Layouts/MarketplaceLayout";

const Purchase = ({ auth, listing }) => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("");
    const [cardholder, setCardholder] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");
    const [quantity, setQuantity] = useState(1);

    const formatCardNumber = (value) => {
        const digits = value.replace(/\D/g, "").slice(0, 16);
        return digits.replace(/(.{4})/g, "$1 ").trim();
    };

    const formatExpiry = (value) => {
        const digits = value.replace(/\D/g, "").slice(0, 4);
        if (digits.length >= 3) {
            return digits.slice(0, 2) + "/" + digits.slice(2);
        }
        return digits;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const cardNumberValid = /^\d{16}$/.test(cardNumber.replace(/\s/g, ""));
        const expiryValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry);
        const cvcValid = /^\d{3}$/.test(cvc);

        if (!cardNumberValid || !expiryValid || !cvcValid) {
            alert("Please check your payment details.");
            return;
        }

        if (quantity < 1 || quantity > listing.stock) {
            alert("Please enter a valid quantity.");
            return;
        }

        router.post(`/purchase/${listing.id}`, {
            name,
            address,
            city,
            postal_code: postalCode,
            country,
            cardholder,
            card_number: cardNumber.replace(/\s/g, ""),
            expiry,
            cvc,
            quantity,
        });
    };

    return (
        <MarketplaceLayout auth={auth}>
            <div className="max-w-6xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left Column: Form */}
                <div>
                    <h1 className="text-2xl font-bold mb-6">
                        Complete Your Purchase
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Shipping Info */}
                        <div>
                            <h2 className="text-xl font-semibold mb-2">
                                Shipping Details
                            </h2>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full border p-2 rounded"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Street Address"
                                    className="w-full border p-2 rounded"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="City"
                                    className="w-full border p-2 rounded"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                />
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="Postal Code"
                                        className="w-full border p-2 rounded"
                                        value={postalCode}
                                        onChange={(e) =>
                                            setPostalCode(e.target.value)
                                        }
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Country"
                                        className="w-full border p-2 rounded"
                                        value={country}
                                        onChange={(e) =>
                                            setCountry(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div>
                            <h2 className="text-xl font-semibold mb-2">
                                Payment Information
                            </h2>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Cardholder Name"
                                    className="w-full border p-2 rounded"
                                    value={cardholder}
                                    onChange={(e) =>
                                        setCardholder(e.target.value)
                                    }
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Card Number"
                                    className="w-full border p-2 rounded"
                                    value={cardNumber}
                                    onChange={(e) =>
                                        setCardNumber(
                                            formatCardNumber(e.target.value)
                                        )
                                    }
                                    maxLength="19"
                                    required
                                />
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        className="w-full border p-2 rounded"
                                        value={expiry}
                                        onChange={(e) =>
                                            setExpiry(
                                                formatExpiry(e.target.value)
                                            )
                                        }
                                        maxLength="5"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="CVC"
                                        className="w-full border p-2 rounded"
                                        value={cvc}
                                        onChange={(e) => setCvc(e.target.value)}
                                        maxLength="3"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Quantity Input */}
                        <div>
                            <h2 className="text-xl font-semibold mb-2">
                                Quantity
                            </h2>
                            <input
                                type="number"
                                min="1"
                                max={listing.stock}
                                value={quantity}
                                onChange={(e) =>
                                    setQuantity(parseInt(e.target.value))
                                }
                                className="w-full border p-2 rounded"
                                required
                            />
                            <p className="text-sm text-gray-500">
                                Available: {listing.stock} unit
                                {listing.stock > 1 ? "s" : ""}
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
                        >
                            Pay Now
                        </button>
                    </form>
                </div>

                {/* Right Column: Figurine Details */}
                <div className="bg-gray-100 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">
                        Figurine Details
                    </h2>

                    <p className="font-bold text-lg">
                        {listing.figurine?.name} {listing.figurine?.text}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                        Category: {listing.figurine?.category}
                    </p>

                    <p className="text-green-700 text-lg font-semibold mb-2">
                        Price: RM {listing.price}
                    </p>

                    <p className="text-green-700 text-lg font-semibold mb-2">
                        Stock: {listing.stock}
                    </p>

                    {/* Optional: total price */}
                    <p className="text-lg text-gray-800 mt-2">
                        Total:{" "}
                        <span className="font-semibold">
                            RM {(listing.price * quantity).toFixed(2)}
                        </span>
                    </p>

                    <p className="text-gray-700 text-sm mt-4">
                        {listing.figurine?.details}
                    </p>
                </div>
            </div>
        </MarketplaceLayout>
    );
};

export default Purchase;
