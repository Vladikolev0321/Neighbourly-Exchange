import React, { useState } from "react";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node"; // For handling the action
import { prisma } from "../../prisma/db.server"; // Adjust the path to your Prisma setup
import { Form, useActionData } from "@remix-run/react"; // For managing form submission states
import { ItemStatus } from "@prisma/client";
import { getAuth, User } from "@clerk/remix/ssr.server";
import { neighborhoodsNames } from "./_index";
interface ActionData {
  error: string;
  success: string; // Added success message for successful item creation
}

// Define the Action Function
export const action = async (args:ActionFunctionArgs) => {
  // Parse the form data
  const {userId:clerkUserId} = await getAuth(args);
  if (!clerkUserId) {
    return redirect("/sign-up");
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: clerkUserId as string },
  });
  

  const formData = await args.request.formData();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string;
  const creatorPhone = formData.get("phone") as string;
  const neighborhood = formData.get("neighborhood") as string;
  const image = formData.get("image") as File | null;
  const ownerId = user?.id ?? 0; // Replace with actual ownerId, e.g., from session
  const categoryId = 1; // Set based on your app's logic
  const creatorName = "Your Name"; // Replace with the actual user's name if required
  
  // Validate the required fields
  if (!name || !type || !creatorPhone || !neighborhood || !description) {
    return json({ error: "All fields are required!" }, { status: 400 });
  }

  // If image was uploaded, handle storing the image and getting its URL
  let imageUrl = "";
  if (image) {
    // Upload image to Cloudinary
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET; // Cloudinary upload preset

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", image);
    cloudinaryFormData.append("upload_preset", uploadPreset as string);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: cloudinaryFormData,
      }
    );

    const uploadData = await uploadResponse.json();
        if (uploadData.error) {
      return json({ error: uploadData.error.message }, { status: 400 });
    }
    imageUrl = uploadData.secure_url;
  }

  // Save the data into the database
  try {
    await prisma.item.create({
      data: {
        name,
        description,
        type,
        creatorPhone,
        neighborhood,
        imageUrl, // Store the image URL here
        ownerId,
        categoryId,
        creatorName,
        status: ItemStatus.AVAILABLE,
        receiverPhone:"",
        clerkUserId: clerkUserId,
      },
    });

    //console.log("USERID:",userId)
    // Redirect to a success page or items list
    return redirect("/"); // Redirect after successful creation
  } catch (error) {
    console.error(error);
    return json({ error: "Failed to create item" }, { status: 500 });
  }
};

const CreateItem: React.FC = () => {
  const actionData = useActionData<ActionData>();

  const [type, setType] = useState<string>("");

  const handleTypeChange = (selectedType: string) => {
    setType(selectedType);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Create a New Item</h1>

      <Form method="post" encType="multipart/form-data" className="space-y-6">
        {actionData?.error && (
          <p className="text-red-500 text-sm">{actionData.error}</p>
        )}
        {actionData?.success && (
          <p className="text-green-500 text-sm">{actionData.success}</p>
        )}

        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full border-b-2 border-blue-600 p-2 outline-none focus:border-gray-300"
          />
        </div>

        {/* Type Selection */}
        <div>
          <p className="font-medium text-gray-700">Type</p>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => handleTypeChange("Item")}
              className={`px-4 py-2 border rounded ${
                type === "Item"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 border-blue-600"
              }`}
            >
              Actual Item
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("Favor")}
              className={`px-4 py-2 border rounded ${
                type === "Favor"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 border-blue-600"
              }`}
            >
              Favor
            </button>
            <input type="hidden" name="type" value={type} />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block font-medium text-gray-700">
            Upload Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            className="w-full border-b-2 border-blue-600 p-2 outline-none focus:border-gray-300"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone" className="block font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            className="w-full border-b-2 border-blue-600 p-2 outline-none focus:border-gray-300"
          />
        </div>

        {/* Neighborhood Selection */}
        <div>
          <label
            htmlFor="neighborhood"
            className="block font-medium text-gray-700"
          >
            Neighborhood (Sofia)
          </label>
          <select
            id="neighborhood"
            name="neighborhood"
            required
            className="w-full border-b-2 border-blue-600 p-2 outline-none focus:border-gray-300"
          >
            <option value="">Select Neighborhood</option>
            {neighborhoodsNames.map((neighborhood) => (
              <option key={neighborhood.id} value={neighborhood.id}>
                {neighborhood.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            className="w-full border-b-2 border-blue-600 p-2 outline-none focus:border-gray-300"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500"
        >
          Submit
        </button>
      </Form>
    </div>
  );
};

export default CreateItem;
