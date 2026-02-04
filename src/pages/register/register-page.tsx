import { Link } from "react-router";

import RegisterHelmet from "@/helmet/register-helmet";
import RegisterForm from "./register-form";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { pageRoute } from "@/configs/site-config";

export default function RegisterPage() {
  return (
    <div>
      <RegisterHelmet />

      <Card className="shadow-md">
        <CardTitle className="text-center text-2xl font-bold">
          Đăng ký tài khoản
        </CardTitle>

        <CardDescription className="text-center text-muted-foreground">
          Tạo tài khoản để bắt đầu đặt vé
        </CardDescription>

        <CardContent>
          <RegisterForm />
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Đã có tài khoản?{" "}
            <Link
              to={pageRoute.login}
              className="text-primary font-medium hover:underline"
            >
              Đăng nhập
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
