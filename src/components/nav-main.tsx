"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import Link from "next/link";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <Link href="/" className="w-full">
        <Button variant="default" className="w-full mb-4">
          New Chat
        </Button>
      </Link>
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      <SidebarMenu></SidebarMenu>
    </SidebarGroup>
  );
}
