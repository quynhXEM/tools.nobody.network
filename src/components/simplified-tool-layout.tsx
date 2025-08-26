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
        <div className="flex mb-1">
          <div
            className={`rounded-lg bg-gradient-to-r ${color} items-center justify-center p-2`}
          >
            <IconComponent className="text-white w-6 h-6" color="#ffffff"/>
          </div>
          &nbsp;
          <h1 className="text-3xl font-bold text-white">{title}</h1>
        </div>
        <p className="text-slate-300 mb-8 ">{description}</p>
        {children}
      </main>
    </div>
  )
}
