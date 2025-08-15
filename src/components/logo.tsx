import { useAppMetadata } from "@/app/commons/AppMetadataContext"

export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  const metadata = useAppMetadata()
  return (
    <div className={className}>
      <img src={`${
    process.env.NEXT_PUBLIC_API_URL
  }/assets/${metadata.icon}/ids-coin.svg`} alt="logo" width={32} height={32} />
    </div>
  )
}
