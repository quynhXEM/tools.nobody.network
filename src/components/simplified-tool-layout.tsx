import type React from "react"

interface SimplifiedToolLayoutProps {
  title: string
  description: string
  children: React.ReactNode
  icon: React.ElementType
  color: string
}

export function SimplifiedToolLayout({ title, description, children, icon, color }: SimplifiedToolLayoutProps) {
  const IconComponent = icon;
  return (
    <div className="flex-1">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex gap-4">
          <div
            className={`min-w-12 h-12 mt-2 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center`}
          >
            <IconComponent className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
            <p className="text-slate-300">{description}</p>
          </div>
        </div>

        {children}
      </main>
    </div>
  )
}
