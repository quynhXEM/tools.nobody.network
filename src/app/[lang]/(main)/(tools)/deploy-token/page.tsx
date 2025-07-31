
import DeployTokenPage from "@/views/deploy-token/DeployTokenPage";
import Home from "@/views/home/Home"
import { getTranslations } from "next-intl/server";


export const generateMetadata = async () => {
    const t = await getTranslations();

    return {
        title: t("title"),
    };
};

export default function Page() {
    return <DeployTokenPage />
}