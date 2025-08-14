"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { ChevronDown, LanguagesIcon } from "lucide-react";

const LOCALES = [
  { code: "vi-VN", label: "Vietnamese", flag: <span className="fi fi-vn"></span> },
  { code: "en-US", label: "English", flag: <span className="fi fi-sh"></span> },
];

const LOCALE = {
  "vi-VN": { label: "Vietnamese", flag: <span className="fi fi-vn"></span> },
  "en-US": { label: "English", flag: <span className="fi fi-sh"></span> },
};

export default function LocaleDropdown() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleChangeLocale = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={"sm"} className="cursor-pointer outline-none border-none hover:bg-gray-400/40 text-white">
          {LOCALE[locale as keyof typeof LOCALE].flag}
          &nbsp;
          {LOCALE[locale as keyof typeof LOCALE].label}
          &nbsp;
          <ChevronDown className="text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {LOCALES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => handleChangeLocale(l.code)}
            className="flex items-center space-x-2 cursor-pointer"
            disabled={l.code === locale}
          >
            {l.flag}&nbsp;{l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
