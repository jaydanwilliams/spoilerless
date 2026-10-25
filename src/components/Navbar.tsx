import Image from "next/image";
import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="border-b border-gray-200">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold">
            Spoilerless
          </Link>
          <Link href="/anime" className="text-sm text-gray-600 hover:underline">
            Browse
          </Link>
        </div>

        {session?.user ? (
          <div className="flex items-center gap-3">
            {session.user.image && (
              <Image src={session.user.image} alt="" width={32} height={32} className="rounded-full" />
            )}
            <Link href="/account" className="text-sm hover:underline">
              {session.user.name ?? "Account"}
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button type="submit" className="rounded border border-gray-300 px-3 py-1 text-sm">
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/anime" });
            }}
          >
            <button type="submit" className="rounded bg-black px-3 py-1 text-sm text-white">
              Sign in with GitHub
            </button>
          </form>
        )}
      </nav>
    </header>
  );
}
