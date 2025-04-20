import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PhotoIcon, TrashIcon } from "@heroicons/react/24/solid";
import CategoryDropdown from "./CategoryDropdown";

export default function EditFigurine({ figurine }) {
    console.log(figurine);
    const [form, setForm] = useState({
        name: figurine.name || "",
        text: figurine.text || "",
        description: figurine.description || "",
        category: figurine.category || "",
        quantity: figurine.quantity || "",
        rarity: figurine.rarity || false,
        price: figurine.price || "",
        purchase_date: figurine.purchase_date || "",
        condition: figurine.condition || "new",
        is_tradeable: figurine.is_tradeable || false,
        photos: figurine.photos || [], // Current photos from DB
        newPhotos: [], // New photos to upload
    });

    const [newPhotoPreviews, setNewPhotoPreviews] = useState([]);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            photos: figurine.photos || [],
        }));
    }, [figurine]);

    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            photos: figurine.photos || [],
            purchase_date: figurine.purchase_date || "",
            condition: figurine.condition || "new",
        }));
    }, [figurine]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleCategorySelect = (category) => {
        setForm((prev) => ({
            ...prev,
            category,
        }));
    };

    const conditions = [
        { value: "new", label: "New" },
        { value: "used", label: "Used" },
    ];

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setForm((prev) => ({
            ...prev,
            newPhotos: [...prev.newPhotos, ...files],
        }));

        // Generate preview URLs
        const previews = files.map((file) => URL.createObjectURL(file));
        setNewPhotoPreviews((prev) => [...prev, ...previews]);
    };

    const handlePhotoDelete = (photoId) => {
        setForm((prev) => ({
            ...prev,
            photos: prev.photos.filter((photo) => photo.id !== photoId),
        }));
    };

    const handleNewPhotoDelete = (index) => {
        setForm((prev) => ({
            ...prev,
            newPhotos: prev.newPhotos.filter((_, i) => i !== index),
        }));
        setNewPhotoPreviews((prev) => prev.filter((_, i) => i !== index));

        // Revoke the object URL to avoid memory leaks
        URL.revokeObjectURL(newPhotoPreviews[index]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        // Check if price is a negative value
        if (parseFloat(form.price) < 0) {
            setErrors((prev) => ({
                ...prev,
                price: "Price cannot be negative",
            }));
            setProcessing(false);
            return;
        }

        const formData = new FormData();

        // Append basic fields
        formData.append("name", form.name);
        formData.append("text", form.text);
        formData.append("description", form.description);
        formData.append("quantity", form.quantity);
        formData.append("category", form.category);
        formData.append("rarity", form.rarity ? 1 : 0);
        formData.append("purchase_date", form.purchase_date);
        formData.append("condition", form.condition);
        formData.append("price", String(form.price));
        formData.append("is_tradeable", form.is_tradeable ? 1 : 0);

        // Append existing photos to keep
        form.photos.forEach((photo) => {
            formData.append("existing_photos[]", photo.id);
        });

        // Append new photos
        if (form.newPhotos && form.newPhotos.length > 0) {
            form.newPhotos.forEach((photo) => {
                formData.append("photos[]", photo);
            });
        }
        router.post(route("figurines.update", figurine.id), formData, {
            forceFormData: true,
            onSuccess: () => {
                setErrors({});
                // Clean up object URLs
                newPhotoPreviews.forEach((preview) =>
                    URL.revokeObjectURL(preview)
                );
                setNewPhotoPreviews([]);
            },
            onError: (err) => {
                console.error("Validation errors:", err);
                setErrors(err);
            },
            onFinish: () => setProcessing(false),
        });
    };

    // Clean up object URLs when component unmounts
    useEffect(() => {
        return () => {
            newPhotoPreviews.forEach((preview) => URL.revokeObjectURL(preview));
        };
    }, [newPhotoPreviews]);

    return (
        <AuthenticatedLayout>
            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                            Edit Figurine
                        </h2>
                        <form
                            onSubmit={handleSubmit}
                            encType="multipart/form-data"
                            className="space-y-5"
                        >
                            {/* Name Field */}
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

                            {/* Description Field */}
                            <div>
                                <label className="block text-gray-700 font-medium">
                                    Name
                                </label>
                                <input
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

                            {/* Description Field */}
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

                            {/* Category and Rarity Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <CategoryDropdown
                                        value={form.category}
                                        onChange={handleChange}
                                    />
                                    {errors.category && (
                                        <p className="text-red-500 text-sm">
                                            {errors.category}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 mt-6">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            name="rarity"
                                            checked={form.rarity}
                                            onChange={handleChange}
                                            className="w-5 h-5 text-blue-600 border-gray-300 rounded"
                                        />
                                        <span className="ml-2 text-gray-700 font-medium">
                                            Rare Item
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Purchase Date and Condition */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium">
                                        Purchase Date
                                    </label>
                                    <input
                                        type="date"
                                        name="purchase_date"
                                        value={form.purchase_date}
                                        onChange={handleChange}
                                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                    {errors.purchase_date && (
                                        <p className="text-red-500 text-sm">
                                            {errors.purchase_date}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium">
                                        Condition
                                    </label>
                                    <select
                                        name="condition"
                                        value={form.condition}
                                        onChange={handleChange}
                                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    >
                                        {conditions.map((cond) => (
                                            <option
                                                key={cond.value}
                                                value={cond.value}
                                            >
                                                {cond.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.condition && (
                                        <p className="text-red-500 text-sm">
                                            {errors.condition}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Price Field */}
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

                            {/* Photos Preview and Upload */}
                            <div>
                                <label className="block text-gray-700 font-medium">
                                    Upload Photos
                                </label>
                                <div className="mt-1">
                                    <div className="grid grid-cols-3 gap-4">
                                        {/* Existing photos */}
                                        {form.photos.map((photo) => (
                                            <div
                                                key={photo.id}
                                                className="relative"
                                            >
                                                <img
                                                    src={`/storage/${photo.path}`}
                                                    alt="Preview"
                                                    className="w-full h-60 object-cover rounded-md"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handlePhotoDelete(
                                                            photo.id
                                                        )
                                                    }
                                                    className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}

                                        {/* New photo previews */}
                                        {newPhotoPreviews.map(
                                            (preview, index) => (
                                                <div
                                                    key={`new-${index}`}
                                                    className="relative"
                                                >
                                                    <img
                                                        src={preview}
                                                        alt="New preview"
                                                        className="w-full h-60 object-cover rounded-md"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleNewPhotoDelete(
                                                                index
                                                            )
                                                        }
                                                        className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                                                    >
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    <div className="mt-4 flex items-center gap-4">
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
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
                            >
                                {processing ? "Uploading..." : "Save Changes"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
