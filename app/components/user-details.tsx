import type { User } from "~/types/user";
import { Mail, Phone, Globe, MapPin, Building, User as UserIcon, X } from "lucide-react";
import { Button } from "~/components/ui/button";

interface UserDetailsProps {
  user: User;
  onClose?: () => void;
}

export function UserDetails({ user, onClose }: UserDetailsProps) {
  return (
    <div className="space-y-6">
      {/* User Header */}
      <div className="flex items-center justify-between pb-4 border-b dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <UserIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{user.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">@{user.username} • ID: {user.id}</p>
          </div>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}
      </div>

      {/* Contact Info */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <a
            href={`mailto:${user.email}`}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
          >
            {user.email}
          </a>
        </div>

        {user.phone && (
          <div className="flex items-center space-x-3">
            <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <a
              href={`tel:${user.phone}`}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              {user.phone}
            </a>
          </div>
        )}

        {user.website && (
          <div className="flex items-center space-x-3">
            <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <a
              href={`https://${user.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
            >
              {user.website}
            </a>
          </div>
        )}
      </div>

      {/* Address */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Address</h4>
        </div>
        <div className="pl-6 space-y-1 text-sm text-gray-900 dark:text-gray-100">
          <p>{user.address.street}</p>
          <p>{user.address.suite}</p>
          <p>{user.address.city}, {user.address.zipcode}</p>
          <p className="text-gray-600 dark:text-gray-400 text-xs">
            Coordinates: {user.address.geo.lat}, {user.address.geo.lng}
          </p>
        </div>
      </div>

      {/* Company */}
      {user.company && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Building className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Company</h4>
          </div>
          <div className="pl-6 space-y-1">
            <p className="font-medium text-gray-900 dark:text-gray-100">{user.company.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{user.company.catchPhrase}"</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{user.company.bs}</p>
          </div>
        </div>
      )}
    </div>
  );
}