import { Button } from "@/components/ui/button";
import { auth, signIn } from "@/lib/auth";
import { Bot, Github } from "lucide-react";
import { redirect } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default async function SignIn() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  async function handleGithubLogin() {
    "use server";
    await signIn("github", { redirectTo: "/" });
  }

  async function handleGoogleLogin() {
    "use server";
    await signIn("google", { redirectTo: "/" });
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-between">
      <div className="right flex-1 px-3 flex items-center justify-center">
        <div className="flex items-center justify-center flex-col">
          <Bot className="w-12 h-12 text-primary text-center mb-3" />
          <h2 className="text-xl font-semibold mb-7 text-center">
           Welcome to Asymmetri Ai
          </h2>

          <h3 className="text-md mb-3 text-center">Sign in to continue</h3>

          <div className="space-y-3 w-xs">
            <form action={handleGithubLogin}>
              <Button type="submit" variant="default" className="w-full">
                <Github />
                Sign in with GitHub
              </Button>
            </form>

            <form action={handleGoogleLogin}>
              <Button type="submit" variant="outline" className="w-full">
                <FcGoogle /> Sign in with Google
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
