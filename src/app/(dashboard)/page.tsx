import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return <div>Welcome, {session.user.name}!</div>;
}
