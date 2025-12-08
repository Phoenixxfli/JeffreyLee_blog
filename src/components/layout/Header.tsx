import Link from "next/link";
import { siteConfig } from "@/config/site";
import ThemeToggle from "../theme/ThemeToggle";
import UserMenu from "../user/UserMenu";
import { auth } from "@/auth";

export default async function Header() {
  const session = await auth();
  const isAdmin = !!session?.user?.isAdmin;
  const navItems = siteConfig.nav.filter((item) => item.href !== "/upload" || isAdmin);
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/80 dark:bg-gray-950/60 border-b border-gray-200/70 dark:border-gray-800/60 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          {siteConfig.name}
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-gray-700 hover:text-brand dark:text-gray-200 dark:hover:text-brand hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
          <UserMenu />
        </nav>
      </div>
    </header>
  );
}

