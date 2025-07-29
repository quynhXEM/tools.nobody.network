import Home from "@/views/home/Home"
import { getTranslations } from "next-intl/server";


export const generateMetadata = async () => {
  const t = await getTranslations();

  return {
    title: t("title"),
  };
};

export default function HomePage() {
  return <Home />
}