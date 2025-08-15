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
    const respone = await fetch("/api/send/email", {
      method: "POST",
      body: JSON.stringify({ to, subject, text, html }),
    });
    return respone.json();
  } catch (error: any) {
    return { error: error.message };
  }
};

