import React, { useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";

const MarketplaceLayout = ({ children }) => {
    const { auth } = usePage().props;
    const user = auth.user;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/">
                        <ApplicationLogo className="h-9 w-auto fill-current text-gray-800" />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-4">
                        {user ? (
                            <Link
                                href={route("dashboard")}
                                className="rounded-md px-3 py-2 text-black"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className="rounded-md px-3 py-2 text-gray-800"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="rounded-md px-3 py-2 text-gray-800"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Burger Menu */}
                    <button
                        className="md:hidden text-gray-800"
                        onClick={toggleMenu}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                <div
                    className={`${
                        isMenuOpen ? "block" : "hidden"
                    } md:hidden absolute top-20 left-0 w-full bg-white shadow-lg py-4 px-6 space-y-4`}
                >
                    {user ? (
                        <Link
                            href={route("dashboard")}
                            className="block text-black"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route("login")}
                                className="block text-gray-800"
                            >
                                Log in
                            </Link>
                            <Link
                                href={route("register")}
                                className="block text-gray-800"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 py-10">
                <div className="max-w-7xl mx-auto px-4">{children}</div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t mt-10">
                <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between text-sm text-gray-500">
                    <span>
                        &copy; 2025 CollectionHaven. All rights reserved.
                    </span>
                    <div className="space-x-4">
                        {auth.user ? (
                            <Link
                                href={route("dashboard")}
                                className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className="rounded-md px-3 py-2 text-gray-800 ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="rounded-md px-3 py-2 text-gray-800 ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MarketplaceLayout;
