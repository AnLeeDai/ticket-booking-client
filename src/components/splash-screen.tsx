import { Spinner } from "@/components/ui/spinner";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      {/* Logo */}
      <div className="mb-8 animate-pulse">
        <img
          src="/ticket_booking_logo.webp"
          alt="Ticket Booking Logo"
          className="w-24 h-24"
        />
      </div>

      {/* App Name */}
      <h1 className="text-2xl font-bold text-primary mb-2">Ticket Booking</h1>
      <p className="text-muted-foreground mb-8">Đang tải...</p>

      {/* Spinner */}
      <Spinner className="w-8 h-8 text-primary" />
    </div>
  );
}
