import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { useState } from "react"


export const CopyBtn = ({ data }: { data: string }) => {
    const [isCopy, setCopy] = useState<boolean>(false)
    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopy(true)
            setTimeout(() => {
                setCopy(false)
            }, 2000)
        } catch (err) {
            setCopy(false)
        }
    }

    return (
        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(data)}>
            {isCopy ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
        </Button>
    )
}