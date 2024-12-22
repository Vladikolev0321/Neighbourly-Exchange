import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData, Form, useActionData } from "@remix-run/react";
import { useEffect } from "react";
import { prisma } from "../../prisma/db.server";

export const loader: LoaderFunction = async ({ params }) => {
  const itemId = params.id;
  // fetch the item to display or verify it exists
  const item = await prisma.item.findUnique({ where: { id: parseInt(itemId!) } });
  if (!item) {
    throw new Response("Item not found", { status: 404 });
  }
  return { item };
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const ratingValue = formData.get("rating");
  const itemId = parseInt(params.id!);

  const currItem = await prisma.item.findFirst({ where: { id: itemId } });
  if (!currItem) {
    throw new Response("Item not found", { status: 404 });
  }

  let receiveRatingUserId = 0;
  console.log("Item type:", currItem.type);
  if (currItem.type === "Item") {
    console.log("Item is an item; owner:", currItem.ownerId);
    receiveRatingUserId = currItem.ownerId;
  } else {
    // If the item is a service, get the user who requested the service
    const user = await prisma.user.findFirst({ where: { phoneNumber: currItem.receiverPhone } });
    receiveRatingUserId = user?.id ?? 0;
  }

  // Fetch the user to update the rating
  const user = await prisma.user.findFirst({ where: { id: currItem.ownerId } });

  // Update the user's rating (this is just an example of how you might do it)
  await prisma.user.update({
    where: { id: receiveRatingUserId },
    data: {
      rating: (parseInt(ratingValue as string) + (user?.rating || 0)) / 2,
    },
  });

  // Return a flag to the client so it knows to show the success message
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
