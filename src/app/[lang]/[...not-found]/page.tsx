
import NotFound from "@/views/NotFound";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async () => {
  const t = await getTranslations();

  return {
    title: t("page_not_found"),
  };
};

const NotFoundPage = () => {
  return <NotFound />;
};

export default NotFoundPage;
