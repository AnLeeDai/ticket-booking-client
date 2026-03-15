import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Category } from "@/types/category-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const categorySchema = z.object({
  name: z.string().min(1, "Tên danh mục là bắt buộc."),
  description: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: Category | null;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
  isPending: boolean;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  editingCategory,
  onSubmit,
  isPending,
}: CategoryFormSheetProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: editingCategory?.name ?? "",
        description: editingCategory?.description ?? "",
      });
    }
  }, [open, editingCategory, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </DialogTitle>
        </DialogHeader>

        <form
          id="category-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 px-6 pb-6 flex-1 overflow-y-auto"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">
              Tên danh mục <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  id="name"
                  placeholder="Nhập tên danh mục"
                  aria-invalid={!!errors.name}
                  {...field}
                />
              )}
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Mô tả</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="description"
                  placeholder="Nhập mô tả (tuỳ chọn)"
                  {...field}
                />
              )}
            />
          </div>
        </form>

        <DialogFooter>
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button type="submit" form="category-form" disabled={isPending}>
            {isPending && <Spinner className="size-4" />}
            {editingCategory ? "Lưu thay đổi" : "Tạo danh mục"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
