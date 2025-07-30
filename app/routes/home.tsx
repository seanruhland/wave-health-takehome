import { useLoaderData, useNavigation, useNavigate } from "react-router";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import type { Route } from "./+types/home";
import { fetchUsers } from "~/lib/api";
import type { User } from "~/types/user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Loading } from "~/components/ui/loading";
import { SortableHeader } from "~/components/ui/sortable-header";
import { Input } from "~/components/ui/input";
import { Modal } from "~/components/ui/modal";
import { UserDetails } from "~/components/user-details";
import { useModal } from "~/contexts/modal-context";
import { Plus } from "lucide-react";

export async function loader() {
  try {
    const users = await fetchUsers();
    return { users };
  } catch (error) {
    console.error("Error loading users:", error);
    return { users: [], error: "Failed to load users" };
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Users - React Router App" },
    { name: "description", content: "User management with TanStack Table" },
  ];
}

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor("name", {
    header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  columnHelper.accessor("username", {
    header: ({ column }) => <SortableHeader column={column}>Username</SortableHeader>,
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  columnHelper.accessor("company", {
    header: "Company",
    cell: (info) => {
      const company = info.getValue();
      if (!company) return "N/A";
      return (
        <div className="text-sm">
          <div className="font-medium">{company.name}</div>
          <div className="text-xs text-muted-foreground">{company.catchPhrase}</div>
        </div>
      );
    },
  }),
];

export default function Home() {
  const { users, error } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { isModalOpen, selectedUser, openModal, closeModal } = useModal();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Show loading state while navigating
  if (navigation.state === "loading") {
    return <Loading message="Loading users..." />;
  }

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const user = row.original;
      const searchValue = filterValue.toLowerCase();

      // Search through all user properties including nested objects
      const searchableText = [
        user.id.toString(),
        user.name,
        user.username,
        user.email,
        user.phone || '',
        user.website || '',
        user.address.street,
        user.address.suite,
        user.address.city,
        user.address.zipcode,
        user.address.geo.lat,
        user.address.geo.lng,
        user.company?.name || '',
        user.company?.catchPhrase || '',
        user.company?.bs || '',
      ].join(' ').toLowerCase();

      return searchableText.includes(searchValue);
    },
    state: {
      sorting,
      globalFilter,
    },
  });

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h2 className="text-red-800 font-semibold">Error Loading Users</h2>
          <p className="text-red-600">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Users</h1>
            <p className="text-gray-600">
              Displaying {users.length} users from JSONPlaceholder API
            </p>
          </div>
          <Button
            onClick={() => navigate("/add-user")}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add User</span>
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search by name, username, email, address, phone, website..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
          <span className="text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} of {table.getRowModel().rows.length} users
          </span>
        </div>
        {globalFilter && (
          <p className="text-xs text-muted-foreground mt-1">
            Searching across all fields including address, phone, and website
          </p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => openModal(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* User Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedUser ? `${selectedUser.name} - Details` : "User Details"}
      >
        {selectedUser && <UserDetails user={selectedUser} />}
      </Modal>
    </div>
  );
}
