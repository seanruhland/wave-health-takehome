import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "./button";
import type { Column } from "@tanstack/react-table";

interface SortableHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  children: React.ReactNode;
}

export function SortableHeader<TData, TValue>({
  column,
  children,
}: SortableHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className="h-4">{children}</div>;
  }

  // Determine sort state for ARIA
  let ariaSort: 'none' | 'ascending' | 'descending' = 'none';
  if (column.getIsSorted() === 'asc') ariaSort = 'ascending';
  else if (column.getIsSorted() === 'desc') ariaSort = 'descending';

  // Accessible label
  const label = `Sort by ${typeof children === 'string' ? children : ''}, ${ariaSort}`;

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="h-8 p-0 font-medium hover:bg-transparent"
      aria-label={label}
      aria-sort={ariaSort}
    >
      {children}
      {column.getIsSorted() === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : column.getIsSorted() === "desc" ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
}