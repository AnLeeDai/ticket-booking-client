import { Outlet } from "react-router";
import { ShieldCheck, FileText } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding & Testimonial */}
      <div
        className="hidden lg:flex lg:flex-1 flex-col justify-between p-10 text-white relative bg-cover bg-center"
        style={{
          backgroundImage: `url('/ticket_booking_background.webp')`,
        }}
      >
        {/* Dark overlay with blur */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              className="w-10 h-10"
              src="/ticket_booking_logo.webp"
              alt="Logo đặt vé xem phim"
            />

            <span className="text-xl font-bold tracking-wide">
              TICKET BOOKING
            </span>
          </div>

          {/* Testimonial */}
          <div className="space-y-6">
            <blockquote className="text-2xl leading-relaxed font-medium">
              “Đặt vé chưa bao giờ nhanh, mượt và ‘điện ảnh’ đến thế. Trải
              nghiệm premiere bắt đầu từ đây.”
            </blockquote>

            <div className="flex items-center gap-4">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia"
                alt="Ảnh đại diện"
                className="w-12 h-12 rounded-full bg-primary-foreground/10"
              />

              <div>
                <p className="font-semibold">Sofia Davis</p>
                <p className="text-sm text-primary-foreground/70">
                  Người yêu điện ảnh & Nhà phê bình
                </p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-sm text-white/50">© SP26-DATN-WD-01</p>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-background">
        <div className="w-full max-w-md">
          <Outlet />

          {/* Footer Links */}
          <div className="mt-8 flex justify-center gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:underline inline-flex items-center gap-1">
              <ShieldCheck className="size-3" />
              CHÍNH SÁCH BẢO MẬT
            </a>
            <a href="#" className="hover:underline inline-flex items-center gap-1">
              <FileText className="size-3" />
              ĐIỀU KHOẢN DỊCH VỤ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
