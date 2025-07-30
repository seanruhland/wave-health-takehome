import { useNavigate } from "react-router";
import { AddUserForm } from "~/components/add-user-form";
import type { User } from "~/types/user";
import type { Route } from "./+types/add-user";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ClientOnly } from "~/components/client-only";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Add User - React Router App" },
    { name: "description", content: "Add a new user to the system" },
  ];
}

export default function AddUser() {
  const navigate = useNavigate();

  const handleSubmit = (newUser: User) => {
    // In a real app, you would send this to an API
    // For now, we'll just navigate back to the user list
    console.log("New user added:", newUser);

    // You could store this in localStorage or a state management solution
    // For now, we'll just navigate back
    navigate("/");
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <div className="flex items-center space-x-4 mb-3">
          <ClientOnly fallback={<div className="h-9 w-24 rounded-md border bg-gray-100 animate-pulse" />}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center space-x-2"
              aria-label="Go back to users list"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Back to Users</span>
            </Button>
          </ClientOnly>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Add New User</h1>
        <p className="text-gray-600 text-sm">
          Fill out the form below to add a new user to the system.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
        <AddUserForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
}