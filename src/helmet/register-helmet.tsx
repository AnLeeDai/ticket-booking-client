import { Helmet } from "react-helmet";

export default function RegisterHelmet() {
  return (
    <Helmet>
      <title>Đăng ký - Ticket Booking</title>
      <meta
        name="description"
        content="Đăng ký tài khoản Ticket Booking để đặt vé xem phim nhanh chóng, chọn ghế dễ dàng, thanh toán an toàn tại các rạp trên toàn quốc."
      />
      <meta
        name="keywords"
        content="đăng ký, tạo tài khoản, đặt vé xem phim, ticket booking, vé rạp, mua vé online"
      />
      <meta name="robots" content="noindex, nofollow" />
      <meta property="og:title" content="Đăng ký | Ticket Booking" />
      <meta
        property="og:description"
        content="Đăng ký tài khoản để đặt vé xem phim, chọn ghế và thanh toán nhanh chóng."
      />
    </Helmet>
  );
}
