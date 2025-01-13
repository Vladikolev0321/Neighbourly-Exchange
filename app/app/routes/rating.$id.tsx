import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Form, useActionData } from "@remix-run/react";
import { useEffect } from "react";
import { prisma } from "../../prisma/db.server";

export const loader: LoaderFunction = async ({ params }) => {
  const itemId = parseInt(params.id!, 10);

  // Validate the itemId is a valid number
  if (isNaN(itemId)) {
    throw new Response("Invalid item ID", { status: 400 });
  }

  // Fetch the item by ID
  const item = await prisma.item.findUnique({
    where: { id: itemId },
  });

  if (!item) {
    throw new Response("Item not found", { status: 404 });
  }

  return { item };
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const ratingValue = parseInt(formData.get("rating") as string, 10);
  const itemId = parseInt(params.id!, 10);

  if (isNaN(itemId) || isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
    throw new Response("Invalid input", { status: 400 });
  }

  const currItem = await prisma.item.findUnique({
    where: { id: itemId },
  });

  if (!currItem) {
    throw new Response("Item not found", { status: 404 });
  }

  let receiveRatingUserId: number | null = null;

  if (currItem.type === "Item") {
    // Use ownerId if the type is "Item"
    receiveRatingUserId = currItem.ownerId;
  } else if (currItem.type === "Favor") {
    // Fetch user by receiverPhone if the type is "Favor"
    const receiver = await prisma.user.findFirst({
      where: { phoneNumber: currItem.receiverPhone },
    });
    receiveRatingUserId = receiver?.id || null;
  }

  if (!receiveRatingUserId) {
    throw new Response("User to receive rating not found", { status: 404 });
  }

  const receivingUser = await prisma.user.findUnique({
    where: { id: receiveRatingUserId },
  });

  if (!receivingUser) {
    throw new Response("Receiving user not found", { status: 404 });
  }

  const updatedRating =
    receivingUser.rating !== 0
      ? (receivingUser.rating + ratingValue) / 2
      : ratingValue;

  await prisma.user.update({
    where: { id: receiveRatingUserId },
    data: { rating: updatedRating },
  });

  return { success: true };
};

export default function RateItem() {
  const { item } = useLoaderData<{ item: any }>();
  const actionData = useActionData<{ success?: boolean }>();

  // If success is true, show a success message and then redirect after 2 seconds
  useEffect(() => {
    if (actionData?.success) {
      const timer = setTimeout(() => {
        window.location.href = "/";
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [actionData]);

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Rate {item.name}</h1>

      {actionData?.success ? (
        <p className="text-green-600 font-semibold">
          Thanks for rating! You will be redirected shortly...
        </p>
      ) : (
        <Form method="post" className="flex flex-col items-center space-y-4">
          <label className="block text-center">
            <span className="mr-2 font-medium text-black">Rate:</span>
            <select
              name="rating"
              className="border border-gray-300 rounded p-2"
              required
            >
              <option value="1">1 (Worst)</option>
              <option value="2">2</option>
              <option value="3">3 (OK)</option>
              <option value="4">4</option>
              <option value="5">5 (Best)</option>
            </select>
          </label>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Rating
          </button>
        </Form>
      )}
    </div>
  );
}
