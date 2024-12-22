// app/routes/index.tsx
import React from "react";
import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunction } from "@remix-run/node";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { prisma } from "../../prisma/db.server";
import { Link, redirect, useLoaderData } from "@remix-run/react";
import Navbar from "../components/navbar";

type Props = object;
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
  const request = args.request;
  const { userId } = await getAuth(args);
  const url = new URL(request.url);
  const neighborhoods  = url.searchParams.get("neighborhoods");
  let items = await prisma.item.findMany({
    where: {
      status: "AVAILABLE",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (neighborhoods) {
    const neighborhoodIds = neighborhoods.split(",").map(Number);
    console.log("ids", neighborhoodIds);
    items = items.filter((item) =>
      neighborhoodIds.includes(Number(item.neighborhood))
    );
  }


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
  const { items } = useLoaderData<LoaderData>();
  return (
    <div className="font-sans text-gray-900">
      {/* Header */}
      <Navbar />
      {/* Search & Categories */}
      <section className="mx-auto w-11/12 py-10">

        <h2 className="mt-4 text-lg font-bold text-gray-600">Last Added</h2>


        <div className="mt-4">
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