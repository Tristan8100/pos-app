'use client'
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/sidebar-02/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile"

export default function Sidebar02({children}: {children: React.ReactNode}) {
    const isMobile = useIsMobile()

  return (
    <SidebarProvider>
      <div className="relative flex h-dvh w-full">
        <DashboardSidebar />
        {isMobile && <SidebarTrigger />}
        <SidebarInset className="flex flex-col">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
