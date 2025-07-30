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
import { useState, useCallback, useMemo } from "react";
import { Plus, X } from "lucide-react";
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
import { ThemeToggle } from "~/components/ui/theme-toggle";
import { useModal } from "~/contexts/modal-context";
import { ClientOnly } from "~/components/client-only";
import { useDebounce } from "~/hooks/use-debounce";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "~/components/error-boundary";

// Lazy load heavy components
const Modal = lazy(() => import("~/components/ui/modal").then(module => ({ default: module.Modal })));
const UserDetails = lazy(() => import("~/components/user-details").then(module => ({ default: module.UserDetails })));

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
    { title: "Users - Wave Health Users" },
    { name: "description", content: "Wave Health User Take Home Assignment" },
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
          <div className="font-medium text-gray-900 dark:text-gray-100">{company.name}</div>
          <div className="text-xs text-muted-foreground dark:text-gray-400">{company.catchPhrase}</div>
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
  const debouncedGlobalFilter = useDebounce(globalFilter, 300);

  // Memoize columns to prevent unnecessary re-renders
  const memoizedColumns = useMemo(() => columns, []);

  const globalFilterFn = useCallback((row: any, columnId: string, filterValue: string) => {
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
  }, []);

  const table = useReactTable({
    data: users || [],
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    state: {
      sorting,
      globalFilter: debouncedGlobalFilter,
    },
    // Ensure consistent rendering between server and client
    enableSorting: true,
    enableGlobalFilter: true,
  });

  // Show loading state while navigating
  if (navigation.state === "loading") {
    return <Loading message="Loading users..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <h2 className="text-red-800 dark:text-red-200 font-semibold">Error Loading Users</h2>
          <p className="text-red-600 dark:text-red-300">{error}</p>
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
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Users</h1>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              Displaying {table.getFilteredRowModel().rows.length} of {users.length} users from JSONPlaceholder API
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ClientOnly fallback={<div className="h-9 w-9 rounded-md border bg-gray-100 animate-pulse" />}>
              <ThemeToggle />
            </ClientOnly>
            <ClientOnly fallback={<div className="h-9 w-full sm:w-auto rounded-md border bg-gray-100 animate-pulse" />}>
              <Button
                onClick={() => navigate("/add-user")}
                className="flex items-center space-x-2 w-full sm:w-auto h-9"
                aria-label="Add new user"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>Add User</span>
              </Button>
            </ClientOnly>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="w-full">
          <ClientOnly fallback={<div className="h-10 w-full rounded-md border bg-gray-100 animate-pulse" />}>
            <div className="relative">
              <Input
                placeholder="Search by name, username, email, address, phone, website..."
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(event.target.value)}
                aria-label="Search users"
                role="searchbox"
                className="pr-10 w-full"
              />
              {globalFilter && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setGlobalFilter("")}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}
            </div>
          </ClientOnly>
        </div>

        <div className="mt-1 h-3">
          {globalFilter && (
            <span className="text-xs text-muted-foreground" aria-live="polite">
              Searching across all fields including address, phone, and website
            </span>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
        <ErrorBoundary fallback={<div className="p-4 text-center text-red-600">Error loading table. Please refresh the page.</div>}>
          <ClientOnly fallback={<div className="p-4 text-center">Loading table...</div>}>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-b dark:border-gray-700">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-gray-900 dark:text-gray-100">
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
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-b dark:border-gray-700"
                      onClick={() => openModal(row.original)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openModal(row.original);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`View details for ${row.original.name}`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="text-gray-900 dark:text-gray-100">
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
                      colSpan={memoizedColumns.length}
                      className="h-24 text-center text-gray-500 dark:text-gray-400"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ClientOnly>
        </ErrorBoundary>
      </div>

      {/* User Details Modal */}
      <Suspense fallback={<div className="p-4 text-center">Loading modal...</div>}>
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
        >
          {selectedUser && (
            <Suspense fallback={<div className="p-4 text-center">Loading user details...</div>}>
              <UserDetails user={selectedUser} onClose={closeModal} />
            </Suspense>
          )}
        </Modal>
      </Suspense>
    </div>
  );
}
