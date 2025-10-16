"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, X, WandSparklesIcon, CircleAlert, AlertTriangle } from "lucide-react";
import { ReactNode } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  type: boolean | "warning" | "info"; // true = success, false = error, "warning" = warning, "info" = info
  children?: ReactNode;
}

export function NotificationModal({
  isOpen,
  onClose,
  title,
  message,
  type,
  children
}: NotificationModalProps) {
  
  const isSuccess = type === true;
  const isWarning = type === "warning";
  const isInfo = type === "info";
  const isError = type === false;
  
  const iconColor = isSuccess 
    ? "text-emerald-500" 
    : isWarning 
    ? "text-yellow-500" 
    : isInfo
    ? "text-blue-400"
    : "text-red-500";
    
  const titleColor = isSuccess 
    ? "text-emerald-300" 
    : isWarning 
    ? "text-yellow-300" 
    : isInfo
    ? "text-blue-300"
    : "text-red-300";
    
  const borderColor = isSuccess 
    ? "border-emerald-500/50" 
    : isWarning 
    ? "border-yellow-500/50" 
    : isInfo
    ? "border-blue-400/50"
    : "border-red-500/50";
    
  const bgGradient = isSuccess
    ? "bg-gradient-to-r from-emerald-900/20 to-green-900/20"
    : isWarning
    ? "bg-gradient-to-r from-yellow-900/20 to-orange-900/20"
    : isInfo
    ? "bg-gradient-to-r from-blue-900/20 to-cyan-900/20"
    : "bg-gradient-to-r from-red-900/20 to-orange-900/20";
    
  const buttonColor = isSuccess
    ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
    : isWarning
    ? "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
    : isInfo
    ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
    : "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogTitle></DialogTitle>
      <DialogContent
        showCloseButton={false}
        className="bg-transparent border-0 shadow-none p-0"
      >
        <Card
          className={`w-full max-w-md mx-auto bg-gray-900 border-gray-800 ${borderColor} shadow-2xl`}
        >
          <CardHeader className="pb-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bgGradient}`}>
                  {isSuccess ? (
                    <CheckCircle className={`w-6 h-6 ${iconColor}`} />
                  ) : isWarning ? (
                    <AlertTriangle className={`w-6 h-6 ${iconColor}`} />
                  ) : isInfo ? (
                    <WandSparklesIcon className={`w-6 h-6 ${iconColor}`} />
                  ) : (
                    <CircleAlert className={`w-6 h-6 ${iconColor}`} />
                  )}
                </div>
                <div>
                  <CardTitle className={`text-lg ${titleColor}`}>{title}</CardTitle>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={`p-4 rounded-lg overflow-hidden border ${borderColor} ${bgGradient}`}>
              <p className="text-gray-300 text-sm leading-relaxed text-wrap whitespace-pre-wrap">{message || children}</p>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
