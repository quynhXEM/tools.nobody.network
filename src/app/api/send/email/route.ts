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

  // Xử lý và chuẩn hóa dữ liệu từ metadata
  const port = parseInt(metadata.smtp_port.toString());
  const isSecure = metadata.smtp_secure === true || metadata.smtp_secure === 'true' || metadata.smtp_secure === 'ssl';
  const isTLS = metadata.smtp_secure === 'tls' || metadata.smtp_secure === 'starttls';
  
  // Kiểm tra authentication cho SendGrid
  if (metadata.smtp_host?.includes('sendgrid') && !metadata.smtp_password) {
    return NextResponse.json({ 
      error: "SendGrid requires authentication. Please provide smtp_password (API key)." 
    }, { status: 400 });
  }

  // Tạo cấu hình transporter với xử lý SSL/TLS tốt hơn
  const transportConfig: any = {
    host: metadata.smtp_host,
    port: port,
    secure: isSecure, // true cho port 465/SSL, false cho 587/TLS
    requireTLS: isTLS || (!isSecure && port === 587), // Bắt buộc TLS cho port 587
    tls: {
      // Bỏ qua lỗi certificate và cipherSuite
      rejectUnauthorized: false,
      ciphers: 'SSLv3',
      secureProtocol: 'TLSv1_2_method',
    },
    // Thêm timeout để tránh treo kết nối
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
  };

  // Chỉ thêm auth nếu có password
  if (metadata.smtp_password) {
    transportConfig.auth = {
      user: metadata.smtp_username, // Email dùng để xác thực
      pass: metadata.smtp_password, // Password hoặc app password
    };
  }

  const transporter = nodemailer.createTransport(transportConfig);

  // Gửi email với fallback
  try {
    await transporter.sendMail({
      from: `${metadata.smtp_from_name} <${metadata.smtp_from_email}>`, // Địa chỉ gửi với tên
      to,
      subject,
      text,
      html,
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('SMTP Error:', error);
    
    // Thử lại với cấu hình đơn giản hơn nếu lỗi SSL
    if (error.code === 'ESOCKET' || error.message.includes('SSL')) {
      try {
        const fallbackConfig: any = {
          host: metadata.smtp_host,
          port: metadata.smtp_port,
          secure: false, // Luôn dùng không secure
          ignoreTLS: true, // Bỏ qua TLS hoàn toàn
        };
        
        if (metadata.smtp_password) {
          fallbackConfig.auth = {
            user: metadata.smtp_username,
            pass: metadata.smtp_password,
          };
        }
        
        const fallbackTransporter = nodemailer.createTransport(fallbackConfig);
        
        await fallbackTransporter.sendMail({
          from: `${metadata.smtp_from_name} <${metadata.smtp_from_email}>`,
          to,
          subject,
          text,
          html,
        });
        
        return NextResponse.json({ success: true, fallback: true });
      } catch (fallbackError: any) {
        console.error('Fallback SMTP Error:', fallbackError);
        return NextResponse.json({ 
          error: `Primary: ${error.message}, Fallback: ${fallbackError.message}` 
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}