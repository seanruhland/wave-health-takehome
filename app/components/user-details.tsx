import type { User } from "~/types/user";
import { Mail, Phone, Globe, MapPin, Building, User as UserIcon } from "lucide-react";

interface UserDetailsProps {
  user: User;
}

export function UserDetails({ user }: UserDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <UserIcon className="h-5 w-5 text-gray-500" />
          <div>
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-600">@{user.username}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <a
              href={`mailto:${user.email}`}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {user.email}
            </a>
          </div>

          {user.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <a
                href={`tel:${user.phone}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {user.phone}
              </a>
            </div>
          )}

          {user.website && (
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-gray-500" />
              <a
                href={`https://${user.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {user.website}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-gray-500" />
          <h4 className="font-medium">Address</h4>
        </div>
        <div className="pl-7 space-y-1 text-sm">
          <p>{user.address.street}</p>
          <p>{user.address.suite}</p>
          <p>{user.address.city}, {user.address.zipcode}</p>
          <p className="text-gray-600">
            Coordinates: {user.address.geo.lat}, {user.address.geo.lng}
          </p>
        </div>
      </div>

      {/* Company */}
      {user.company && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Building className="h-5 w-5 text-gray-500" />
            <h4 className="font-medium">Company</h4>
          </div>
          <div className="pl-7 space-y-2">
            <div>
              <p className="font-medium">{user.company.name}</p>
              <p className="text-sm text-gray-600 italic">"{user.company.catchPhrase}"</p>
            </div>
            <p className="text-sm text-gray-600">{user.company.bs}</p>
          </div>
        </div>
      )}

      {/* ID */}
      <div className="pt-4 border-t">
        <p className="text-xs text-gray-500">User ID: {user.id}</p>
      </div>
    </div>
  );
}