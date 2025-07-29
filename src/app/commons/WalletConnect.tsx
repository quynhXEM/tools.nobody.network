import { Button } from "@/components/ui/button";
import { WalletIcon } from "lucide-react";


export default function WalletConnect() {
    return <>
        <Button variant="ghost" size={"sm"} className="cursor-pointer outline-none border-none ">
            <WalletIcon/>
        </Button>
    </>;
}