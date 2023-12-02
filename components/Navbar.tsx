"use client";
import React, { useState, ChangeEvent } from "react";
import { useAuth } from "./cotexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { NAV_LINKS } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AuthPortal from "./AuthPortal";

const AuthTabs = {
  Login: "login",
  Register: "register",
};

const Navbar = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const currentRoute = usePathname();
  const { user, logout, authDialogOpen, toggleAuthDialog } = useAuth();
  const [authTab, setAuthTab] = useState(AuthTabs.Login);

  const handleAuthDialogToggle = () => {
    if (!authDialogOpen) {
      setAuthTab(AuthTabs.Login);
      toggleAuthDialog();
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleProfileClick = () => {
    if (!user?.token) {
      toggleAuthDialog(); // Also toggle the dialog open
    } else {
      router.push("/profile"); // Navigate to Profile if logged in
    }
  };

  const handleLogout = () => {
    // Call the logout function when the logout button is clicked
    logout();
  };

  return (
    <>
      <nav className="flexBetween max-container px-2 realtive z-30 py-5">
        <Link href="/" className="">
          <Image src="/logo.png" alt="logo" width={124} height={50} />
        </Link>
        <div className="relative lg:flex items-center mx-2">
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
          {NAV_LINKS.map((link) => {
            const isProfileLink = link.label === "Profile";
            return (
              <li
                key={link.key}
                onClick={isProfileLink ? handleProfileClick : () => {}}
              >
                {isProfileLink ? (
                  <a
                    className={`regular-16 text-gray-50 flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold ${
                      currentRoute === link.href
                        ? "text-black !font-semibold"
                        : ""
                    }`}
                  >
                    {link.Icon && <link.Icon className="mr-2" />}
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href} legacyBehavior>
                    <a
                      className={`regular-16 text-gray-50 flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold ${
                        currentRoute === link.href
                          ? "text-black !font-semibold"
                          : ""
                      }`}
                    >
                      {link.Icon && <link.Icon className="mr-2" />}
                      {link.label}
                    </a>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
        <div className="lg:flexCenter hidden">
          {user?.token ? (
            <Button
              type="button"
              title="Logout"
              icon={<PersonIcon />}
              variant="btn_logout"
              onClick={handleLogout}
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
          onClose={toggleAuthDialog}
          activeTab={authTab}
          onChangeActiveTab={setAuthTab}
        />
        <Image
          src="menu.svg"
          alt="menu"
          width={32}
          height={32}
          className="inline-block cursor-pointer lg:hidden"
          onClick={toggleSidebar}
        />
      </nav>
      <div
        className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } z-40 lg:hidden`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 text-black"
          aria-label="Close menu"
        >
          <CloseIcon />
        </button>
        <button
          onClick={toggleSidebar}
          className="text-black close-sidebar-button"
        >
          {/* Icon or text to close the sidebar */}
        </button>
        <ul className="flex flex-col h-full gap-6 p-6">
          {NAV_LINKS.map((link) => {
            const isProfileLink = link.label === "Profile";
            return (
              <li
                key={link.key}
                onClick={() => {
                  toggleSidebar(); // Always toggle the sidebar first
                  if (isProfileLink) {
                    handleProfileClick(); // Then handle the profile click
                  } else {
                    router.push(link.href); // Or navigate to the other link
                  }
                }}
                className="transition-colors duration-300 hover:text-gray-700"
              >
                {isProfileLink ? (
                  <a
                    className={`regular-16 text-gray-800 flex items-center cursor-pointer pb-1.5 ${
                      currentRoute === link.href ? "font-semibold" : ""
                    }`}
                  >
                    {link.Icon && <link.Icon className="mr-2" />}
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href} legacyBehavior>
                    <a
                      className={`regular-16 text-gray-800 flex items-center cursor-pointer pb-1.5 ${
                        currentRoute === link.href ? "font-semibold" : ""
                      }`}
                    >
                      {link.Icon && <link.Icon className="mr-2" />}
                      {link.label}
                    </a>
                  </Link>
                )}
              </li>
            );
          })}
          <li>
            {user?.token ? (
              <Button
                type="button"
                title="Logout"
                icon={<PersonIcon />}
                variant="btn_logout"
                onClick={() => {
                  toggleSidebar();
                  handleLogout();
                }}
              />
            ) : (
              <Button
                type="button"
                title="Login"
                icon={<PersonIcon />}
                variant="btn_login"
                onClick={() => {
                  handleAuthDialogToggle();
                  toggleSidebar();
                }}
              />
            )}
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
