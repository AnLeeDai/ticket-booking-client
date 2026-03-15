import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Movie, MovieStatus } from "@/types/movie-types";

export type { Movie };

const DESCRIPTION_LIMIT = 80;

function DescriptionCell({ text }: { text: string | null }) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  const isTruncated = text.length > DESCRIPTION_LIMIT;
  return (
    <p className="text-muted-foreground text-xs mt-0.5">
      {expanded || !isTruncated ? text : text.slice(0, DESCRIPTION_LIMIT) + "…"}
      {isTruncated && (
        <button
          type="button"
          className="text-primary ml-1 underline-offset-2 hover:underline"
          onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
        >
          {expanded ? "Thu gọn" : "Xem thêm"}
        </button>
      )}
    </p>
  );
}

const statusMap: Record<
  MovieStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  IS_PENDING: { label: "Chờ duyệt", variant: "secondary" },
  IS_ACTIVE: { label: "Đang chiếu", variant: "default" },
  IN_ACTIVE: { label: "Ngừng chiếu", variant: "destructive" },
};

export const createColumns = (
  onEdit: (movie: Movie) => void,
  onDelete: (movie: Movie) => void,
): ColumnDef<Movie>[] => [
  {
    accessorKey: "title",
    header: "Tên phim",
    cell: ({ row }) => (
      <div className="max-w-72">
        <p className="font-medium">{row.original.title}</p>
        {row.original.name !== row.original.title && (
          <p className="text-muted-foreground text-xs">{row.original.name}</p>
        )}
        <DescriptionCell text={row.original.description} />
        {row.original.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {row.original.categories.map((c) => (
              <Badge key={c.id} variant="outline" className="text-xs px-1.5 py-0">
                {c.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "duration",
    header: "Thời lượng",
    cell: ({ row }) => {
      const d = row.original.duration;
      const h = Math.floor(d / 60);
      const m = d % 60;
      return h > 0 ? `${h}h${m > 0 ? `${m}m` : ""}` : `${m}m`;
    },
  },
  {
    accessorKey: "rating",
    header: "Điểm",
    cell: ({ row }) =>
      row.original.rating != null ? `${row.original.rating}/10` : "—",
  },
  {
    accessorKey: "release_date",
    header: "Ngày phát hành",
    cell: ({ row }) =>
      moment(row.original.release_date).format("DD/MM/YYYY"),
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
