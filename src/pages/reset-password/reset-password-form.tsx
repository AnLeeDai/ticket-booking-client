import { useNavigate, useSearchParams } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useResetPassword } from "@/api/hooks/useResetPassword";
import { pageRoute } from "@/configs/site-config";
import { KeyRound } from "lucide-react";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Mã xác nhận là bắt buộc."),

    email: z
      .string()
      .min(1, "Email là bắt buộc.")
      .email("Định dạng email không hợp lệ."),

    password: z
      .string()
      .min(1, "Mật khẩu là bắt buộc.")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự.")
      .regex(
        PASSWORD_REGEX,
        "Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một chữ số và một ký tự đặc biệt.",
      ),

    password_confirmation: z.string().min(1, "Xác nhận mật khẩu là bắt buộc."),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Xác nhận mật khẩu không khớp.",
    path: ["password_confirmation"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tokenFromUrl = searchParams.get("token") || "";
  const emailFromUrl = searchParams.get("email") || "";

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: tokenFromUrl,
      email: emailFromUrl,
      password: "",
      password_confirmation: "",
    },
  });

  const { mutateAsync, isPending } = useResetPassword({
    onSuccess: (data) => {
      toast.success(data.message || "Đặt lại mật khẩu thành công!");
      navigate(pageRoute.login);
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    await mutateAsync(values);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="token"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>
              Mã xác nhận
              <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              type="text"
              placeholder="Nhập mã xác nhận từ email"
              {...field}
            />
            {errors.token && (
              <FieldDescription className="text-destructive">
                {errors.token.message}
              </FieldDescription>
            )}
          </Field>
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>
              Email
              <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              type="email"
              placeholder="Nhập email của bạn"
              {...field}
              disabled={!!emailFromUrl}
            />
            {errors.email && (
              <FieldDescription className="text-destructive">
                {errors.email.message}
              </FieldDescription>
            )}
          </Field>
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>
              Mật khẩu mới
              <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              type="password"
              placeholder="Nhập mật khẩu mới"
              {...field}
            />
            {errors.password && (
              <FieldDescription className="text-destructive">
                {errors.password.message}
              </FieldDescription>
            )}
          </Field>
        )}
      />

      <Controller
        name="password_confirmation"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>
              Xác nhận mật khẩu
              <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              {...field}
            />
            {errors.password_confirmation && (
              <FieldDescription className="text-destructive">
                {errors.password_confirmation.message}
              </FieldDescription>
            )}
          </Field>
        )}
      />

      <Button type="submit" disabled={isSubmitting || isPending} className="mt-2">
        {isPending ? <Spinner /> : <><KeyRound className="size-4" /> Đặt lại mật khẩu</>}
      </Button>
    </form>
  );
}
