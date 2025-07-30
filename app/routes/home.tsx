import { useLoaderData, useNavigation } from "react-router";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
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
  columnHelper.accessor("id", {
    header: ({ column }) => <SortableHeader column={column}>ID</SortableHeader>,
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
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
  columnHelper.accessor("email", {
    header: ({ column }) => <SortableHeader column={column}>Email</SortableHeader>,
    cell: (info) => (
      <a
        href={`mailto:${info.getValue()}`}
        className="text-blue-600 hover:text-blue-800 underline"
      >
        {info.getValue()}
      </a>
    ),
    enableSorting: true,
  }),
  columnHelper.accessor("address", {
    header: "Address",
    cell: (info) => {
      const address = info.getValue();
      return (
        <div className="text-sm">
          <div>{address.street}</div>
          <div>{address.suite}</div>
          <div>{address.city}, {address.zipcode}</div>
        </div>
      );
    },
  }),
  columnHelper.accessor("phone", {
    header: "Phone",
    cell: (info) => info.getValue() || "N/A",
  }),
  columnHelper.accessor("website", {
    header: "Website",
    cell: (info) => {
      const website = info.getValue();
      if (!website) return "N/A";
      return (
        <a
          href={`https://${website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {website}
        </a>
      );
    },
  }),
];

export default function Home() {
  const { users, error } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [sorting, setSorting] = useState<SortingState>([]);

  // Show loading state while navigating
  if (navigation.state === "loading") {
    return <Loading message="Loading users..." />;
  }

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Users</h1>
        <p className="text-gray-600">
          Displaying {users.length} users from JSONPlaceholder API
        </p>
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
    </div>
  );
}
