import { Link } from "react-router";

import LoginHelmet from "@/helmet/login-helmet";
import LoginForm from "./login-form";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { pageRoute } from "@/configs/site-config";
import { UserPlus } from "lucide-react";

export default function LoginPage() {
  return (
    <div>
      <LoginHelmet />

      <Card className="shadow-md">
        <CardTitle className="text-center text-2xl font-bold">
          Đăng nhập vào Ticket Booking
        </CardTitle>

        <CardDescription className="text-center text-muted-foreground">
          Nhập thông tin tài khoản để tiếp tục
        </CardDescription>

        <CardContent>
          <LoginForm />
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link
              to={pageRoute.register}
              className="text-primary font-medium hover:underline"
            >
              <UserPlus className="size-3.5 inline-block mr-1" />
              Đăng ký ngay
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
