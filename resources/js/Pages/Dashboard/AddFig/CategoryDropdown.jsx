import React from "react";

const categoryOptions = [
    "MEGA 400%",
    "Bag",
    "Figurine",
    "Blind Box",
    "Pendant Blind Box",
    "Plush Dolls",
    "MEGA 1000%",
    "Fridge Magnet",
    "Phone Accessories",
    "Others",
    "Cotton Doll",
    "Cable Blind Box",
    "Action Figure",
    "Earphone Storage",
    "Cup",
    "Badge",
];

const CategoryDropdown = ({
    value,
    onChange,
    name = "category",
    required = false,
}) => {
    return (
        <div className="mb-4">
            <label htmlFor={name} className="block font-medium text-gray-700">
                Category
            </label>
            <select
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                required={required}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
                <option value="">Select a category</option>
                {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                        {category}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CategoryDropdown;
