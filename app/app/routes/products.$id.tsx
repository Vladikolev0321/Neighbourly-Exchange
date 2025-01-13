import { redirect, useLoaderData, useActionData, Form } from "@remix-run/react";
import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { prisma } from "../../prisma/db.server";
import { ClerkApp, Protect, SignedIn, useUser } from "@clerk/remix";
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

  if (item.clerkUserId !== userId) {
    throw new Response("Unauthorized", { status: 403 });
  }

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
  const { item, userId, clerkUserId, creator } = useLoaderData<LoaderData & { creator: { rating: number; name: string } }>();

  const actionData = useActionData<{ error?: string }>();
  const isCreator = userId === clerkUserId;

  return (
    
    <div className="p-6">
      <Navbar />
      <div className="max-w-none bg-white shadow-md rounded-md p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex h-500 bg-gray-300 rounded-md overflow-hidden">
            <img
              src={item.imageUrl || defaultImage}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-grow space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">{item.name}</h1>
            <p className="text-gray-700">{item.description}</p>
            <p className="text-gray-600">
              <span className="font-semibold">Създател на обявата:</span> {creator?.name || "Unknown"}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Оценка на създателя:</span> {creator?.rating || "Not rated yet"} / 5
            </p>

            <SignedIn>
            <Protect condition={(has) => has({ role: 'org:admin' }) || isCreator}>

                <div className="space-y-4">
                  {actionData?.error && (
                    <p className="text-red-600">{actionData.error}</p>
                  )}
                  <Form method="post">
                    <input type="hidden" name="actionType" value="delete" />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full"
                    >
                      Изтрий продукта/услугата
                    </button>
                  </Form>

                  <Form method="post">
                    <input type="hidden" name="actionType" value="markDone" />
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
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <button
                      type="submit"
                      className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
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
  );
}
