import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

import ResetPasswordHelmet from "@/helmet/reset-password-helmet";
import ResetPasswordForm from "./reset-password-form";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { pageRoute } from "@/configs/site-config";

export default function ResetPasswordPage() {
  return (
    <div>
      <ResetPasswordHelmet />

      <Card className="shadow-md">
        <CardTitle className="text-center text-2xl font-bold">
          Đặt lại mật khẩu
        </CardTitle>

        <CardDescription className="text-center text-muted-foreground">
          Nhập mã xác nhận và mật khẩu mới
        </CardDescription>

        <CardContent>
          <ResetPasswordForm />
        </CardContent>

        <CardFooter className="justify-center">
          <Link
            to={pageRoute.login}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại đăng nhập
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
