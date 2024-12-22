import { redirect, useLoaderData, useActionData, Form } from "@remix-run/react";
import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { prisma } from "../../prisma/db.server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { SignedIn, useUser } from "@clerk/remix";
import { getAuth, PhoneNumber, User } from "@clerk/remix/ssr.server";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const defaultImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARIAAAC4CAMAAAAYGZMtAAAANlBMVEXp7vG6vsHIzM/m6+7M0NO...";

type Item = {
  id: number;
  name: string;
  creatorPhone: string;
  receiverPhoneNumber: string;
  description: string;
  imageUrl?: string;
  creatorId: string; // User who created this product
  status: string;
  clerkUserId: string;
};

interface LoaderData {
  item: Item;
  userId?: string; // Logged-in user's ID
  clerkUserId?: string;
}

// Loader: Fetch item and the current user ID
export const loader: LoaderFunction = async (args) => {
  const { params } = args;
  const { id } = params;
  const { userId } = await getAuth(args);

  const item = await prisma.item.findUnique({
    where: { id: parseInt(id!) },
  });

  if (!item) {
    throw new Response("Product not found", { status: 404 });
  }

  // If not logged in, just return the item
  if (!userId) {
    return json({ item });
  }

  // Check who owns it in the DB
  const user = await prisma.user.findUnique({
    where: { id: item.ownerId },
  });

  return json({
    item,
    userId: user?.clerkUserId, // The clerkUserId on the item
    clerkUserId: userId, // The clerkUserId of the logged-in user
  });
};

// Action: Handle deletion and marking as done
export const action: ActionFunction = async (args) => {
  const { params, request } = args;
  const { userId } = await getAuth(args);
  const { id } = params;
  const user = await prisma.user.findUnique({ where: { id: userId ? parseInt(userId) : undefined } });
  const formData = await request.formData();
  const actionType = formData.get("actionType");
  const receiverPhone = formData.get("receiverPhone");

  // 1) Fetch the item
  const item = await prisma.item.findUnique({
    where: { id: parseInt(id!) },
  });
  if (!item) {
    throw new Response("Product not found", { status: 404 });
  }

  // 2) Check owner
  if (item.clerkUserId !== userId) {
    throw new Response("Unauthorized", { status: 403 });
  }

  // 3) Handle the various action types
  if (actionType === "delete") {
    await prisma.item.delete({
      where: { id: item.id },
    });
    return redirect("/");
  }

  if (actionType === "markDone") {
    // Validate that the user typed a phone number
    if (!receiverPhone) {
      // Return a JSON response with status 400
      return json({ error: "Phone number is required to mark as done." }, { status: 400 });
    }

    await prisma.item.update({
      where: { id: item.id },
      data: {
        status: "DONE",
        receiverPhone: receiverPhone.toString(),
      },
    });

    try {
      const userEmail = user?.email || "someFallbackEmail@example.com";
      let receiver = await prisma.user.findFirst({
        where: {
          phoneNumber: receiverPhone.toString(),
        }
      });
      let receivereMail = "";
      if(item.type=="Item"){
        receivereMail = receiver?.email || "default@example.com";
      }
      else{
        receivereMail = user?.email|| "default@example.com";
      }
      

      // We need a link to the "rate" page (e.g. /rate/:itemId)
      // Construct a full URL, e.g. https://example.com/rate/123
      // We'll pull the origin from the request or from an .env setting:
      const url = new URL(request.url);
      const origin = url.origin; // e.g. https://your-domain.com
      const ratingLink = `${origin}/rating/${item.id}`;


      
      await resend.emails.send({
        from: "noreply@yourdomain.com", // Use a verified sender email
        to: receivereMail || "denislazarov303@gmail.com",
        subject: `Please rate the item: ${item.name}`,
        html: `
          <div>
            <h2>Благодарим че използвате Neighbourhood Exchange</h2>
            <p>
              Бихме се радвали ако дадете мнението си за човека, който ви е помогнал, за да подобрим нашите улсуги
              <br>
              и да предпазим сайта от злоупотреби.
              <br>:
            </p>
            <p>
              <a href="${ratingLink}">
                Rate "${item.name}"
              </a>
            </p>
          </div>
        `,
      });
    } catch (error) {
      console.error("Failed to send email:", error);
      // Decide whether to handle the error or just log it.
      // You might also want to return some JSON or continue the flow.
    }
    return redirect("/");
  }

  // If neither action is triggered, do nothing
  return null;
};

// Component: Display product details
export default function ProductPage() {
  const { user } = useUser();
  const { item, userId, clerkUserId } = useLoaderData<LoaderData>();

  // Optional: get errors or messages returned from action
  const actionData = useActionData<{ error?: string }>();

  const isCreator = userId === clerkUserId;
  console.log("IsCreator:", isCreator, " DB-Owner:", userId, " LoggedIn:", clerkUserId);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Product Image */}
        <div className="w-full md:w-1/2 h-64 bg-gray-300 rounded-md overflow-hidden">
          <img
            src={item.imageUrl || defaultImage}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold">{item.name}</h1>
          <p className="text-gray-700">{item.description}</p>
          <p className="text-gray-600">Phone Number: {item.creatorPhone}</p>

          <SignedIn>
            {/* Display Actions Only for the Product Creator */}
            {isCreator && (
              <div className="space-y-4">
                {actionData?.error && (
                  <p className="text-red-600">{actionData.error}</p>
                )}

                {/* Delete Form */}
                <Form method="post">
                  <input
                    type="hidden"
                    name="actionType"
                    value="delete"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Изтрий продукта/услугата
                  </button>
                </Form>

                {/* Mark as Done Form */}
                <Form method="post" className="space-y-2">
                  {/* Hidden field to designate the action */}
                  <input
                    type="hidden"
                    name="actionType"
                    value="markDone"
                  />

                  <div>
                    <label
                      htmlFor="receiverPhone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Въведете номера на получателя:
                    </label>
                    <input
                      type="text"
                      id="receiverPhone"
                      name="receiverPhone"
                      className="mt-1 block w-full p-2 border rounded-md"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Маркирай сделката като завършена
                  </button>
                </Form>
              </div>
            )}
          </SignedIn>
        </div>
      </div>
    </div>
  );
}