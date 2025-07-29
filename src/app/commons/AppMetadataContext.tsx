"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AppMetadata {
  logo?: string;
  icon?: string;
  [key: string]: any;
}

const AppMetadataContext = createContext<AppMetadata>({});

export function AppMetadataProvider({ initialMetadata, children }: { initialMetadata: AppMetadata, children: ReactNode }) {
  const [metadata, setMetadata] = useState<AppMetadata>(initialMetadata);

  useEffect(() => {
    if (!metadata) return;
    const fetchData = async () => {
      setMetadata(prev => ({
        ...prev
      }));
    };
    fetchData();
  }, []);

  
  // Có thể fetch lại nếu muốn cập nhật động
  return (
    <AppMetadataContext.Provider value={metadata} >
      {children}
    </AppMetadataContext.Provider>
  );
}

export function useAppMetadata() {
  return useContext(AppMetadataContext);
} 