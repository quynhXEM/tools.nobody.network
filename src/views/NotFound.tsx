"use client";

import { useTranslations } from "next-intl";

const NotFound = () => {
  const t = useTranslations();
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>{t("page_not_found")}</p>
      <p>Please check the URL or return to the homepage.</p>
    </div>
  );
};

export default NotFound;
