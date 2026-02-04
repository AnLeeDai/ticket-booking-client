import { Link, useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import useDeviceName from "@/hooks/use-device-name";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useLogin } from "@/api/hooks/useLogin";
import { pageRoute } from "@/configs/site-config";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

const loginSchema = z.object({
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

  device_name: z
    .string()
    .min(1, "Tên thiết bị là bắt buộc.")
    .max(100, "Tên thiết bị không được vượt quá 100 ký tự."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const getRedirectByRole = (role: string): string => {
  switch (role) {
    case "admin":
      return pageRoute.adminDashboard;
    case "employee":
      return pageRoute.employeeDashboard;
    case "customer":
      return pageRoute.customerDashboard;
    default:
      return pageRoute.home;
  }
};

export default function LoginForm() {
  const navigate = useNavigate();

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      device_name: useDeviceName(),
    },
  });

  const { mutateAsync, isPending } = useLogin({
    onSuccess: (data) => {
      toast.success(data.message || "Đăng nhập thành công!");

      // Redirect based on user role
      const redirectPath = getRedirectByRole(data.data.role);
      navigate(redirectPath);
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    await mutateAsync(values);
  };

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
            <Input type="email" placeholder="Nhập email của bạn" {...field} />
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
            <div className="flex items-center justify-between">
              <FieldLabel>
                Mật khẩu
                <span className="text-destructive">*</span>
              </FieldLabel>
              <Link
                to={pageRoute.forgotPassword}
                tabIndex={-1}
                className="text-sm text-primary hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="Nhập mật khẩu của bạn"
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

      <Field hidden>
        <FieldLabel>Tên thiết bị</FieldLabel>
        <Input
          type="text"
          placeholder="Nhập tên thiết bị"
          // eslint-disable-next-line react-hooks/incompatible-library
          value={watch("device_name")}
          disabled
        />
        {errors.device_name && (
          <FieldDescription className="text-destructive">
            {errors.device_name.message}
          </FieldDescription>
        )}
      </Field>

      <Button type="submit" disabled={isSubmitting} className="mt-2">
        {isPending ? <Spinner /> : "Đăng nhập"}
      </Button>

      <div className="flex items-center gap-4 my-2 text-sm text-muted-foreground">
        <Separator className="flex-1" />
        <span>hoặc</span>
        <Separator className="flex-1" />
      </div>


    </form>
  );
}
