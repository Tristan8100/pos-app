"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Activity,
  Boxes,
  CalendarClock,
  Clock,
  DollarSign,
  Home,
  Infinity,
  LayoutDashboard,
  LinkIcon,
  Monitor,
  Package2,
  Percent,
  PieChart,
  Settings,
  ShoppingBag,
  Sparkles,
  Store,
  Tag,
  TrendingUp,
  Users,
} from "lucide-react";
import { Logo } from "@/components/sidebar-02/logo";
import type { Route } from "./nav-main";
import DashboardNavigation from "@/components/sidebar-02/nav-main";
import { NotificationsPopover } from "@/components/sidebar-02/nav-notifications";
import { TeamSwitcher } from "@/components/sidebar-02/team-switcher";

const sampleNotifications = [
  {
    id: "1",
    avatar: "/avatars/01.png",
    fallback: "OM",
    text: "New order received.",
    time: "10m ago",
  },
  {
    id: "2",
    avatar: "/avatars/02.png",
    fallback: "JL",
    text: "Server upgrade completed.",
    time: "1h ago",
  },
  {
    id: "3",
    avatar: "/avatars/03.png",
    fallback: "HH",
    text: "New user signed up.",
    time: "2h ago",
  },
];

const dashboardRoutes: Route[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <LayoutDashboard className="size-4" />,
    link: "/dashboard",
  },
  {
    id: "category",
    title: "Category",
    icon: <Tag className="size-4" />,
    link: "/dashboard/category",
  },
  {
    id: "discounts",
    title: "Discounts",
    icon: <Percent className="size-4" />,
    link: "/dashboard/discounts",
  },
  {
    id: "inventory",
    title: "Inventory",
    icon: <Boxes className="size-4" />,
    link: "/dashboard/inventory",
  },
  {
    id: "my-shifts",
    title: "My Shifts",
    icon: <CalendarClock className="size-4" />,
    link: "/dashboard/my-shifts",
  },
  {
    id: "shift",
    title: "Shift",
    icon: <Clock className="size-4" />,
    link: "/dashboard/shift",
  },
  {
    id: "staffs",
    title: "Staffs",
    icon: <Users className="size-4" />,
    link: "/dashboard/staffs",
  },
  {
    id: "orders",
    title: "Orders",
    icon: <ShoppingBag className="size-4" />,
    link: "/dashboard/orders",
  },
  {
    id: "2nd-screen",
    title: "2nd Screen",
    icon: <Monitor className="size-4" />,
    link: "/dashboard/2nd-screen",
  },
  {
    id: "products",
    title: "Products",
    icon: <Package2 className="size-4" />,
    link: "/dashboard/products",
  },
];

const teams = [
  { id: "1", name: "Alpha Inc.", logo: Logo, plan: "Free" },
  { id: "2", name: "Beta Corp.", logo: Logo, plan: "Free" },
  { id: "3", name: "Gamma Tech", logo: Logo, plan: "Free" },
];

export function DashboardSidebar() {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed";

  console.log(isMobile);

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader
        className={cn(
          "flex md:pt-3.5",
          isCollapsed
            ? "flex-row items-center justify-between gap-y-4 md:flex-col md:items-start md:justify-start"
            : "flex-row items-center justify-between"
        )}
      >
        <a href="#" className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          {!isCollapsed && (
            <span className="font-semibold text-black dark:text-white">
              Acme
            </span>
          )}
        </a>

        <motion.div
          key={isCollapsed ? "header-collapsed" : "header-expanded"}
          className={cn(
            "flex items-center gap-2",
            isCollapsed ? "flex-row md:flex-col-reverse" : "flex-row"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <NotificationsPopover notifications={sampleNotifications} />
          <SidebarTrigger />
        </motion.div>
      </SidebarHeader>
      <SidebarContent className="gap-4 px-2 py-4">
        <DashboardNavigation routes={dashboardRoutes} />
      </SidebarContent>
      <SidebarFooter className="px-2">
        <TeamSwitcher teams={teams} />
      </SidebarFooter>
    </Sidebar>
  );
}
