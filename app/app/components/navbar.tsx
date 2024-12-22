// app/components/Navbar.tsx
import React from "react";
import { Link } from "@remix-run/react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
} from "@clerk/remix";

const Navbar: React.FC = () => {
  return (
    <header className="bg-blue-600 shadow">
      <nav className="container mx-auto flex items-center justify-between p-4 text-white">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-2xl font-bold hover:text-blue-300">
            Neighborhood Exchange
          </Link>
        </div>

        {/* Links */}
        <div className="flex items-center space-x-6">
          <Link
            to="/createItem"
            className="px-4 py-2 rounded hover:bg-blue-500 transition"
          >
            Направи обява
          </Link>
        </div>

        {/* Authentication Buttons */}
        <div className="flex items-center space-x-4">
          <SignedIn>
            <UserButton />
            <button className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 transition">
              <SignOutButton />
            </button>
          </SignedIn>
          <SignedOut>
            <button className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 transition">
              <SignInButton />
            </button>
            <button className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 transition">
              <SignUpButton />
            </button>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
