import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";

import { createColumns } from "./column";
import { DataTable } from "./data-table";
import { MovieFilters } from "./movie-filters";
import { MovieFormDialog } from "./movie-form-sheet";
import { MovieDeleteDialog } from "./movie-delete-dialog";

import {
  useListMovies,
  useCreateMovie,
  useUpdateMovie,
  useDeleteMovie,
} from "@/api/hooks/useMovies";
import type { Movie, MoviePayload } from "@/types/movie-types";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function MoviePage() {
  // ── Query param state ──
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("release_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  // ── Sheet / dialog state ──
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [deletingMovie, setDeletingMovie] = useState<Movie | null>(null);

  // ── Debounce search ──
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Data ──
  const { data, isLoading } = useListMovies(
    {
      search: debouncedSearch,
      sort_by: sortBy,
      sort_order: sortOrder,
      per_page: 10,
      page,
    },
    { placeholderData: (prev) => prev },
  );

  const movies = data?.data?.items ?? [];
  const pagination = data?.data?.pagination;
  const lastPage = pagination?.last_page ?? 1;
  const total = pagination?.total ?? 0;

  // ── Mutations ──
  const { mutateAsync: createMovie, isPending: isCreating } = useCreateMovie({
    onSuccess: (res) => {
      toast.success(res.message || "Tạo phim thành công!");
      setSheetOpen(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutateAsync: updateMovie, isPending: isUpdating } = useUpdateMovie({
    onSuccess: (res) => {
      toast.success(res.message || "Cập nhật phim thành công!");
      setSheetOpen(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutateAsync: deleteMovie, isPending: isDeleting } = useDeleteMovie({
    onSuccess: (res) => {
      toast.success(res.message || "Xóa phim thành công!");
      setDeletingMovie(null);
    },
    onError: (err) => toast.error(err.message),
  });

  // ── Handlers ──
  const openCreate = useCallback(() => {
    setEditingMovie(null);
    setSheetOpen(true);
  }, []);

  const openEdit = useCallback((movie: Movie) => {
    setEditingMovie(movie);
    setSheetOpen(true);
  }, []);

  const handleFormSubmit = async (payload: MoviePayload) => {
    if (editingMovie) {
      await updateMovie({ id: editingMovie.movie_id, payload });
    } else {
      await createMovie(payload);
    }
  };

  const columns = createColumns(openEdit, (movie) => setDeletingMovie(movie));

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Quản lý phim</h1>
          <p className="text-muted-foreground text-sm">
            Tổng cộng {total} phim
          </p>
        </div>
        <Button onClick={openCreate}>
          <PlusIcon />
          Thêm phim
        </Button>
      </div>

      {/* Filters */}
      <MovieFilters
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
        <DataTable columns={columns} data={movies} />
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

      {/* Create / Edit dialog */}
      <MovieFormDialog
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        editingMovie={editingMovie}
        onSubmit={handleFormSubmit}
        isPending={isCreating || isUpdating}
      />

      {/* Delete dialog */}
      <MovieDeleteDialog
        movie={deletingMovie}
        onOpenChange={(open) => !open && setDeletingMovie(null)}
        onConfirm={() => deletingMovie && deleteMovie(deletingMovie.movie_id)}
        isPending={isDeleting}
      />
    </div>
  );
}
