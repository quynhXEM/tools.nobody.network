"use client"

import { useEffect, useState } from "react"
// Minimal type shim for react-simple-maps to satisfy TS in React 19 env
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
import { cn } from "@/lib/utils"

interface ServerLocation {
  id: string
  name: string
  country: string
  coordinates: [number, number] // [longitude, latitude]
}

const serverLocations: ServerLocation[] = [
  // Europe
  { id: "germany", name: "Germany", country: "Germany", coordinates: [13.405, 52.52] }, // Berlin
  { id: "france", name: "France", country: "France", coordinates: [4.8357, 45.7640] }, // Lyon
  { id: "lithuania", name: "Lithuania", country: "Lithuania", coordinates: [25.2797, 54.6872] }, // Vilnius
  { id: "uk", name: "United Kingdom", country: "United Kingdom", coordinates: [-2.5879, 51.4545] }, // Bristol
  { id: "usa-east", name: "USA", country: "United States", coordinates: [-74.006, 40.7128] }, // New York
  { id: "brazil", name: "Brazil", country: "Brazil", coordinates: [-46.6333, -23.5505] }, // São Paulo
  { id: "malaysia", name: "Malaysia", country: "Malaysia", coordinates: [101.6869, 3.1390] }, // Kuala Lumpur
  { id: "indonesia", name: "Indonesia", country: "Indonesia", coordinates: [116.8456, -6.2088] }, // Jakarta
  { id: "india", name: "India", country: "India", coordinates: [77.1025, 28.7041] }, // New Delhi
  { id: "vietnam", name: "Vietnam", country: "Vietnam", coordinates: [105.8342, 21.0278] }, // Hanoi
]

export default function WorldMap({ setLocation }: { setLocation: (location: any) => void }) {
  const [selectedServer, setSelectedServer] = useState<string | null>(serverLocations[0].id)

  useEffect(() => {
    setLocation(selectedServer)
  }, [selectedServer])
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="relative bg-[#346b88] rounded-lg border p-4">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 120,
            center: [0, 20],
          }}
          className="w-full h-auto"
          style={{ maxHeight: "500px" }}
        >
          <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#fff"
                  stroke=""
                  strokeWidth={0.5}
                  className="outline-none"
                />
              ))
            }
          </Geographies>

          {serverLocations.map((server) => (
            <Marker key={server.id} coordinates={server.coordinates}>
              {selectedServer === server.id && (
                <>
                  {/* Hiệu ứng sóng lan tỏa liên tục */}
                  <circle r="8" fill="rgb(251 191 36)" className="wave-animation wave-animation-delay-1" />
                  <circle r="8" fill="rgb(251 191 36)" className="wave-animation wave-animation-delay-2" />
                  <circle r="8" fill="rgb(251 191 36)" className="wave-animation wave-animation-delay-3" />
                  <circle r="8" fill="rgb(251 191 36)" className="wave-animation wave-animation-delay-4" />
                  
                  {/* Hiển thị tên quốc gia khi được chọn */}
                  <text
                    x="0"
                    y="-25"
                    z="100"
                    textAnchor="middle"
                    className="text-sm font-semibold fill-current"
                    style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      fill: '#1f2937',
                      textShadow: '0 0 4px rgba(255,255,255,0.8)',
                    }}
                  >
                    {server.name}
                  </text>
                </>
              )}
              <circle
                r="6"
                fill={selectedServer === server.id ? "green" : "rgb(251 191 36)"}
                stroke={selectedServer === server.id ? "#fff" : "rgb(217 119 6)"}
                strokeWidth="2"
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:r-8",
                  selectedServer === server.id ? "drop-shadow-lg scale-175" : "hover:drop-shadow-md scale-150",
                )}
                onClick={() => setSelectedServer(server.id)}
              />
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </div>
  )
}
