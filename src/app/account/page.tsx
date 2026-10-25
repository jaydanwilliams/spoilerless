import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold">Your account</h1>
      <p className="mt-4">Signed in as {session.user.name}</p>
      <p className="text-sm text-gray-500">User ID: {session.user.id}</p>
    </main>
  );
}
