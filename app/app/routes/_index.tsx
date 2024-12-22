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
    phoneNumber: string;
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

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  const items = await prisma.item.findMany({
    where: {
      status: "AVAILABLE",
    },
    orderBy: {
      createdAt: "desc",
    },
  });


  // Fetch detailed user info from Clerk
  if (!userId) {
    return { items };
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
  console.log(user.phoneNumber);
  if (!user.phoneNumber && user) {
    return redirect("/phoneNumberForm");
  }

  // Return both sets of data
  return { user, items };

}

const defaultImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARIAAAC4CAMAAAAYGZMtAAAANlBMVEXp7vG6vsHIzM/m6+7M0NO/w8bCxsnR1di7v8Li5+rDyMvl6u3h5unAxMfLz9K3u77Y3eDW2t13gQCUAAADH0lEQVR4nO3c7ZKaMBhAYTEGAwHi3v/NdhGqkBBXJYzm5Tz/OtMyeBogfB4OAAAAAAAAAAAAAAAAAAAAAAAAAL5A89MdUzs3n/5VK9jOFOm5os42StNuEOTKXD79296jdNEPktQDZVhenuPk5NL3uNGf/nXvUFvVuGZ2OW46Fzf8dyY+3nTlEKb79O97w/maxFTJF1xfk5TJl7u9IUm9wYIzT7LBmm+24M2RJECSAEkC4Zqry1EbXZ5XHoQEJfnRw4zCFZ1NuuBs+Gveudv80+k1pyhikpzuRfo57YqNR0qSy6zIqimckCSq9E/e3j9tE5JkNkjMumEiJMnJHyRFoZIsOCuzNa+DIu7hQaeq48fpfSZptGujTXaZpOkndWWsiZAk3Sv7kuHKvqsjcxchSbxpiXn0k6px4l+Uy02EJLG68PzE/l11/6vL+1ghScY/3UVvOsziLe5PpCQ51PMmsZ2rnd/5aRf2OGKSqEkTF72BWfkbmA6biEkymcG6MjZGfucj/j4nHCeCkhyaU2mM0cdL7Pi7dF/dBfsTSUl+t56qaeIz9b7Iwk1k/7gjK8lDVRtsNYvjZD9JwqlLZJzsJkm8SD/Vne599pLE6kfPorjpcWcnSYL5iG8yP5GZxHondNXfT7Xdx4nIJLac38h5okhxv6YkMYktXTFt8kyRybFYYJLhBsb95tZzRfprSurxgr9ebM3VWOB/kwfzEc/4kJe8JLebXEOT54tITaJaN84/zHV/0hd59uFYmUnsbYyY6zh5YYwITWK9mxf6pafsJSbxi7xIYBJbB2f/Lz1jLy+JWjdGJCZZ/XaOuCTl8jWz/SYJH0PaexK7foxIS3JMUERYkgSbjbQka4+/JCEJSUjSI0mPJAEOwoH5VE0n0IpKopJYWHBWeN0xQJLAZu/BZ5yEUeLrR4lZ9V5jxHGr4be58U2C9pTYOOvL8fslKsVVo6gsv3Kz9A5OOll+C+mgNvs2VLHmndqPasxW246Lvs3z7ezRbRDFxV9LyEFzTvzBrF+nTDcaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC+zj/F2S2b1UhTuQAAAABJRU5ErkJggg==";
const Home: React.FC<Props> = () => {
  const { user, items } = useLoaderData<LoaderData>();
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {items && items.length > 0 ? (
              items.map((item) => (
                <div
                  key={item.id}
                  className="border p-4 rounded shadow bg-white"
                >
                  {/* Wrap everything in the Link so the card is clickable */}
                  <Link
                    to={`/products/${item.id}`}
                    className="block"
                  >
                    <div className="w-full h-64 bg-gray-300 rounded-md overflow-hidden">
                      <img
                        src={item.imageUrl || defaultImage}
                        alt={item.name}
                        className="w-full h-full object-fill"
                        onError={(e) => (e.currentTarget.src = defaultImage)}
                      />
                    </div>
                    <h3 className="text-lg font-bold mt-2">{item.name}</h3>
                    <p className="text-gray-700">{item.description}</p>
                  </Link>
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
