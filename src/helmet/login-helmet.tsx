import { Helmet } from "react-helmet";

export default function LoginHelmet() {
  return (
    <Helmet>
      <title>Đăng nhập - Ticket Booking</title>
      <meta
        name="description"
        content="Đăng nhập Ticket Booking để đặt vé xem phim nhanh chóng, chọn ghế dễ dàng, thanh toán an toàn tại các rạp trên toàn quốc."
      />
      <meta
        name="keywords"
        content="đăng nhập, đặt vé xem phim, ticket booking, vé rạp, mua vé online"
      />
      <meta name="robots" content="noindex, nofollow" />
      <meta property="og:title" content="Đăng nhập | Ticket Booking" />
      <meta
        property="og:description"
        content="Đăng nhập để đặt vé xem phim, chọn ghế và thanh toán nhanh chóng."
      />
      <meta property="og:type" content="website" />
    </Helmet>
  );
}
