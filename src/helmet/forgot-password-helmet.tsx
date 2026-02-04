import { Helmet } from "react-helmet";

export default function ForgotPasswordHelmet() {
  return (
    <Helmet>
      <title>Quên mật khẩu - Ticket Booking</title>
      <meta
        name="description"
        content="Đặt lại mật khẩu tài khoản Ticket Booking. Nhập email để nhận mã xác nhận."
      />
      <meta
        name="keywords"
        content="quên mật khẩu, đặt lại mật khẩu, ticket booking, khôi phục tài khoản"
      />
      <meta name="robots" content="noindex, nofollow" />
      <meta property="og:title" content="Quên mật khẩu | Ticket Booking" />
      <meta
        property="og:description"
        content="Đặt lại mật khẩu tài khoản Ticket Booking."
      />
    </Helmet>
  );
}
