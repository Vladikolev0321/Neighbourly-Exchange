import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Form, useActionData } from "@remix-run/react";
import { prisma } from "../../prisma/db.server";

export const loader: LoaderFunction = async ({ params }) => {
  const itemId = params.itemId;
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
  const itemId = parseInt(params.itemId!);
  const user = await prisma.user.findUnique({ where: { id: itemId } });

  // Validate rating, save it, etc. 
  // Possibly store it in a "reviews" table or update the item
  await prisma.user.update({
    where: { id: itemId },
    data: {
      // for example, store rating in the item or a separate table
      rating: (parseInt(ratingValue as string) + (user?.rating || 0)) / 2,
    },
  });

  return { success: true };
};

export default function RateItem() {
  const { item } = useLoaderData<{ item: any }>();
  const actionData = useActionData<{ success?: boolean }>();

  return (
    <div>
      <h1>Rate {item.name}</h1>
      {actionData?.success ? (
        <p>Thanks for rating!</p>
      ) : (
        <Form method="post">
          <label>
            Rate:
            <select name="rating">
              <option value="1">1 (Worst)</option>
              <option value="2">2</option>
              <option value="3">3 (OK)</option>
              <option value="4">4</option>
              <option value="5">5 (Best)</option>
            </select>
          </label>
          <button type="submit">Submit Rating</button>
        </Form>
      )}
    </div>
  );
}
