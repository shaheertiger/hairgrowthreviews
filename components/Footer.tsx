import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-stone-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2">
            <div className="flex items-center gap-2 text-lg font-extrabold text-brand-800">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-black text-white">
                H
              </span>
              {site.name}
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone-600">{site.description}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">Categories</h3>
            <ul className="mt-3 space-y-2 text-sm text-stone-600">
              {site.navCategories.map((c) => (
                <li key={c.label}>
                  <Link href={c.href} className="hover:text-brand-700">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">Company</h3>
            <ul className="mt-3 space-y-2 text-sm text-stone-600">
              {site.footerLinks.company.map((c) => (
                <li key={c.label}>
                  <Link href={c.href} className="hover:text-brand-700">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border-subtle pt-6">
          <p className="text-xs leading-relaxed text-stone-500">{site.disclosure}</p>
          <p className="mt-4 text-xs text-stone-400">
            © {new Date().getFullYear()} {site.name}. All rights reserved. Information on this site is for
            educational purposes only and is not a substitute for professional medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
