"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

// Khai báo type cho gtag
declare global {
    interface Window {
        gtag: (
            command: string,
            targetId: string,
            config?: { [key: string]: any }
        ) => void;
    }
}

export function GATracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (typeof window !== 'undefined' && window.gtag) {
            const searchString = searchParams ? '?' + searchParams.toString() : '';
            window.gtag("config", process.env.NEXT_PUBLIC_GA_ID!, {
                page_path: pathname + searchString,
            });
        }
    }, [pathname, searchParams]);

    return null;
}
