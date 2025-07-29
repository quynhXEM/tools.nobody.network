"use client"
import { useRouter } from "@/i18n/navigation";
import { CirclePoundSterling, Zap } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const goPage = () => {
    router.push("/deploy-token")
  }
  return <div className="flex flex-wrap gap-2">
    <div onClick={() => goPage()} className="max-w-46 w-full flex flex-col gap-1 items-center justify-center border-1 rounded-sm p-2 cursor-pointer hover:scale-105 transition-all duration-100 hover:shadow-lg">
      <CirclePoundSterling className="w-9 h-9" />
      <p className="text-md text-blue-800 font-semibold">Deploy Token</p>
      <p className="text-xs">Tạo Token của riêng bạn</p>
    </div>
  </div>;
}