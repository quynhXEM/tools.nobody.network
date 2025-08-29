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
  { id: "us-east", name: "US East", country: "United States", coordinates: [-74.006, 40.7128] }, // New York
  { id: "us-west", name: "US West", country: "United States", coordinates: [-122.4194, 37.7749] }, // San Francisco
  { id: "europe", name: "Europe", country: "Germany", coordinates: [13.405, 52.52] }, // Berlin
  { id: "asia-pacific", name: "Asia Pacific", country: "Singapore", coordinates: [103.8198, 1.3521] }, // Singapore
  { id: "japan", name: "Japan", country: "Japan", coordinates: [139.6917, 35.6895] }, // Tokyo
  { id: "australia", name: "Australia", country: "Australia", coordinates: [151.2093, -33.8688] }, // Sydney
  { id: "brazil", name: "Brazil", country: "Brazil", coordinates: [-46.6333, -23.5505] }, // São Paulo
  { id: "india", name: "India", country: "India", coordinates: [77.1025, 28.7041] }, // New Delhi
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
                <circle r="12" fill="rgb(251 191 36)" opacity="0.3" className="animate-pulse" />
              )}

              <circle
                r="6"
                fill={selectedServer === server.id ? "green" : "rgb(251 191 36)"}
                stroke={selectedServer === server.id ? "#fff" : "rgb(217 119 6)"}
                strokeWidth="2"
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:r-8",
                  selectedServer === server.id ? "drop-shadow-lg scale-250" : "hover:drop-shadow-md scale-150",
                )}
                onClick={() => setSelectedServer(server.id)}
              />
            </Marker>
          ))}
        </ComposableMap>

        {/* {selectedServer && (
          <div className="mt-6 p-4 bg-muted rounded-lg border">
            {(() => {
              const server = serverLocations.find((s) => s.id === selectedServer)
              return server ? (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{server.name}</h3>
                    <p className="text-sm text-muted-foreground">{server.country}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600 font-medium">Online</span>
                  </div>
                </div>
              ) : null
            })()}
          </div>
        )} */}
      </div>
    </div>
  )
}
