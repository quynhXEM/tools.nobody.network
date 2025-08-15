"use client"
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";

import { useTranslations } from "next-intl";
import { NotificationModal } from "@/views/home/NotificationModal";
import { RegisterAccount } from "@/views/RegisterAccount";

interface NotificationData {
  title: string;
  message?: string;
  type: boolean | "warning"; // true = success, false = error, "warning" = warning
  children?: ReactNode;
}

interface NotificationContextType {
  notify: (data: NotificationData) => void;
  register: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [show, setShow] = useState(false);
  const [showRE, setShowRE] = useState(false);
  const [id, setID] = useState("");
  const [data, setData] = useState<NotificationData>({ title: "", message: "", type: true });
  const notify = useCallback((data: NotificationData) => {
    setData(data);
    setShow(true);
  }, []);

  const register = useCallback((id: string) => {
    setID(id)
    setShowRE(true);
  }, []);

  const handleClose = () => setShow(false);

  const t = useTranslations("noti");

  return (
    <NotificationContext.Provider value={{ notify, register }}>
      {children}
      <NotificationModal
        t={t}
        isOpen={show}
        onClose={handleClose}
        title={data.title}
        message={data?.message}
        children={data?.children}
        type={data.type}
      />
      <RegisterAccount isOpen={showRE} id={id} onClose={() => setShowRE(false)} t={useTranslations("")} />
    </NotificationContext.Provider>
  );
};

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification must be used within a NotificationProvider");
  return context;
} 