"use client";
import React, { useState, ChangeEvent } from "react";
import { useAuth } from "./cotexts/AuthContext";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import AuthPortal from "./AuthPortal";

const AuthTabs = {
  Login: "login",
  Register: "register",
};

const Navbar = () => {
  const currentRoute = usePathname();
  const { user, logout } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authTab, setAuthTab] = useState(AuthTabs.Login);

  const handleAuthDialogToggle = () => {
    setAuthDialogOpen(!authDialogOpen);
    if (!authDialogOpen) {
      setAuthTab(AuthTabs.Login);
    }
  };

  const handleLogout = () => {
    // Call the logout function when the logout button is clicked
    console.log("logout...");
    logout();
  };

  return (
    <>
      <nav className="flexBetween max-container padding-container realtive z-30 py-5">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={124} height={50} />
        </Link>
        <div className="relative lg:flex items-center">
          <input
            type="search"
            placeholder="Search..."
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 text-gray-600"
          >
            <SearchIcon />
          </button>
        </div>
        <ul className="hidden h-full gap-12 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link href={link.href} key={link.key} legacyBehavior>
              <a
                className={`regular-16 text-gray-50 flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold ${
                  currentRoute === link.href ? "text-black !font-semibold" : ""
                }`}
              >
                {link.Icon && <link.Icon className="mr-2" />}
                {link.label}
              </a>
            </Link>
          ))}
        </ul>
        <div className="lg:flexCenter hidden">
          {user?.token ? ( // Check if user token exists
            <Button
              type="button"
              title="Logout"
              icon={<PersonIcon />}
              variant="btn_logout" // Change to "btn_logout" or your appropriate variant
              onClick={handleLogout} // Call the logout function on click
            />
          ) : (
            <Button
              type="button"
              title="Login"
              icon={<PersonIcon />}
              variant="btn_login"
              onClick={handleAuthDialogToggle}
            />
          )}
        </div>
        <AuthPortal
          open={authDialogOpen}
          onClose={handleAuthDialogToggle}
          activeTab={authTab}
          onChangeActiveTab={setAuthTab}
        />{" "}
        <Image
          src="menu.svg"
          alt="menu"
          width={32}
          height={32}
          className="inline-block cursor-pointer lg:hidden"
        />
      </nav>
    </>
  );
};

export default Navbar;
