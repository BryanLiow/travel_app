"use client";
import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from "@mui/icons-material/Search";

const Navbar = () => {
  const currentRoute = usePathname();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
          <Button
            type="button"
            title="Login"
            icon={<PersonIcon />} // Corrected syntax
            variant="btn_login"
            onClick={handleClickOpen}
          />
        </div>
        <Image
          src="menu.svg"
          alt="menu"
          width={32}
          height={32}
          className="inline-block cursor-pointer lg:hidden"
        />
      </nav>
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Login</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Email Address"
              type="email"
              fullWidth
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button
              type="button"
              title="Cancel"
              variant="btn_cancel" // Specify the variant you want to use
              onClick={handleClose}
            />
            <Button
              type="submit" // Assuming 'Login' is a submit action
              title="Login"
              variant="btn_login" // Specify the variant you want to use
              onClick={handleClose} // Update this if you have a specific function for login
            />
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default Navbar;
