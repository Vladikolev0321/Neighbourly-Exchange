import { redirect, useLoaderData, useActionData, Form } from "@remix-run/react";
import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { prisma } from "../../prisma/db.server";
import { ClerkApp, Protect, SignedIn, useUser, useOrganization } from "@clerk/remix";
import { getAuth } from "@clerk/remix/ssr.server";
import { Resend } from 'resend';
import Navbar from "~/components/navbar";

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
  creatorId: string;
  status: string;
  clerkUserId: string;
};

interface LoaderData {
  item: Item;
  userId: string;
  clerkUserId?: string;
  creator?: { rating: number; name: string };
}

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

  const creator = await prisma.user.findUnique({
    where: { id: item.ownerId },
    select: { rating: true, name: true },
  });

  if (!userId) {
    return json({ item, creator });
  }

  return json({
    item,
    creator,
    userId,
    clerkUserId: userId,
  });
};

export const action: ActionFunction = async (args) => {
  const { params, request } = args;
  const { userId } = await getAuth(args);
  const { id } = params;
  const user = await prisma.user.findFirst({ where: { clerkUserId: userId || undefined } });
  const formData = await request.formData();
  const actionType = formData.get("actionType");
  const receiverPhone = formData.get("receiverPhone");

  const item = await prisma.item.findUnique({
    where: { id: parseInt(id!) },
  });
  if (!item) {
    throw new Response("Product not found", { status: 404 });
  }

  // if (item.clerkUserId !== userId) {
  //   throw new Response("Unauthorized", { status: 403 });
  // }

  if (actionType === "delete") {
    await prisma.item.delete({
      where: { id: item.id },
    });
    return redirect("/");
  }

  if (actionType === "markDone") {
    if (!receiverPhone) {
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
      const receiver = await prisma.user.findFirst({
        where: {
          phoneNumber: receiverPhone.toString(),
        },
      });
      let receivereMail = "";
      if (item.type == "Item") {
        receivereMail = receiver?.email || "default@example.com";
      } else {
        receivereMail = user?.email || "default@example.com";
      }

      const url = new URL(request.url);
      const origin = url.origin;
      const ratingLink = `${origin}/rating/${item.id}`;

      await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: receivereMail || "denislazarov1@gmail.com",
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
    }
    return redirect("/");
  }

  return null;
};

export default function ProductPage() {
  const { user } = useUser();
  const { item, userId, clerkUserId, creator } = useLoaderData<
    LoaderData & { creator: { rating: number; name: string } }
  >();

  const actionData = useActionData<{ error?: string }>();
  const isCreator = item.clerkUserId === clerkUserId;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Image Section */}
            <div className="h-96 w-full md:w-96 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={item.imageUrl || defaultImage}
                alt={item.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              />
            </div>

            {/* Details Section */}
            <div className="flex-grow space-y-4">
              <h1 className="text-4xl font-bold text-gray-800">{item.name}</h1>
              <p className="text-gray-700">{item.description}</p>
              <p className="text-gray-600">
                <span className="font-semibold">Оценка на създателя:</span>{" "}
                {creator?.rating || "Not rated yet"} / 5
              </p>

              <SignedIn>
                <Protect condition={(has) => has({ role: "org:admin" }) || isCreator}>
                  <div className="space-y-6">
                    {actionData?.error && (
                      <p className="text-red-500 font-medium">{actionData.error}</p>
                    )}

                    {/* Delete Button */}
                    <Form method="post">
                      <input type="hidden" name="actionType" value="delete" />
                      <button
                        type="submit"
                        className="w-full px-6 py-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors"
                      >
                        Изтрий продукта/услугата
                      </button>
                    </Form>

                    {/* Mark as Done Form */}
                    <Form method="post">
                      <input type="hidden" name="actionType" value="markDone" />
                      <div className="space-y-2">
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
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="mt-4 w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors"
                      >
                        Маркирай сделката като завършена
                      </button>
                    </Form>
                  </div>
                </Protect>
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
