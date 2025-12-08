import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Footer() {
  // 过滤掉上传链接，只显示普通导航项
  const navItems = siteConfig.nav.filter((item) => item.href !== "/upload");
  
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="grid gap-6 md:grid-cols-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="space-y-2">
            <div className="text-base font-semibold text-gray-900 dark:text-gray-100">{siteConfig.name}</div>
            <p className="text-sm leading-relaxed">{siteConfig.description}</p>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">导航</div>
            <div className="flex flex-wrap gap-3">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-brand">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">社交</div>
            <div className="flex gap-4">
              <a className="hover:text-brand" href={siteConfig.links.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a className="hover:text-brand" href={siteConfig.links.twitter} target="_blank" rel="noreferrer">
                Twitter/X
              </a>
            </div>
          </div>
        </div>
        <div className="mt-6 text-xs text-gray-500">© {new Date().getFullYear()} {siteConfig.name}</div>
      </div>
    </footer>
  );
}

