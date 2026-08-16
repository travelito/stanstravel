import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/auth/supabase-server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = (data?.claims as { email?: string } | undefined)?.email;

  if (!email) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-2xl mb-8">Вы вошли как {email}</h1>
      <div className="grid sm:grid-cols-2 gap-6 max-w-xl">
        <Link
          href="/admin/tours"
          className="block rounded-lg border border-ink/10 bg-white p-6 hover:border-turquoise transition-colors"
        >
          <h2 className="font-display text-lg">Туры</h2>
          <p className="text-sm text-ink/60 mt-1">Список, создание, правка, удаление</p>
        </Link>
        <Link
          href="/admin/excursions"
          className="block rounded-lg border border-ink/10 bg-white p-6 hover:border-turquoise transition-colors"
        >
          <h2 className="font-display text-lg">Экскурсии</h2>
          <p className="text-sm text-ink/60 mt-1">Список, создание, правка, удаление</p>
        </Link>
        <Link
          href="/admin/transfers"
          className="block rounded-lg border border-ink/10 bg-white p-6 hover:border-turquoise transition-colors"
        >
          <h2 className="font-display text-lg">Трансферы</h2>
          <p className="text-sm text-ink/60 mt-1">Список, создание, правка, удаление</p>
        </Link>
        <Link
          href="/admin/train-tickets"
          className="block rounded-lg border border-ink/10 bg-white p-6 hover:border-turquoise transition-colors"
        >
          <h2 className="font-display text-lg">Жд-билеты</h2>
          <p className="text-sm text-ink/60 mt-1">Список, создание, правка, удаление</p>
        </Link>
      </div>
    </div>
  );
}
