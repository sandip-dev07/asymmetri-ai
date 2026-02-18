"use client";

import type { ChatSessionSummary } from "@/server/actions/chat-actions";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";

export function NavMain({ chats }: { chats: ChatSessionSummary[] }) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <Link href="/" className="w-full">
        <Button variant="default" className="w-full mb-4" size={"sm"}>
          <Plus className="mr-2 h-4 w-4" /> New Chat
        </Button>
      </Link>

      <SidebarGroupLabel>Chats</SidebarGroupLabel>

      <SidebarMenu className="gap-1">
        {chats.map((chat) => {
          const chatUrl = `/chat/${chat.id}`;
          const isActive = pathname === chatUrl;

          return (
            <Link prefetch={true} key={chat.id} href={chatUrl} className="w-full">
              <Button
              size={"sm"}
                variant={isActive ? "outline" : "ghost"}
                className="w-full justify-start truncate"
              >
                {chat.title}
              </Button>
            </Link>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
