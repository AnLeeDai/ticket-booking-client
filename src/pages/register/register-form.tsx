import { useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import useDeviceName from "@/hooks/use-device-name";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRegister } from "@/api/hooks/useRegister";
import { pageRoute } from "@/configs/site-config";
import { UserPlus } from "lucide-react";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
const PHONE_REGEX = /^[0-9]{10,11}$/;

const registerSchema = z
  .object({
    full_name: z
      .string()
      .min(1, "Họ tên là bắt buộc.")
      .max(255, "Họ tên không được vượt quá 255 ký tự."),

    email: z
      .string()
      .min(1, "Email là bắt buộc.")
      .email("Định dạng email không hợp lệ.")
      .max(255, "Email không được vượt quá 255 ký tự."),

    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || PHONE_REGEX.test(val),
        "Số điện thoại phải có 10-11 chữ số.",
      ),

    address: z
      .string()
      .max(255, "Địa chỉ không được vượt quá 255 ký tự.")
      .optional(),

    password: z
      .string()
      .min(1, "Mật khẩu là bắt buộc.")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự.")
      .regex(
        PASSWORD_REGEX,
        "Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một chữ số và một ký tự đặc biệt.",
      ),

    password_confirmation: z.string().min(1, "Xác nhận mật khẩu là bắt buộc."),

    device_name: z
      .string()
      .min(1, "Tên thiết bị là bắt buộc.")
      .max(100, "Tên thiết bị không được vượt quá 100 ký tự."),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Xác nhận mật khẩu không khớp.",
    path: ["password_confirmation"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const navigate = useNavigate();

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      password_confirmation: "",
      device_name: useDeviceName(),
    },
  });

  const { mutateAsync, isPending } = useRegister({
    onSuccess: (data) => {
      toast.success(data.message || "Đăng ký thành công!", {
        description: "Vui lòng kiểm tra email để xác thực tài khoản.",
      });
      navigate(pageRoute.login);
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    await mutateAsync(values);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="full_name"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>
              Họ tên
              <span className="text-destructive">*</span>
            </FieldLabel>
            <Input type="text" placeholder="Nhập họ tên của bạn" {...field} />
            {errors.full_name && (
              <FieldDescription className="text-destructive">
                {errors.full_name.message}
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
            <Input type="email" placeholder="Nhập email của bạn" {...field} />
            {errors.email && (
              <FieldDescription className="text-destructive">
                {errors.email.message}
              </FieldDescription>
            )}
          </Field>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Số điện thoại</FieldLabel>
              <Input type="tel" placeholder="Nhập số điện thoại" {...field} />
              {errors.phone && (
                <FieldDescription className="text-destructive">
                  {errors.phone.message}
                </FieldDescription>
              )}
            </Field>
          )}
        />

        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Địa chỉ</FieldLabel>
              <Input type="text" placeholder="Nhập địa chỉ" {...field} />
              {errors.address && (
                <FieldDescription className="text-destructive">
                  {errors.address.message}
                </FieldDescription>
              )}
            </Field>
          )}
        />
      </div>

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>
              Mật khẩu
              <span className="text-destructive">*</span>
            </FieldLabel>
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

      <Controller
        name="password_confirmation"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>
              Xác nhận mật khẩu
              <span className="text-destructive">*</span>
            </FieldLabel>
            <Input type="password" placeholder="Nhập lại mật khẩu" {...field} />
            {errors.password_confirmation && (
              <FieldDescription className="text-destructive">
                {errors.password_confirmation.message}
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

      <Button
        type="submit"
        disabled={isSubmitting || isPending}
        className="mt-2"
      >
        {isPending ? <Spinner /> : <><UserPlus className="size-4" /> Đăng ký</>}
      </Button>
    </form>
  );
}
