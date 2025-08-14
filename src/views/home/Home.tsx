"use client"
import { useAppMetadata } from "@/app/commons/AppMetadataContext"
import { ToolsGrid } from "@/components/tools-grid"

export default function HomePage() {
  const metadata = useAppMetadata()
  return (
    <div className="flex-1">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">{metadata?.translation?.[0]?.name}</h1>
          <p className="text-slate-300 text-lg">{metadata?.translation?.[0]?.description}</p>
        </div>
        <ToolsGrid />
      </div>
    </div>
  )
}
