import { Button } from "@/components/ui/button";
import { auth, signIn } from "@/lib/auth";
import { Github } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  async function handleGithubLogin() {
    await signIn("github", { redirectTo: "/" });
  }

  async function handleGoogleLogin() {
    await signIn("google", { redirectTo: "/" });
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-between">
      <div className="flex-1 hidden md:block relative h-screen w-full">
        <Image
          alt=""
          src="https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?q=80&w=996&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          fill
          priority
          className="object-cover w-full h-full animate-in fade-in duration-300"
        />
      </div>
      <div className="right flex-1 px-3 flex items-center justify-center">
        <div>
          <h2 className="text-xl font-semibold mb-7 text-center">
            Login to your account
          </h2>

          <div className="space-y-3 w-xs">
            <form action={handleGithubLogin}>
              <Button type="submit" variant="default" className="w-full">
                <Github />
                Sign in with GitHub
              </Button>
            </form>

            <form
              action={handleGoogleLogin}
            >
              <Button type="submit" variant="outline" className="w-full">
                Sign in with Google
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
