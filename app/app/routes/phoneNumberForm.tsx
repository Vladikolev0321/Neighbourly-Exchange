import { Form, useActionData, useNavigate } from "@remix-run/react";
import { ActionFunction, json } from "@remix-run/node";
import { useEffect } from "react";
import { prisma } from "../../prisma/db.server";
import { getAuth } from "@clerk/remix/ssr.server";

interface ActionData {
  error?: string;
  success?: string;
}

export const action: ActionFunction = async (args) => {
  const { params, request } = args;
  const { id } = params;
  const { userId } = await getAuth(args);
  const formData = await request.formData();
  const phoneNumber = formData.get("phoneNumber");

  // Simple phone number validation (adjust as needed)
  const phoneRegex = /^(\+359|0)(87|88|89|98|99)\d{7}$/;

  if (!phoneNumber || typeof phoneNumber !== "string" || !phoneRegex.test(phoneNumber)) {
    return json<ActionData>({
      error: "Please enter a valid phone number. Include the country code if applicable."
    });
  }
  await prisma.user.update({
    where: { clerkUserId: userId as string },
    data: {
      phoneNumber: phoneNumber.toString(),
    },
  });

  // Here you can save the phoneNumber to the database or perform other logic
  return json<ActionData>({ success: "Phone number successfully saved." });
};

export default function PhoneNumberForm() {
  const actionData = useActionData<ActionData>();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect after 2 seconds when a success message is shown
    if (actionData?.success) {
      setTimeout(() => {
        navigate("/"); // Redirect to the desired URL (adjust it as needed)
      }, 2000);
    }
  }, [actionData, navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Enter Your Phone Number</h1>
        <Form method="post" className="space-y-4">
          {actionData?.error && (
            <div className="text-red-500 text-sm">{actionData.error}</div>
          )}
          {actionData?.success && (
            <div className="text-green-500 text-sm">{actionData.success}</div>
          )}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="+123456789"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
