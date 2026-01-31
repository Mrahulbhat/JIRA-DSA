import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, TrendingUp, Trophy, Target, Home } from "lucide-react";
import { axiosInstance } from "../lib/axios";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [pendingChallenges, setPendingChallenges] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchPending = async () => {
            try {
                const res = await axiosInstance.get("/challenges/pending-count");
                if (res.data?.success && typeof res.data.pendingReceived === "number") {
                    setPendingChallenges(res.data.pendingReceived);
                }
            } catch {
                setPendingChallenges(0);
            }
        };
        fetchPending();
    }, [location.pathname]);

    const tabs = [
        { name: "Dashboard", icon: Home, path: "/dashboard", id: "dashboard" },
        { name: "My Problems", icon: TrendingUp, path: "/myProblems", id: "myProblems" },
        { name: "Leaderboard", icon: Trophy, path: "/leaderboard", id: "leaderboard" },
        { name: "Challenges", icon: Target, path: "/challenges", id: "challenges", badge: pendingChallenges },
    ];

    const handleNavigation = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-20 left-4 z-50 p-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg md:hidden"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar */}
            <div id="sidebar"
                className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gradient-to-b from-gray-900 via-gray-900 to-black border-r border-gray-700/50 backdrop-blur-sm z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0 md:relative md:top-0 md:h-auto md:w-64 md:z-30`}
            >
                <div className="p-6 space-y-2">
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">
                        Navigation
                    </h3>

                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const active = isActive(tab.path);
                        const badgeCount = tab.badge ?? 0;

                        return (
                            <button
                                id={tab.id}
                                key={tab.id}
                                onClick={() => handleNavigation(tab.path)}
                                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-300 transform ${active
                                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/25 scale-105"
                                        : "text-gray-400 hover:text-white hover:bg-gray-800/50 hover:translate-x-1"
                                    }`}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    <span className="font-semibold text-sm truncate">{tab.name}</span>
                                </div>
                                {badgeCount > 0 && (
                                    <span className="flex-shrink-0 min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center rounded-full bg-amber-500 text-black text-xs font-bold animate-pulse">
                                        {badgeCount > 99 ? "99+" : badgeCount}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 top-16 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </>
    );
};

export default Sidebar;
