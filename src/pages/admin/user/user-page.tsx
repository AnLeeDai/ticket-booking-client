import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";

import { createColumns } from "./column";
import { DataTable } from "./data-table";
import { UserFilters } from "./user-filters";
import { UserFormDialog } from "./user-form-sheet";
import { UserDeleteDialog } from "./user-delete-dialog";

import {
  useListUsers,
  useUpdateUser,
  useDeleteUser,
} from "@/api/hooks/useUsers";
import type { User, UserUpdatePayload } from "@/types/user-types";

import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

export default function UserPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useListUsers(
    {
      search: debouncedSearch,
      sort_by: sortBy,
      sort_order: sortOrder,
      per_page: 15,
      page,
    },
    { placeholderData: (prev) => prev },
  );

  const users = data?.data?.items ?? [];
  const pagination = data?.data?.pagination;
  const lastPage = pagination?.last_page ?? 1;
  const total = pagination?.total ?? 0;

  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser({
    onSuccess: (res) => {
      toast.success(res.message || "Cập nhật người dùng thành công!");
      setSheetOpen(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutateAsync: deleteUser, isPending: isDeleting } = useDeleteUser({
    onSuccess: (res) => {
      toast.success(res.message || "Xóa người dùng thành công!");
      setDeletingUser(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const openEdit = useCallback((user: User) => {
    setEditingUser(user);
    setSheetOpen(true);
  }, []);

  const handleFormSubmit = async (payload: UserUpdatePayload) => {
    if (!editingUser) return;
    await updateUser({ userId: editingUser.user_id, payload });
  };

  const columns = createColumns(openEdit, (user) => setDeletingUser(user));

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Quản lý người dùng</h1>
          <p className="text-muted-foreground text-sm">
            Tổng cộng {total} người dùng
          </p>
        </div>
      </div>

      <UserFilters
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortByChange={(v) => {
          setSortBy(v);
          setPage(1);
        }}
        sortOrder={sortOrder}
        onSortOrderChange={(v) => {
          setSortOrder(v);
          setPage(1);
        }}
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <DataTable columns={columns} data={users} />
      )}

      {lastPage > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Trang {page} / {lastPage}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
              disabled={page >= lastPage}
            >
              Tiếp
            </Button>
          </div>
        </div>
      )}

      <UserFormDialog
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        editingUser={editingUser}
        onSubmit={handleFormSubmit}
        isPending={isUpdating}
      />

      <UserDeleteDialog
        user={deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
        onConfirm={() => deletingUser && deleteUser(deletingUser.user_id)}
        isPending={isDeleting}
      />
    </div>
  );
}
