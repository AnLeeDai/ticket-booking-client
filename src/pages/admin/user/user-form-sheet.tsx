import { useEffect } from "react";
import {
    useForm,
    Controller,
    type Path,
    type UseFormSetError,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { ApiError } from "@/types/api-response";
import type { User, UserUpdatePayload } from "@/types/user-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const userFormSchema = z.object({
    full_name: z
        .string()
        .min(1, "Họ tên là bắt buộc.")
        .max(255, "Họ tên không được vượt quá 255 ký tự."),
    user_name: z
        .string()
        .min(1, "Tên đăng nhập là bắt buộc.")
        .max(50, "Tên đăng nhập không được vượt quá 50 ký tự."),
    phone: z
        .string()
        .max(20, "Số điện thoại không được vượt quá 20 ký tự.")
        .optional(),
    dob: z
        .string()
        .optional()
        .refine((v) => !v || !Number.isNaN(Date.parse(v)), "Ngày sinh không hợp lệ."),
    address: z
        .string()
        .max(255, "Địa chỉ không được vượt quá 255 ký tự.")
        .optional(),
    avatar_url: z
        .string()
        .max(500, "Avatar URL không được vượt quá 500 ký tự.")
        .optional()
        .refine(
            (v) => !v || z.string().url().safeParse(v).success,
            "Avatar URL không hợp lệ.",
        ),
    status: z.enum(["IN_ACTIVE", "UN_ACTIVE"]),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingUser: User | null;
    onSubmit: (payload: UserUpdatePayload) => Promise<void>;
    isPending: boolean;
}

const backendFieldMap: Record<string, Path<UserFormValues>> = {
    full_name: "full_name",
    user_name: "user_name",
    username: "user_name",
    phone: "phone",
    dob: "dob",
    address: "address",
    avatar_url: "avatar_url",
    status: "status",
};

function applyBackendFieldErrors(
    error: unknown,
    setError: UseFormSetError<UserFormValues>,
): boolean {
    const apiError = error as ApiError;
    const backendErrors = apiError?.errors;
    if (!backendErrors) return false;

    let hasFieldError = false;

    Object.entries(backendErrors).forEach(([field, value]) => {
        const formField = backendFieldMap[field];
        if (!formField) return;

        const message = Array.isArray(value) ? value[0] : value;
        if (!message) return;

        hasFieldError = true;
        setError(formField, { type: "server", message: String(message) });
    });

    return hasFieldError;
}

export function UserFormDialog({
    open,
    onOpenChange,
    editingUser,
    onSubmit,
    isPending,
}: UserFormSheetProps) {
    const {
        control,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            full_name: "",
            user_name: "",
            phone: "",
            dob: "",
            address: "",
            avatar_url: "",
            status: "IN_ACTIVE",
        },
    });

    useEffect(() => {
        if (open) {
            reset({
                full_name: editingUser?.full_name ?? "",
                user_name: editingUser?.user_name ?? editingUser?.username ?? "",
                phone: editingUser?.phone ?? "",
                dob: editingUser?.dob?.slice(0, 10) ?? "",
                address: editingUser?.address ?? "",
                avatar_url: editingUser?.avatar_url ?? "",
                status: editingUser?.status ?? "IN_ACTIVE",
            });
            clearErrors();
        }
    }, [open, editingUser, reset, clearErrors]);

    const internalSubmit = async (values: UserFormValues) => {
        clearErrors();

        const payload: UserUpdatePayload = {
            full_name: values.full_name,
            user_name: values.user_name,
            phone: values.phone?.trim() ? values.phone.trim() : null,
            dob: values.dob?.trim() ? values.dob : null,
            address: values.address?.trim() ? values.address.trim() : null,
            avatar_url: values.avatar_url?.trim() ? values.avatar_url.trim() : null,
            status: values.status,
        };

        try {
            await onSubmit(payload);
        } catch (error) {
            applyBackendFieldErrors(error, setError);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
                </DialogHeader>

            <form
            id="user-form"
            onSubmit={handleSubmit(internalSubmit)}
            className="flex flex-col gap-4 px-6 pb-6 flex-1 overflow-y-auto"
            >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                <Label htmlFor="full_name">
                    Họ tên <span className="text-destructive">*</span>
                </Label>
                <Controller
                    name="full_name"
                    control={control}
                    render={({ field }) => (
                    <Input
                        id="full_name"
                        placeholder="Nhập họ tên"
                        aria-invalid={!!errors.full_name}
                        {...field}
                    />
                    )}
                />
                {errors.full_name && (
                    <p className="text-destructive text-sm">{errors.full_name.message}</p>
                )}
                </div>

                <div className="flex flex-col gap-1.5">
                <Label htmlFor="user_name">
                    Tên đăng nhập <span className="text-destructive">*</span>
                </Label>
                <Controller
                    name="user_name"
                    control={control}
                    render={({ field }) => (
                    <Input
                        id="user_name"
                        placeholder="Nhập tên đăng nhập"
                        aria-invalid={!!errors.user_name}
                        {...field}
                    />
                    )}
                />
                {errors.user_name && (
                    <p className="text-destructive text-sm">{errors.user_name.message}</p>
                )}
                </div>

                <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    value={editingUser?.email ?? ""}
                    disabled
                    readOnly
                />
                </div>

                <div className="flex flex-col gap-1.5">
                <Label htmlFor="role_name">Vai trò</Label>
                <Input
                    id="role_name"
                    value={editingUser?.role?.name ?? "—"}
                    disabled
                    readOnly
                />
                </div>

                <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                    <Input
                        id="phone"
                        placeholder="Nhập số điện thoại"
                        aria-invalid={!!errors.phone}
                        {...field}
                    />
                    )}
                />
                {errors.phone && (
                    <p className="text-destructive text-sm">{errors.phone.message}</p>
                )}
                </div>

                <div className="flex flex-col gap-1.5">
                <Label htmlFor="dob">Ngày sinh</Label>
                <Controller
                    name="dob"
                    control={control}
                    render={({ field }) => (
                    <Input
                        id="dob"
                        type="date"
                        aria-invalid={!!errors.dob}
                        {...field}
                    />
                    )}
                />
                {errors.dob && (
                    <p className="text-destructive text-sm">{errors.dob.message}</p>
                )}
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                    <Input
                        id="address"
                        placeholder="Nhập địa chỉ"
                        aria-invalid={!!errors.address}
                        {...field}
                    />
                    )}
                />
                {errors.address && (
                    <p className="text-destructive text-sm">{errors.address.message}</p>
                )}
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                <Label htmlFor="avatar_url">Avatar URL</Label>
                <Controller
                    name="avatar_url"
                    control={control}
                    render={({ field }) => (
                    <Input
                        id="avatar_url"
                        placeholder="https://example.com/avatar.jpg"
                        aria-invalid={!!errors.avatar_url}
                        {...field}
                    />
                    )}
                />
                {errors.avatar_url && (
                    <p className="text-destructive text-sm">{errors.avatar_url.message}</p>
                )}
                </div>

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
                        <SelectItem value="IN_ACTIVE">Đang hoạt động</SelectItem>
                        <SelectItem value="UN_ACTIVE">Ngừng hoạt động</SelectItem>
                        </SelectContent>
                    </Select>
                    )}
                />
                {errors.status && (
                    <p className="text-destructive text-sm">{errors.status.message}</p>
                )}
                </div>
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
            <Button type="submit" form="user-form" disabled={isPending}>
                {isPending && <Spinner className="size-4" />}
                Lưu thay đổi
            </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
