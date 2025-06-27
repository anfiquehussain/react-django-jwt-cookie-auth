import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDarkMode } from "../../hooks/useDarkMode";
import { MdWbSunny, MdNightsStay, MdComputer } from "react-icons/md";
import { HiMenu, HiX } from "react-icons/hi";

const themes = [
  { label: "Light", value: "light", icon: <MdWbSunny /> },
  { label: "Dark", value: "dark", icon: <MdNightsStay /> },
  { label: "System", value: "system", icon: <MdComputer /> },
];

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { mode, setThemeMode } = useDarkMode();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Top Locations", to: "/toplocations" },
    { label: "Users", to: "/users" },
    ...(isAuthenticated
      ? [
        { label: "Profile", to: "/profile" },
        { label: "Logout", to: "#", onClick: logout },
      ]
      : [
        { label: "Login", to: "/login" },
        { label: "Register", to: "/register" },
      ]),
  ];

  const currentTheme = themes.find((t) => t.value === mode);

  return (
    <header className="border-b-2 border-brushed-silve px-4 py-4 flex justify-between items-center flex-wrap">
      <div className="font-bold text-2xl">RDJ Cookie Auth</div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-text dark:text-text focus:outline-none"
          aria-label="Toggle menu"
        >
          {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav
        className={`w-full md:w-auto flex-col md:flex-row md:flex items-start  
          md:items-center gap-4 md:gap-6 mt-4 md:mt-0 
          ${menuOpen ? 
          "flex" : 
          "hidden md:flex"
          }`}
      >
        {navItems.map(({ label, to, onClick }) =>
          onClick ? (
            <button
              key={label}
              onClick={() => {
                onClick();
                setMenuOpen(false);
              }}
              className="text-text text-left transition-all duration-300 ease-in-out md:ml-0 hover:ml-1 md:hover:ml-0"
              type="button"
            >
              {label}
            </button>
          
          ) : (

              <NavLink
                key={label}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `text-left transition-all duration-300 ease-in-out md:ml-0 hover:ml-1 md:hover:ml-0 ${isActive ? "bg-primary-200 dark:bg-primary-200 px-2 py-1 rounded font-bold" : "hover:bg-primary-200 dark:hover:bg-primary-200 px-2 py-1 rounded"
                  }`
                }
              >
                {label}
              </NavLink>

          
          )
        )}


        {/* Theme Selector Dropdown */}
        <div className="relative mt-2 md:mt-0" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1 rounded border border-text-300 text dark:border-text-300 focus:outline-none"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            {currentTheme?.icon}
            <span>{currentTheme?.label}</span>
            <svg
              className={`w-4 h-4 ml-1 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""
                }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <ul
              role="menu"
              className="absolute right-0 mt-1 w-32 bg-main-background-500 dark:bg-main-background-500 border border-text-300 dark:border-text-300 rounded shadow-lg z-50"
            >
              {themes.map(({ label, value, icon }) => (
                <li
                  key={value}
                  onClick={() => {
                    setThemeMode(value);
                    setDropdownOpen(false);
                    setMenuOpen(false);
                  }}
                  role="menuitem"
                  className={`cursor-pointer flex items-center gap-2 px-3 py-2 hover:bg-background-200 hover:text-main-text-500 ${mode === value
                      ? "bg-background-200 text-main-text-500"
                      : ""
                    }`}
                >
                  {icon}
                  {label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
