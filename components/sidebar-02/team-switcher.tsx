"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  ChevronsUpDown,
  Plus,
  Settings,
  Users,
  CreditCard,
  LifeBuoy,
} from "lucide-react";
import * as React from "react";
import { Logo } from "./logo";

export function TeamSwitcher() {
  const { isMobile } = useSidebar();


  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-background text-foreground">
                <Logo className="size-4" />
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  user
                </span>
                <span className="truncate text-xs">
                  user
                </span>
              </div>

              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg mb-4"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Teams
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Workspace
            </DropdownMenuLabel>

            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2">
                <Settings className="size-4" />
                Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/members" className="flex items-center gap-2">
                <Users className="size-4" />
                Members
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/billing" className="flex items-center gap-2">
                <CreditCard className="size-4" />
                Billing
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/support" className="flex items-center gap-2">
                <LifeBuoy className="size-4" />
                Support
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add team
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}