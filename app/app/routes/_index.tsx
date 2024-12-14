// app/routes/index.tsx
import React from "react";
import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunction } from "@remix-run/node";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { prisma } from "../../prisma/db.server";
import { Link, redirect, useLoaderData } from "@remix-run/react";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/remix";

type Props = {};
type LoaderData = {
  user: {
    id: string;
    email: string;
    username: string;
  } | null;
  items: Array<{
    id: string;
    name: string;
    type: string;
    imageUrl?: string | null;
    phone: string;
    neighborhood: string;
    description: string;
  }>;
};

export const  loader: LoaderFunction = async(args) => {
  const { userId } = await getAuth(args);
  const items = await prisma.item.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  // Fetch detailed user info from Clerk
  if (!userId) {
    return {items}; 
  }
  const clerkUser = await clerkClient.users.getUser(userId);
  
  // Check if user already exists in our DB
  let user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId
    }
  });

  if (!user) {
    // Create new user record
    user = await prisma.user.create({
      data: {
        clerkUserId: userId,
        email: clerkUser.emailAddresses[0].emailAddress, // assuming at least one verified email
        role: 'user',
        username: clerkUser.username || 'defaultUsername',
      }
    });
  }
  
  // Return both sets of data
  return { user, items };

}


const Home: React.FC<Props> = () => {
  const { user, items } = useLoaderData<LoaderData>();
  console.log("HELLLOO",items);
  return (
    <div className="font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white">
        <nav className="flex items-center justify-between px-4 py-2">
          <label className="text-xl font-bold text-blue-600">
            Neighbourhood Exchange
          </label>
          <input type="checkbox" id="menu-toggle" className="hidden" />
          <label htmlFor="menu-toggle" className="cursor-pointer text-gray-600">
            <i className="fas fa-bars"></i>
          </label>
          <div>
            <Link to={"/createItem"}>
              <button>Направи обява</button>
            </Link>
          </div>
          <div>
            <SignedIn>
              <div>
                <UserButton />
              </div>
              <div>
                <SignOutButton />
              </div>
            </SignedIn>
            <SignedOut>
              <div>
                <SignInButton />
              </div>
              <div>
                <SignUpButton />
              </div>
            </SignedOut>
          </div>
          <div
            className="absolute top-0 left-0 hidden h-full w-full bg-gradient-to-br from-blue-100 via-blue-400 to-blue-600"
            id="menu"
          >
            <ul className="mt-20 space-y-6 text-center">
              <li>
                <a
                  className="block text-white transition-colors hover:text-gray-900"
                  href="/"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  className="block text-white transition-colors hover:text-gray-900"
                  href="/products"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  className="block text-white transition-colors hover:text-gray-900"
                  href="/catalog"
                >
                  Catalog
                </a>
              </li>
              <li>
                <a
                  className="block text-white transition-colors hover:text-gray-900"
                  href="/about"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  className="block text-white transition-colors hover:text-gray-900"
                  href="/feedback"
                >
                  Feedback
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Main Section */}
      <section className="bg-blue-600 py-10 text-center text-white">
        <h2 className="text-2xl font-bold">Welcome to our website!</h2>
      </section>

      {/* Search & Categories */}
      <section className="mx-auto w-11/12 py-10">
        <div className="mb-4 flex items-center space-x-4">
          <input
            type="search"
            className="flex-1 border-b-2 border-blue-600 p-2 text-gray-700 outline-none focus:border-gray-300"
            placeholder="Search product..."
          />
          <button className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-500">
            Search
          </button>
        </div>
        <div className="my-4 space-x-2">
          <button className="rounded-full border-2 border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-600 hover:text-white">
            All
          </button>
          <button className="rounded-full border-2 border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-600 hover:text-white">
            Clothes
          </button>
          <button className="rounded-full border-2 border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-600 hover:text-white">
            Electronics
          </button>
          <button className="rounded-full border-2 border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-600 hover:text-white">
            RealEstate
          </button>
          <button className="rounded-full border-2 border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-600 hover:text-white">
            Kitchen
          </button>
        </div>
        
        <h2 className="mt-4 text-lg font-bold text-gray-600">Last Added</h2>
        

        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-4">Last Added Items</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.length > 0 ? (
              items.map((item) => (
                <div 
                  key={item.id} 
                  className="border p-4 rounded shadow bg-white"
                >
                  <h3 className="text-lg font-bold">{item.name}</h3>
                  <p className="text-gray-700">{item.description}</p>
                  {/* Add other item details as needed */}
                </div>
              ))
            ) : (
              <p>No items available.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

// Tailwind CSS classes will handle the styling equivalent to the given CSS rules.
