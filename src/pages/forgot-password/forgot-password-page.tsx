import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

import ForgotPasswordHelmet from "@/helmet/forgot-password-helmet";
import ForgotPasswordForm from "./forgot-password-form";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { pageRoute } from "@/configs/site-config";

export default function ForgotPasswordPage() {
  return (
    <div>
      <ForgotPasswordHelmet />

      <Card className="shadow-md">
        <CardTitle className="text-center text-2xl font-bold">
          Quên mật khẩu
        </CardTitle>

        <CardDescription className="text-center text-muted-foreground">
          Nhập email để nhận mã đặt lại mật khẩu
        </CardDescription>

        <CardContent>
          <ForgotPasswordForm />
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
