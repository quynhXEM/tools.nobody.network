"use client"

import { useTranslations } from "next-intl"

export function Footer() {
  const t = useTranslations()

  return (
    <footer className="bg-slate-800/30 border-t border-slate-700 py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="text-center text-slate-400 text-sm">
        Copyright © {new Date().getFullYear()}{" "}
          <a
            href="https://www.nobody.network"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Nobody Network
          </a>
        </div>
      </div>
    </footer>
  )
}
