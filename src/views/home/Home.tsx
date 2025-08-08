import { ToolsGrid } from "@/components/tools-grid"

export default function HomePage() {
  return (
    <div className="flex-1">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Crypto Tools</h1>
          <p className="text-slate-300 text-lg">Công cụ blockchain chuyên nghiệp cho quản lý token</p>
        </div>
        <ToolsGrid />
      </div>
    </div>
  )
}
