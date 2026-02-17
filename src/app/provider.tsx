import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <SessionProvider>{children}</SessionProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
