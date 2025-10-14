export const SendEmail = async ({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) => {
  try {
    const respone = await fetch("/api/directus/request", {
      method: "POST",
      body: JSON.stringify({
        collection: "email_outbox",
        type: "createItem",
        items: {
          to,
          subject,
          body: html,
          status: "scheduled",
          app_id: process.env.NEXT_PUBLIC_APP_ID,
        },
      }),
    });
    return respone.json();
  } catch (error: any) {
    return { error: error.message };
  }
};
