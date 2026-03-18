import { useState } from "react";
import { Outlet, Link, NavLink } from "react-router";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { adminNavItems } from "@/configs/site-config";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  FolderTree,
  Film,
  Users,
  PanelLeftClose,
  PanelLeft,
  Home,
  LogOut,
} from "lucide-react";

const navItems = adminNavItems;

const iconMap = {
  LayoutDashboard,
  FolderTree,
  Film,
  Users,
} as const;

function SidebarNav({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1">
        <nav className="grid gap-1 p-2">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg text-sm font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground",
                    collapsed
                      ? "h-10 w-10 justify-center mx-auto"
                      : "px-3 py-2.5",
                  ].join(" ")
                }
                end={item.to === "/admin"}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="size-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator />

      <div className="p-2">
        <Link className="cursor-pointer" to="/" title="Về trang chính">
          <Button
            variant="ghost"
            className={[
              "w-full gap-2",
              collapsed ? "justify-center" : "justify-start",
            ].join(" ")}
          >
            <Home className="size-5 shrink-0" />
            {!collapsed && <span>Về trang chính</span>}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background shadow-sm">
        <div className="flex h-14 items-center gap-4 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed((v) => !v)}
            title={collapsed ? "Mở sidebar" : "Thu sidebar"}
          >
            {collapsed ? (
              <PanelLeft className="size-5" />
            ) : (
              <PanelLeftClose className="size-5" />
            )}
          </Button>

          <div className="text-base font-semibold tracking-tight">
            Admin Panel
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button onClick={logout}>
              <LogOut className="size-4" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      <div className="h-[calc(100vh-4rem)] overflow-hidden">
        <div
          className={[
            "grid h-full transition-all duration-200",
            collapsed ? "grid-cols-[56px_1fr]" : "grid-cols-[240px_1fr]",
          ].join(" ")}
        >
          {/* Sidebar */}
          <aside className="border-r bg-background">
            <div className="h-full">
              <SidebarNav collapsed={collapsed} />
            </div>
          </aside>

          {/* Main */}
          <main className="h-full overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
