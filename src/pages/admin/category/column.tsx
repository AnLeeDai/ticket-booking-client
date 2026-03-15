import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Category } from "@/types/category-types";

export type { Category };

export const createColumns = (
  onEdit: (category: Category) => void,
  onDelete: (category: Category) => void,
): ColumnDef<Category>[] => [
  { accessorKey: "name", header: "Tên danh mục" },
  { accessorKey: "slug", header: "Slug" },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => row.original.description ?? "—",
  },
  {
    accessorKey: "created_at",
    header: "Ngày tạo",
    cell: ({ row }) =>
      moment(row.original.created_at).format("DD/MM/YYYY HH:mm"),
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          size="icon-sm"
          variant="outline"
          onClick={() => onEdit(row.original)}
        >
          <Pencil />
        </Button>
        <Button
          size="icon-sm"
          variant="destructive"
          onClick={() => onDelete(row.original)}
        >
          <Trash2 />
        </Button>
      </div>
    ),
  },
];
