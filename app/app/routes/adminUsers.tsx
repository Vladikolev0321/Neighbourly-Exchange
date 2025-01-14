import { json, ActionFunctionArgs } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import { ClerkClient } from "@clerk/remix/api.server";
import { clerkClient, User } from "@clerk/clerk-sdk-node";
import { prisma } from "prisma/db.server";
import Navbar from "~/components/navbar";

// Define the LoaderData type
type LoaderData = {
  id: string;
  email: string;
  username: string | null;
  phoneNumber: string | null;
  rating: number | null;
  clerkUserId: string;
};

// Loader to get user details
export const loader = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      phoneNumber: true,
      rating: true,
      clerkUserId: true, // Ensure this field is selected
    },
  });

  console.log("Loaded users:", users);
  return { users };
};

// Action to handle user ban and delete
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const clerkUserId = formData.get("userId") as string;
  const actionType = formData.get("action");
  const user = await prisma.user.findUnique({
    where: { clerkUserId },
  });
 console.log("Form Data", formData);
  if (!clerkUserId || !actionType) {
    throw new Error("Invalid input. UserId or action missing.");
  }

  try {
    if (actionType === "ban") {
      await clerkClient.users.updateUser(clerkUserId, {
        publicMetadata: { banned: true },
      });
    } else if (actionType === "delete") {
      await clerkClient.users.deleteUser(clerkUserId);
      if (actionType === "delete") {
          await prisma.user.delete({
            where: { id: user?.id },
          });
          return redirect("/adminUsers");
    }
  }
  } catch (error) {
    console.error("Error performing action:", error);
    throw json(
      { error: `Failed to ${actionType} user: ${(error as Error).message}` },
      { status: 500 }
    );
  }

  return json({ success: true });
};

export default function ManageUsers() {
  const { users } = useLoaderData<{ users: LoaderData[] }>();

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Manage Users</h1>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <li
              key={user.id}
              className="bg-white shadow rounded-lg p-4 space-y-3 border border-gray-200"
            >
              <p className="text-lg font-semibold text-gray-700">
                Email: <span className="font-normal">{user.email}</span>
              </p>
              <p className="text-gray-700">
                Phone Number:{" "}
                <span className="font-normal">{user.phoneNumber || "N/A"}</span>
              </p>
              <p className="text-gray-700">
                Username:{" "}
                <span className="font-normal">{user.username || "N/A"}</span>
              </p>
              <p className="text-gray-700">
                Rating:{" "}
                <span className="font-normal">{user.rating || "Not Rated"}</span>
              </p>
              <form method="post" className="flex justify-between items-center">
                <input type="hidden" name="userId" value={user.clerkUserId} /> {/* Use clerkUserId here */}
                {/* <button
                  name="action"
                  value="ban"
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                >
                  Ban User
                </button> */}
                <button
                  name="action"
                  value="delete"
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Delete User
                </button>
              </form>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
