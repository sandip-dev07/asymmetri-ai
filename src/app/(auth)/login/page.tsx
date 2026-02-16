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

  return (
    <main className="min-h-screen w-full flex items-center justify-between">
      <div className="flex-1 hidden md:block relative h-screen w-full">
        <Image
          alt=""
          src="https://images.unsplash.com/photo-1647247743538-0137d6a8a268?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          fill
          priority
          className="object-cover w-full h-full animate-in fade-in duration-300"
        />
      </div>
      <div className="right flex-1 px-3 flex items-center justify-center">
        <form
          action={async () => {
            "use server";
            await signIn("github");
          }}
        >
          <h2 className="text-xl font-semibold mb-7 text-center">
            Login to your account
          </h2>
          <Button
            type="submit"
            variant="default"
            className="w-xs"
          >
            <Github />
            Signin with GitHub
          </Button>
        </form>
      </div>
    </main>
  );
}
