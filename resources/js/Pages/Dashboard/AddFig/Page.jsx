import React, { useState } from "react";
import { router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PhotoIcon, TrashIcon } from "@heroicons/react/24/solid";
import CategoryDropdown from "./CategoryDropdown"; // Import the CategoryDropdown component

export default function AddFigurine() {
    const [form, setForm] = useState({
        name: "",
        text: "",
        description: "",
        quantity: "",
        category: "",
        rarity: false,
        price: "",
        is_tradeable: false,
        photos: [],
        photoPreviews: [], // Store photo previews
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        const fileArray = Array.from(files);
        const newPreviews = fileArray.map((file) => URL.createObjectURL(file));

        setForm((prev) => ({
            ...prev,
            photos: [...prev.photos, ...fileArray], // Add the files to the form state
            photoPreviews: [...prev.photoPreviews, ...newPreviews], // Add the preview URLs
        }));
    };

    const handleRemovePhoto = (index) => {
        const updatedPhotos = [...form.photos];
        const updatedPreviews = [...form.photoPreviews];

        updatedPhotos.splice(index, 1);
        updatedPreviews.splice(index, 1);

        setForm({
            ...form,
            photos: updatedPhotos,
            photoPreviews: updatedPreviews,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        // Check if the price is a negative value
        if (parseFloat(form.price) < 0) {
            setErrors((prev) => ({
                ...prev,
                price: "Price cannot be negative.",
            }));
            setProcessing(false);
            return; // Prevent form submission
        }

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("text", form.text);
        formData.append("description", form.description);
        formData.append("quantity", form.quantity);
        formData.append("category", form.category);
        formData.append("rarity", form.rarity ? 1 : 0);
        formData.append("price", form.price);
        formData.append("is_tradeable", form.is_tradeable ? 1 : 0);

        for (let i = 0; i < form.photos.length; i++) {
            formData.append("photos[]", form.photos[i]);
        }

        router.post(route("figurines.store"), formData, {
            forceFormData: true,
            onSuccess: () => {
                setForm({
                    name: "",
                    text: "",
                    description: "",
                    category: "",
                    quantity: "",
                    rarity: false,
                    price: "",
                    is_tradeable: false,
                    photos: [],
                    photoPreviews: [],
                });
                setErrors({});
            },
            onError: (err) => {
                setErrors(err);
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AuthenticatedLayout>
            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                            Add New Figurine
                        </h2>
                        <form
                            onSubmit={handleSubmit}
                            encType="multipart/form-data"
                            className="space-y-5"
                        >
                            <div>
                                <label className="block text-gray-700 font-medium">
                                    Figurine Series
                                </label>
                                <select
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select Name</option>
                                    <option value="Molly">Molly</option>
                                    <option value="Hirono">Hirono</option>
                                    <option value="Dimoo">Dimoo</option>
                                </select>
                                {errors.name && (
                                    <p className="text-red-500 text-sm">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="text"
                                        value={form.text}
                                        onChange={handleChange}
                                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.text && (
                                        <p className="text-red-500 text-sm">
                                            {errors.text}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    value={form.description}
                                    onChange={handleChange}
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Category Dropdown */}
                            <div>
                                <CategoryDropdown
                                    value={form.category}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.category && (
                                    <p className="text-red-500 text-sm">
                                        {errors.category}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium">
                                        Rarity
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            name="rarity"
                                            checked={form.rarity}
                                            onChange={handleChange}
                                            className="w-5 h-5 text-blue-600 border-gray-300 rounded"
                                        />
                                        <span className="ml-2 text-gray-700 font-medium">
                                            Rare
                                        </span>
                                    </label>
                                    {errors.rarity && (
                                        <p className="text-red-500 text-sm">
                                            {errors.rarity}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium">
                                        Price (RM)
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={form.price}
                                        onChange={handleChange}
                                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.price && (
                                        <p className="text-red-500 text-sm">
                                            {errors.price}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        min="1"
                                        value={form.quantity}
                                        onChange={handleChange}
                                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.quantity && (
                                        <p className="text-red-500 text-sm">
                                            {errors.quantity}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 mt-6">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            name="is_tradeable"
                                            checked={form.is_tradeable}
                                            onChange={handleChange}
                                            className="w-5 h-5 text-blue-600 border-gray-300 rounded"
                                        />
                                        <span className="ml-2 text-gray-700 font-medium">
                                            Tradeable
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium">
                                    Upload Photos
                                </label>
                                <div className="mt-1 flex items-center gap-4">
                                    <PhotoIcon className="w-10 h-10 text-gray-400" />
                                    <input
                                        type="file"
                                        name="photos"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>
                                {errors.photos && (
                                    <p className="text-red-500 text-sm">
                                        {errors.photos}
                                    </p>
                                )}
                            </div>

                            {/* Display photo previews with X button to remove */}
                            {form.photoPreviews.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold text-gray-700">
                                        Selected Photos
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4 mt-2">
                                        {form.photoPreviews.map(
                                            (preview, index) => (
                                                <div
                                                    key={index}
                                                    className="relative w-full h-60"
                                                >
                                                    <img
                                                        src={preview}
                                                        alt={`Preview ${
                                                            index + 1
                                                        }`}
                                                        className="w-full h-60 rounded-lg"
                                                    />

                                                    <button
                                                        type="button"
                                                        className="absolute top-1 right-1 text-white bg-red-500 rounded-full p-1"
                                                        onClick={() =>
                                                            handleRemovePhoto(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-6 w-full bg-blue-600 text-white py-3 rounded-md font-semibold disabled:opacity-50"
                            >
                                {processing ? "Adding..." : "Add Figurine"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
