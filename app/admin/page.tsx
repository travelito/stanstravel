import { redirect } from "next/navigation";
import { createClient } from "@/lib/auth/supabase-server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = (data?.claims as { email?: string } | undefined)?.email;

  if (!email) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-2xl mb-4">Вы вошли как {email}</h1>
      <p className="text-ink/70">
        Здесь появится редактирование туров, экскурсий и загрузка фото —
        следующий этап.
      </p>
    </div>
  );
}
