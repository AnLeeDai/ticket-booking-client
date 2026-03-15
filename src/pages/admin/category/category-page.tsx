import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";

import { createColumns } from "./column";
import { DataTable } from "./data-table";
import { CategoryFilters } from "./category-filters";
import {
  CategoryFormSheet,
  type CategoryFormValues,
} from "./category-form-sheet";
import { CategoryDeleteDialog } from "./category-delete-dialog";

import {
  useListCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/api/hooks/useCategories";
import type { Category } from "@/types/category-types";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function CategoryPage() {
  // ── Query param state ──
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  // ── Sheet / dialog state ──
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );

  // ── Debounce search ──
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Data ──
  const { data, isLoading } = useListCategories(
    { search: debouncedSearch, sort_by: sortBy, sort_order: sortOrder, per_page: 20, page },
    { placeholderData: (prev) => prev },
  );

  const categories = data?.data?.items ?? [];
  const pagination = data?.data?.pagination;
  const lastPage = pagination?.last_page ?? 1;
  const total = pagination?.total ?? 0;

  // ── Mutations ──
  const { mutateAsync: createCategory, isPending: isCreating } =
    useCreateCategory({
      onSuccess: (res) => {
        toast.success(res.message || "Tạo danh mục thành công!");
        setSheetOpen(false);
      },
      onError: (err) => toast.error(err.message),
    });

  const { mutateAsync: updateCategory, isPending: isUpdating } =
    useUpdateCategory({
      onSuccess: (res) => {
        toast.success(res.message || "Cập nhật danh mục thành công!");
        setSheetOpen(false);
      },
      onError: (err) => toast.error(err.message),
    });

  const { mutateAsync: deleteCategory, isPending: isDeleting } =
    useDeleteCategory({
      onSuccess: (res) => {
        toast.success(res.message || "Xóa danh mục thành công!");
        setDeletingCategory(null);
      },
      onError: (err) => toast.error(err.message),
    });

  // ── Handlers ──
  const openCreate = useCallback(() => {
    setEditingCategory(null);
    setSheetOpen(true);
  }, []);

  const openEdit = useCallback((category: Category) => {
    setEditingCategory(category);
    setSheetOpen(true);
  }, []);

  const handleFormSubmit = async (values: CategoryFormValues) => {
    if (editingCategory) {
      await updateCategory({ id: editingCategory.id, payload: values });
    } else {
      await createCategory(values);
    }
  };

  const columns = createColumns(openEdit, (category) =>
    setDeletingCategory(category),
  );

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Quản lý danh mục</h1>
          <p className="text-muted-foreground text-sm">
            Tổng cộng {total} danh mục
          </p>
        </div>
        <Button onClick={openCreate}>
          <PlusIcon />
          Thêm danh mục
        </Button>
      </div>

      {/* Filters */}
      <CategoryFilters
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

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <DataTable columns={columns} data={categories} />
      )}

      {/* Pagination */}
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

      {/* Create / Edit sheet */}
      <CategoryFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        editingCategory={editingCategory}
        onSubmit={handleFormSubmit}
        isPending={isCreating || isUpdating}
      />

      {/* Delete dialog */}
      <CategoryDeleteDialog
        category={deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
        onConfirm={() => deletingCategory && deleteCategory(deletingCategory.id)}
        isPending={isDeleting}
      />
    </div>
  );
}

