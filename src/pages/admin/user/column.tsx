import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { User, UserStatus } from "@/types/user-types";

export type { User };

const statusMap: Record<
  UserStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  IN_ACTIVE: { label: "Đang hoạt động", variant: "default" },
  UN_ACTIVE: { label: "Ngừng hoạt động", variant: "destructive" },
};

export const createColumns = (
  onEdit: (user: User) => void,
  onDelete: (user: User) => void,
): ColumnDef<User>[] => [
  { accessorKey: "full_name", header: "Họ tên" },
  {
    accessorKey: "user_name",
    header: "Tên đăng nhập",
    cell: ({ row }) => row.original.user_name || row.original.username || "—",
  },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "phone",
    header: "Số điện thoại",
    cell: ({ row }) => row.original.phone ?? "—",
  },
  {
    accessorKey: "role",
    header: "Vai trò",
    cell: ({ row }) => row.original.role?.name ?? "—",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const { label, variant } = statusMap[row.original.status] ?? {
        label: row.original.status,
        variant: "outline" as const,
      };
      return <Badge variant={variant}>{label}</Badge>;
    },
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
