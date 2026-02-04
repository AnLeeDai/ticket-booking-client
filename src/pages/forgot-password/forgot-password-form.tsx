import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useForgotPassword } from "@/api/hooks/useForgotPassword";
import { pageRoute } from "@/configs/site-config";

const RESEND_DELAY_SECONDS = 60;

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email là bắt buộc.")
    .email("Định dạng email không hợp lệ."),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const startCountdown = useCallback(() => {
    setCountdown(RESEND_DELAY_SECONDS);
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const { mutateAsync, isPending } = useForgotPassword({
    onSuccess: (data) => {
      toast.success(data.message || "Đã gửi email đặt lại mật khẩu!");
      setIsEmailSent(true);
      startCountdown();
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    await mutateAsync(values);
  };

  const handleResend = async () => {
    const email = getValues("email");
    if (email && countdown === 0) {
      await mutateAsync({ email });
    }
  };

  if (isEmailSent) {
    return (
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Mail className="w-8 h-8 text-primary" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="font-semibold text-lg">Kiểm tra email của bạn</h3>
          <p className="text-sm text-muted-foreground">
            Chúng tôi đã gửi mã đặt lại mật khẩu đến{" "}
            <span className="font-medium text-foreground">
              {getValues("email")}
            </span>
          </p>
        </div>

        <Button
          variant="outline"
          className="mt-2"
          onClick={handleResend}
          disabled={isPending || countdown > 0}
        >
          {isPending ? (
            <Spinner />
          ) : countdown > 0 ? (
            `Gửi lại sau ${countdown}s`
          ) : (
            "Gửi lại email"
          )}
        </Button>

        <Button className="mt-2">
          <Link
            to={`${pageRoute.resetPassword}?email=${encodeURIComponent(getValues("email"))}`}
          >
            Đã nhận được mã
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
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
              placeholder="Nhập email đã đăng ký"
              {...field}
            />
            {errors.email && (
              <FieldDescription className="text-destructive">
                {errors.email.message}
              </FieldDescription>
            )}
          </Field>
        )}
      />

      <Button
        type="submit"
        disabled={isSubmitting || isPending}
        className="mt-2"
      >
        {isPending ? <Spinner /> : "Gửi mã đặt lại"}
      </Button>
    </form>
  );
}
