import { Link } from "@remix-run/react";
import Navbar from "~/components/navbar";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Admin Panel
        </h1>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <li>
            <Link
              to="/adminPosts"
              className="block text-center py-3 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all shadow-md"
            >
              Manage Posts
            </Link>
          </li>
          <li>
            <Link
              to="/adminUsers"
              className="block text-center py-3 px-6 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all shadow-md"
            >
              Manage Users
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
