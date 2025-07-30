import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useState } from "react";
import type { User } from "~/types/user";

// Zod schema for form validation
const addUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  street: z.string().min(1, "Street is required"),
  suite: z.string().min(1, "Suite is required"),
  city: z.string().min(1, "City is required"),
  zipcode: z.string().min(1, "Zipcode is required"),
  companyName: z.string().min(1, "Company name is required"),
  companyCatchPhrase: z.string().optional(),
  companyBs: z.string().optional(),
});

type AddUserFormData = z.infer<typeof addUserSchema>;

interface AddUserFormProps {
  onSubmit: (user: User) => void;
  onCancel: () => void;
}

export function AddUserForm({ onSubmit, onCancel }: AddUserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextId, setNextId] = useState(1000);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddUserFormData>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      phone: "",
      website: "",
      street: "",
      suite: "",
      city: "",
      zipcode: "",
      companyName: "",
      companyCatchPhrase: "",
      companyBs: "",
    },
  });

  const onSubmitForm = async (data: AddUserFormData) => {
    setIsSubmitting(true);

    // Create a new user object
    const newUser: User = {
      id: nextId,
      name: data.name,
      username: data.username,
      email: data.email,
      phone: data.phone || undefined,
      website: data.website || undefined,
      address: {
        street: data.street,
        suite: data.suite,
        city: data.city,
        zipcode: data.zipcode,
        geo: {
          lat: "0",
          lng: "0",
        },
      },
      company: {
        name: data.companyName,
        catchPhrase: data.companyCatchPhrase || "",
        bs: data.companyBs || "",
      },
    };

    try {
      onSubmit(newUser);
      reset();
      setNextId(prev => prev + 1);
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4" noValidate>
      {/* Basic Information */}
      <div className="space-y-3">
        <h3 className="text-base font-medium">Basic Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter full name"
              className={`h-9 ${errors.name ? "border-red-500" : ""}`}
              aria-describedby={errors.name ? "name-error" : undefined}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p id="name-error" className="text-red-500 text-xs mt-1" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username *
            </label>
            <Input
              id="username"
              {...register("username")}
              placeholder="Enter username"
              className={`h-9 ${errors.username ? "border-red-500" : ""}`}
              aria-describedby={errors.username ? "username-error" : undefined}
              aria-invalid={!!errors.username}
            />
            {errors.username && (
              <p id="username-error" className="text-red-500 text-xs mt-1" role="alert">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <Input
              id="email"
              {...register("email")}
              type="email"
              placeholder="Enter email address"
              className={`h-9 ${errors.email ? "border-red-500" : ""}`}
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p id="email-error" className="text-red-500 text-xs mt-1" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <Input
              {...register("phone")}
              placeholder="Enter phone number"
              className="h-9"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <Input
              {...register("website")}
              placeholder="Enter website URL"
              className={`h-9 ${errors.website ? "border-red-500" : ""}`}
            />
            {errors.website && (
              <p className="text-red-500 text-xs mt-1">{errors.website.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-3">
        <h3 className="text-base font-medium">Address Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street *
            </label>
            <Input
              {...register("street")}
              placeholder="Enter street address"
              className={`h-9 ${errors.street ? "border-red-500" : ""}`}
            />
            {errors.street && (
              <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Suite *
            </label>
            <Input
              {...register("suite")}
              placeholder="Enter suite/apt"
              className={`h-9 ${errors.suite ? "border-red-500" : ""}`}
            />
            {errors.suite && (
              <p className="text-red-500 text-xs mt-1">{errors.suite.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <Input
              {...register("city")}
              placeholder="Enter city"
              className={`h-9 ${errors.city ? "border-red-500" : ""}`}
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zipcode *
            </label>
            <Input
              {...register("zipcode")}
              placeholder="Enter zipcode"
              className={`h-9 ${errors.zipcode ? "border-red-500" : ""}`}
            />
            {errors.zipcode && (
              <p className="text-red-500 text-xs mt-1">{errors.zipcode.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="space-y-3">
        <h3 className="text-base font-medium">Company Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <Input
              {...register("companyName")}
              placeholder="Enter company name"
              className={`h-9 ${errors.companyName ? "border-red-500" : ""}`}
            />
            {errors.companyName && (
              <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catch Phrase
            </label>
            <Input
              {...register("companyCatchPhrase")}
              placeholder="Enter company catch phrase"
              className="h-9"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company BS
            </label>
            <Input
              {...register("companyBs")}
              placeholder="Enter company BS"
              className="h-9"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding User..." : "Add User"}
        </Button>
      </div>
    </form>
  );
}