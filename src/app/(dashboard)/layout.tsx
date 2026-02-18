import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getUserChatSessions } from "@/server/actions/chat-actions";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  const chats = await getUserChatSessions();

  return (
    <SidebarProvider>
      <AppSidebar chats={chats} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </header>
        <div className="px-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
