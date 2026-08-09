import { signIn } from "@/app/admin/login/actions";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="mx-auto max-w-sm px-6 py-24">
      <h1 className="font-display text-2xl mb-8">Вход в админку</h1>
      <form action={signIn} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            name="email"
            required
            autoComplete="username"
            className="border border-ink/20 rounded-md px-3 py-2 bg-white"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Пароль
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="border border-ink/20 rounded-md px-3 py-2 bg-white"
          />
        </label>
        {searchParams.error && (
          <p className="text-sm text-red-700">{searchParams.error}</p>
        )}
        <button
          type="submit"
          className="mt-2 bg-indigo text-plaster px-4 py-2 rounded-md hover:bg-turquoise transition-colors"
        >
          Войти
        </button>
      </form>
    </div>
  );
}
