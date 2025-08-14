// src/app/api/send-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchAppMetadata } from "@/libs/utils";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { to, subject, text, html } = await req.json();

  // Lấy thông tin SMTP từ app metadata
  const metadata = await fetchAppMetadata();
  if (!metadata?.smtp_from_email) {
    return NextResponse.json({ error: "SMTP config not found" }, { status: 500 });
  }

  // Tạo transporter
  const transporter = nodemailer.createTransport({
    host: metadata.smtp_host,
    port: metadata.smtp_port,
    secure: metadata.smtp_secure, // true cho 465, false cho các port khác
  });

  // Gửi email
  try {
    await transporter.sendMail({
      from: metadata.smtp_from_name, // Địa chỉ gửi
      to,
      subject,
      text,
      html,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}