import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Movie, MoviePayload } from "@/types/movie-types";
import { useListCategories } from "@/api/hooks/useCategories";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// ── Schema ────────────────────────────────────────────────────────────────────

const movieFormSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc."),
  name: z.string().min(1, "Tên phim là bắt buộc."),
  description: z.string().optional(),
  thumb_url: z.string().optional(),
  trailer_url: z.string().optional(),
  gallery_raw: z.string().optional(),
  duration: z.coerce
    .number()
    .min(1, "Thời lượng phải lớn hơn 0."),
  language: z.string().optional(),
  age: z.string().optional(),
  rating: z
    .string()
    .optional()
    .refine(
      (v) => !v || (parseFloat(v) >= 0 && parseFloat(v) <= 10),
      "Điểm đánh giá phải từ 0 đến 10.",
    ),
  release_date: z.string().min(1, "Ngày phát hành là bắt buộc."),
  end_date: z.string().optional(),
  status: z.enum(["IS_PENDING", "IS_ACTIVE", "IN_ACTIVE"]),
  genre_id: z.string().optional(),
  category_ids: z.array(z.string()).optional(),
});

type MovieFormValues = z.infer<typeof movieFormSchema>;

// ── Props ─────────────────────────────────────────────────────────────────────

interface MovieFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingMovie: Movie | null;
  onSubmit: (payload: MoviePayload) => Promise<void>;
  isPending: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function MovieFormDialog({
  open,
  onOpenChange,
  editingMovie,
  onSubmit,
  isPending,
}: MovieFormSheetProps) {
  const { data: categoriesData } = useListCategories(
    { per_page: 100, sort_by: "name", sort_order: "asc" },
    { enabled: open },
  );
  const categories = categoriesData?.data?.items ?? [];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MovieFormValues>({
    resolver: zodResolver(movieFormSchema),
    defaultValues: {
      title: "",
      name: "",
      description: "",
      thumb_url: "",
      trailer_url: "",
      gallery_raw: "",
      duration: 0,
      language: "",
      age: "",
      rating: "",
      release_date: "",
      end_date: "",
      status: "IS_PENDING",
      genre_id: "",
      category_ids: [],
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: editingMovie?.title ?? "",
        name: editingMovie?.name ?? "",
        description: editingMovie?.description ?? "",
        thumb_url: editingMovie?.thumb_url ?? "",
        trailer_url: editingMovie?.trailer_url ?? "",
        gallery_raw: editingMovie?.gallery?.join("\n") ?? "",
        duration: editingMovie?.duration ?? 0,
        language: editingMovie?.language ?? "",
        age: editingMovie?.age?.toString() ?? "",
        rating: editingMovie?.rating?.toString() ?? "",
        release_date: editingMovie?.release_date?.slice(0, 10) ?? "",
        end_date: editingMovie?.end_date?.slice(0, 10) ?? "",
        status: editingMovie?.status ?? "IS_PENDING",
        genre_id: editingMovie?.genre_id ?? "",
        category_ids: editingMovie?.categories?.map((c) => c.id) ?? [],
      });
    }
  }, [open, editingMovie, reset]);

  const internalSubmit = async (values: MovieFormValues) => {
    const payload: MoviePayload = {
      title: values.title,
      name: values.name,
      ...(values.description && { description: values.description }),
      ...(values.thumb_url && { thumb_url: values.thumb_url }),
      ...(values.trailer_url && { trailer_url: values.trailer_url }),
      gallery:
        values.gallery_raw
          ?.split("\n")
          .map((s) => s.trim())
          .filter(Boolean) ?? [],
      duration: values.duration,
      ...(values.language && { language: values.language }),
      ...(values.age && { age: parseInt(values.age) }),
      ...(values.rating && { rating: parseFloat(values.rating) }),
      release_date: values.release_date,
      ...(values.end_date && { end_date: values.end_date }),
      status: values.status,
      ...(values.genre_id && { genre_id: values.genre_id }),
      category_ids: values.category_ids ?? [],
    };
    await onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingMovie ? "Chỉnh sửa phim" : "Thêm phim mới"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6">
          <form
            id="movie-form"
            onSubmit={handleSubmit(internalSubmit)}
            className="flex flex-col gap-4 pb-4"
          >
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">
                Tiêu đề <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    id="title"
                    placeholder="Nhập tiêu đề phim"
                    aria-invalid={!!errors.title}
                    {...field}
                  />
                )}
              />
              {errors.title && (
                <p className="text-destructive text-sm">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">
                Tên phim <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    id="name"
                    placeholder="Nhập tên phim"
                    aria-invalid={!!errors.name}
                    {...field}
                  />
                )}
              />
              {errors.name && (
                <p className="text-destructive text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Mô tả</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="description"
                    placeholder="Nhập mô tả phim"
                    {...field}
                  />
                )}
              />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="status">
                Trạng thái <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(v) => {
                      if (v) field.onChange(v);
                    }}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IS_PENDING">Chờ duyệt</SelectItem>
                      <SelectItem value="IS_ACTIVE">Đang chiếu</SelectItem>
                      <SelectItem value="IN_ACTIVE">Ngừng chiếu</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Duration */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="duration">
                Thời lượng (phút) <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="duration"
                control={control}
                render={({ field }) => (
                  <Input
                    id="duration"
                    type="number"
                    min={1}
                    placeholder="VD: 120"
                    aria-invalid={!!errors.duration}
                    {...field}
                  />
                )}
              />
              {errors.duration && (
                <p className="text-destructive text-sm">
                  {errors.duration.message}
                </p>
              )}
            </div>

            {/* Release date */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="release_date">
                Ngày phát hành <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="release_date"
                control={control}
                render={({ field }) => (
                  <Input
                    id="release_date"
                    type="date"
                    aria-invalid={!!errors.release_date}
                    {...field}
                  />
                )}
              />
              {errors.release_date && (
                <p className="text-destructive text-sm">
                  {errors.release_date.message}
                </p>
              )}
            </div>

            {/* End date */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="end_date">Ngày kết thúc</Label>
              <Controller
                name="end_date"
                control={control}
                render={({ field }) => (
                  <Input id="end_date" type="date" {...field} />
                )}
              />
            </div>

            {/* Language */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="language">Ngôn ngữ</Label>
              <Controller
                name="language"
                control={control}
                render={({ field }) => (
                  <Input
                    id="language"
                    placeholder="VD: Tiếng Anh - Phụ đề Việt"
                    {...field}
                  />
                )}
              />
            </div>

            {/* Age & Rating */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="age">Độ tuổi</Label>
                <Controller
                  name="age"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="age"
                      type="number"
                      min={0}
                      placeholder="VD: 13"
                      aria-invalid={!!errors.age}
                      {...field}
                    />
                  )}
                />
                {errors.age && (
                  <p className="text-destructive text-sm">
                    {errors.age.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="rating">Điểm (0–10)</Label>
                <Controller
                  name="rating"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="rating"
                      type="number"
                      min={0}
                      max={10}
                      step={0.1}
                      placeholder="VD: 8.5"
                      aria-invalid={!!errors.rating}
                      {...field}
                    />
                  )}
                />
                {errors.rating && (
                  <p className="text-destructive text-sm">
                    {errors.rating.message}
                  </p>
                )}
              </div>
            </div>

            {/* Thumbnail URL */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="thumb_url">URL ảnh đại diện</Label>
              <Controller
                name="thumb_url"
                control={control}
                render={({ field }) => (
                  <Input
                    id="thumb_url"
                    placeholder="https://..."
                    {...field}
                  />
                )}
              />
            </div>

            {/* Trailer URL */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="trailer_url">URL trailer</Label>
              <Controller
                name="trailer_url"
                control={control}
                render={({ field }) => (
                  <Input
                    id="trailer_url"
                    placeholder="https://youtube.com/..."
                    {...field}
                  />
                )}
              />
            </div>

            {/* Gallery */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="gallery_raw">
                Ảnh gallery (mỗi URL một dòng)
              </Label>
              <Controller
                name="gallery_raw"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="gallery_raw"
                    placeholder={"https://example.com/img1.jpg\nhttps://example.com/img2.jpg"}
                    {...field}
                  />
                )}
              />
            </div>

            {/* Genre */}
            {categories.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="genre_id">Thể loại chính (genre)</Label>
                <Controller
                  name="genre_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="genre_id">
                        <SelectValue placeholder="Chọn thể loại chính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Không chọn</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}

            {/* Category IDs */}
            {categories.length > 0 && (
              <div className="flex flex-col gap-2">
                <Label>Danh mục</Label>
                <Controller
                  name="category_ids"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-2 rounded-md border p-3">
                      {categories.map((cat) => {
                        const checked =
                          field.value?.includes(cat.id) ?? false;
                        return (
                          <div
                            key={cat.id}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              id={`cat-${cat.id}`}
                              checked={checked}
                              onChange={(e) => {
                                const ids = field.value ?? [];
                                field.onChange(
                                  e.target.checked
                                    ? [...ids, cat.id]
                                    : ids.filter((id) => id !== cat.id),
                                );
                              }}
                              className="size-4 rounded"
                            />
                            <Label htmlFor={`cat-${cat.id}`}>
                              {cat.name}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  )}
                />
              </div>
            )}
          </form>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button type="submit" form="movie-form" disabled={isPending}>
            {isPending && <Spinner className="size-4" />}
            {editingMovie ? "Lưu thay đổi" : "Tạo phim"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
