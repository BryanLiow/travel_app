import Link from "next/link";

const Navbar =
  () => {
    return (
      <nav className="border-2 border-red-500 flexBetween max-container padding-container realtive z-30 py-5">
        <Link href="/">
            Home
        </Link>
      </nav>
    );
  };

export default Navbar;
