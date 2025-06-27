import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

function CommonNavbar() {
    const { isAuthenticated, logout } = useAuth();

    const navItems = [
        { label: "Home", to: "/" },
        { label: "About", to: "/about" },
        { label: "Contact", to: "/contact" },
        

        // Conditional items
        ...(isAuthenticated
            ? [{ label: "Logout", to: "", onClick: logout }, { label: "Profile", to: "/profile" },]
            : [
                { label: "Login", to: "/login" },
                { label: "Register", to: "/register" },
            ]),
    ];

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen((prev) => !prev);

    const activeLinkClasses =
        "text-rose-gold border-b-4 border-rose-gold font-semibold";
    const inactiveLinkClasses =
        "text-brushed-silver hover:text-rose-gold font-semibold transition duration-300";

    return (
        <nav className="bg-pearl-white border-b-2 border-brushed-silver shadow-md">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <NavLink
                        to="/"
                        className="flex items-center py-4 px-2 font-semibold text-charcoal-black text-lg tracking-wide"
                        onClick={() => setIsOpen(false)}
                    >
                        RDJ Cookie Auth
                    </NavLink>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex space-x-6">
                        {navItems.map(({ label, to, onClick }) => {
                            if (label === "Logout") {
                                return (
                                    <button
                                        key={label}
                                        onClick={() => {
                                            if (onClick) onClick();
                                            setIsOpen(false);
                                        }}
                                        className="py-4 px-2 text-brushed-silver hover:text-rose-gold font-semibold transition duration-300 cursor-pointer"
                                    >
                                        {label}
                                    </button>
                                );
                            }
                            return (
                                <NavLink
                                    key={to}
                                    to={to}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        `py-4 px-2 transition duration-300 ${isActive ? activeLinkClasses : inactiveLinkClasses
                                        }`
                                    }
                                >
                                    {label}
                                </NavLink>
                            );
                        })}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden focus:outline-none"
                        aria-label="Toggle menu"
                        aria-expanded={isOpen}
                    >
                        <svg
                            className="w-6 h-6 text-gunmetal-gray"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {isOpen ? (
                                // Close icon
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                // Hamburger icon
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu with animation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="md:hidden overflow-hidden bg-pearl-white border-t border-brushed-silver"
                    >
                        {navItems.map(({ label, to, onClick }) => {
                            if (label === "Logout") {
                                return (
                                    <button
                                        key={label}
                                        onClick={() => {
                                            if (onClick) onClick();
                                            setIsOpen(false);
                                        }}
                                        className="block w-full text-left py-3 px-5 text-charcoal-black text-base font-medium hover:bg-rose-gold hover:text-pearl-white transition-colors cursor-pointer"
                                    >
                                        {label}
                                    </button>
                                );
                            }
                            return (
                                <NavLink
                                    key={to}
                                    to={to}
                                    className={({ isActive }) =>
                                        `block py-3 px-5 text-charcoal-black text-base font-medium transition-colors ${isActive
                                            ? "bg-rose-gold text-pearl-white"
                                            : "hover:bg-rose-gold hover:text-pearl-white"
                                        }`
                                    }
                                    onClick={() => setIsOpen(false)}
                                >
                                    {label}
                                </NavLink>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

export default CommonNavbar;
