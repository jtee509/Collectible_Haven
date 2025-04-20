import { useState, useEffect } from "react";
import ApplicationLogoDashboard from "@/Components/ApplicationLogoDashboard";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import { Link, usePage, router } from "@inertiajs/react";
import { BellAlertIcon, HeartIcon } from "@heroicons/react/24/outline";
import {
    HomeIcon,
    ChartBarIcon,
    UserCircleIcon,
    SparklesIcon,
    ArrowsRightLeftIcon,
} from "@heroicons/react/24/solid"; // or `/outline` if you prefer

export default function AuthenticatedLayout({ header, children }) {
    const { auth, notifications: initialNotifications } = usePage().props;
    const [notifications, setNotifications] = useState(initialNotifications);
    const user = auth.user;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isWishlist, setIsWishlist] = useState(false); // State to track wishlist status
    const [newNotifications, setNewNotifications] = useState(true); // Track new notifications
    const [showNotifications, setShowNotifications] = useState(false); // State for notification dropdown visibility

    const unreadNotifications = notifications.filter(
        (notification) => !notification.is_read
    );

    useEffect(() => {
        const markAllAsRead = async () => {
            if (showNotifications && unreadNotifications.length > 0) {
                for (const notification of unreadNotifications) {
                    await router.post(
                        `/notifications/${notification.id}/mark-as-read`,
                        {},
                        {
                            preserveScroll: true,
                            only: [],
                        }
                    );
                }

                // After marking all as read, update local state
                setNotifications((prev) =>
                    prev.map((n) =>
                        unreadNotifications.some((u) => u.id === n.id)
                            ? { ...n, is_read: true }
                            : n
                    )
                );
            }
        };

        markAllAsRead();
    }, [showNotifications]);

    useEffect(() => {
        setNewNotifications(notifications.some((n) => !n.is_read));
    }, [notifications]);

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`fixed z-30 inset-y-0 left-0 w-64 bg-white border-r transform ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-200 ease-in-out sm:translate-x-0 flex flex-col justify-between`}
            >
                <div className="p-4 border-b h-16">
                    <Link href="/dashboard">
                        <ApplicationLogoDashboard className="h-9 w-auto fill-current text-gray-800" />
                    </Link>
                </div>

                {/* Sidebar nav items stacked vertically */}
                <div className="flex flex-col h-full justify-between">
                    <nav className="flex flex-col gap-2 p-4">
                        <NavLink
                            href={route("dashboard")}
                            active={route().current("dashboard")}
                            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 text-gray-700"
                        >
                            <HomeIcon className="w-5 h-5" />
                            Products
                        </NavLink>
                        <NavLink
                            href={route("dashboard.statistics")}
                            active={route().current("dashboard.statistics")}
                            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 text-gray-700"
                        >
                            <ChartBarIcon className="w-5 h-5" />
                            Statistics
                        </NavLink>
                        <NavLink
                            href={route("dashboard.ai")}
                            active={route().current("dashboard.ai")}
                            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 text-gray-700"
                        >
                            <SparklesIcon className="w-5 h-5" />
                            AI-Suggestions
                        </NavLink>
                        <NavLink
                            href={route("dashboard.listings")}
                            active={route().current("dashboard.listings")}
                            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 text-gray-700"
                        >
                            <ArrowsRightLeftIcon className="w-5 h-5" />
                            Trade & Sell
                        </NavLink>
                    </nav>

                    {/* Bottom sidebar links */}
                    <nav className="flex flex-col gap-2 p-4 border-t">
                        <NavLink
                            href={route("profile.edit")}
                            active={route().current("profile.edit")}
                            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 text-gray-700"
                        >
                            <UserCircleIcon className="w-5 h-5" />
                            Profile
                        </NavLink>
                        <NavLink
                            href="/"
                            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 text-gray-700"
                        >
                            <SparklesIcon className="w-5 h-5" />
                            Marketplace
                        </NavLink>
                    </nav>
                </div>
            </aside>

            {/* Overlay on mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-30 z-20 sm:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Main content area */}
            <div
                className={`flex flex-col flex-1 transition-all duration-200 ease-in-out sm:ml-64`}
            >
                {/* Top bar */}
                <header className="flex items-center justify-between bg-white px-4 sm:px-6 lg:px-8 h-16">
                    <div className="flex items-center">
                        {/* Sidebar toggle button on mobile */}
                        <button
                            className="sm:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>

                        {/* Optional header content */}
                        {header && <div className="ml-4">{header}</div>}
                    </div>

                    {/* User dropdown */}
                    <div className="flex items-center space-x-2">
                        {/* Notification Bell */}
                        <div className="relative">
                            <button
                                className="relative text-gray-600 hover:text-gray-800 mt-[7.25px]"
                                onClick={() =>
                                    setShowNotifications(!showNotifications)
                                }
                            >
                                <BellAlertIcon className="w-6 h-6" />
                                {newNotifications && (
                                    <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-red-600 rounded-full"></span>
                                )}
                            </button>

                            {/* Notification Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md z-50">
                                    <div className="p-2 max-h-64 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="text-gray-500 text-sm p-2">
                                                No new notifications
                                            </div>
                                        ) : (
                                            notifications.map(
                                                (notification) => (
                                                    <div
                                                        key={notification.id}
                                                        className="text-sm text-gray-700 border-b p-2"
                                                    >
                                                        {notification.message ??
                                                            JSON.stringify(
                                                                notification.message
                                                            )}
                                                        <div className="text-xs text-gray-400">
                                                            {
                                                                notification.created_at
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Wishlist Heart Icon as Link */}
                        <Link
                            href={route("dashboard.wishlist")}
                            className="relative text-gray-600 hover:text-gray-800"
                        >
                            <HeartIcon className="w-6 h-6" />
                            {isWishlist && (
                                <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-red-600 rounded-full"></span>
                            )}
                        </Link>
                        {/* User name with reduced margin */}
                        <span className="hidden sm:inline text-gray-700 text-sm mr-2">
                            {" "}
                            {/* Added mr-2 to reduce space */}
                            {user.name}
                        </span>
                        <Dropdown>
                            <Dropdown.Trigger>
                                <span className="inline-flex rounded-md">
                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </span>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <Dropdown.Link href={route("profile.edit")}>
                                    Profile
                                </Dropdown.Link>
                                <Dropdown.Link
                                    method="post"
                                    href={route("logout")}
                                    as="button"
                                >
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
}
