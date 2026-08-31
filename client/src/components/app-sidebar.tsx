"use client";

import * as React from "react";
import {
  BarChartIcon,
  Building2Icon,
  ClipboardListIcon,
  FileTextIcon,
  HelpCircleIcon,
  InboxIcon,
  KeyRoundIcon,
  LandPlotIcon,
  LayoutDashboardIcon,
  SearchIcon,
  SettingsIcon,
  UserRoundIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "@/components/Logo";
import { Link, useLocation } from "react-router";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navGroups: [
    {
      label: "Overview",
      items: [
        { title: "Dashboard", url: "/admin", icon: LayoutDashboardIcon },
        { title: "Analytics", url: "/admin/analytics", icon: BarChartIcon },
      ],
    },
    {
      label: "Services",
      items: [
        { title: "Property Sales", url: "/admin/listings", icon: Building2Icon },
        { title: "Land and housing", url: "/admin/sales", icon: LandPlotIcon },
        { title: "Property management", url: "/admin/rentals", icon: KeyRoundIcon },
      ],
    },
    {
      label: "People",
      items: [
        { title: "Agents", url: "/admin/agents", icon: UsersIcon },
        { title: "Clients", url: "/admin/clients", icon: UserRoundIcon },
        { title: "Leads", url: "/admin/leads", icon: InboxIcon },
      ],
    },
  ],
  navSecondary: [
    { title: "Settings", url: "/admin/settings", icon: SettingsIcon },
    { title: "Get Help", url: "/admin/support", icon: HelpCircleIcon },
    { title: "Search", url: "/admin/search", icon: SearchIcon },
  ],
  documents: [
    { name: "Transactions", url: "/admin/transactions", icon: WalletIcon },
    { name: "Reports", url: "/admin/reports", icon: ClipboardListIcon },
    { name: "Contracts", url: "/admin/contracts", icon: FileTextIcon },
  ],
};

export function AppSidebar({ ...props }: React. ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const current = location.pathname + location.search;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/" className="group flex items-center gap-2.5">
                <Logo size={38} />
                <div className="flex flex-col leading-none">
                  <span className="font-display text-[1.35rem] font-bold tracking-tight text-stone-900 transition-colors group-hover:text-forest-800">
                    xProperty
                  </span>
                  <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-brass-600">
                    Real Estates
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {data.navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={current === item.url}
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
