import { json, ActionFunctionArgs, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ClerkClient } from "@clerk/remix/api.server";
import { clerkClient } from "@clerk/clerk-sdk-node";

export const loader = async () => {
  const users = await clerkClient.users.getUserList();
  return json(users);
};
type LoaderData = {
    id: string;
    email: any;
    user: {
      id: string;
      email: string;
      username: string;
      phoneNumber: string;
    } | null;
}
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const userId = formData.get("userId") as string;
  const actionType = formData.get("action");

  if (actionType === "ban") {
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { banned: true },
    });
  } else if (actionType === "delete") {
    await clerkClient.users.deleteUser(userId);
  }

  return null;
};

export default function ManageUsers() {
  const users = useLoaderData<LoaderData[]>();

  return (
    <div>
      <h1>Manage Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <p>{user.email[0]?.emailAddress}</p>
            <form method="post">
              <input type="hidden" name="userId" value={user.id} />
              <button name="action" value="ban">Ban User</button>
              <button name="action" value="delete">Delete User</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
