import type { Metadata } from "next";
import { createClient } from "@/lib/auth/supabase-server";
import { signOut } from "@/app/admin/actions";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "StansTravel — Админка",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = (data?.claims as { email?: string } | undefined)?.email;

  return (
    <html lang="ru">
      <body className="font-body min-h-screen flex flex-col bg-plaster text-ink">
        <header className="border-b border-ink/10">
          <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
            <span className="font-display text-lg tracking-tight">StansTravel — Админка</span>
            {email && (
              <form action={signOut} className="flex items-center gap-3 font-mono text-sm">
                <span className="text-ink/60">{email}</span>
                <button type="submit" className="text-turquoise hover:text-indigo">
                  Выйти
                </button>
              </form>
            )}
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
