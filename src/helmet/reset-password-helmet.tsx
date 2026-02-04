import { Helmet } from "react-helmet";

export default function ResetPasswordHelmet() {
  return (
    <Helmet>
      <title>Đặt lại mật khẩu - Ticket Booking</title>
      <meta
        name="description"
        content="Đặt lại mật khẩu tài khoản Ticket Booking. Nhập mật khẩu mới để hoàn tất."
      />
      <meta
        name="keywords"
        content="đặt lại mật khẩu, reset password, ticket booking, khôi phục tài khoản"
      />
      <meta name="robots" content="noindex, nofollow" />
      <meta property="og:title" content="Đặt lại mật khẩu | Ticket Booking" />
      <meta
        property="og:description"
        content="Đặt lại mật khẩu tài khoản Ticket Booking."
      />
    </Helmet>
  );
}
