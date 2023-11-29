"use client";

import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";
import SearchIcon from "@mui/icons-material/Search";

const Navbar = () => {
  const currentRoute = usePathname();

  return (
    <nav className="flexBetween max-container padding-container realtive z-30 py-5">
      <Link href="/">
        <Image src="/hilink-logo.svg" alt="logo" width={74} height={29} />
      </Link>
      <div className="relative lg:flex items-center">
        <input
          type="search"
          placeholder="Search..."
          className="px-4 py-2 border border-gray-300 rounded-md"
        />
        <button type="submit" className="absolute right-2 top-2 text-gray-600">
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
          icon="/user.svg"
          variant="btn_dark_green"
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
  );
};

export default Navbar;
