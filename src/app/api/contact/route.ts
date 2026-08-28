import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"AEDI Contact Form" <${process.env.SMTP_USER}>`,
      to: "cs@chunchreek.com",
      replyTo: email,
      subject: `[AEDI Contact] ${subject}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;">
          <h2 style="color:#EAC97C;border-bottom:1px solid #333;padding-bottom:8px;">New Contact Form Submission</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#888;width:100px;">Name</td><td style="padding:8px 0;color:#fff;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#888;">Email</td><td style="padding:8px 0;color:#fff;"><a href="mailto:${email}" style="color:#0E7490;">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#888;">Subject</td><td style="padding:8px 0;color:#fff;">${subject}</td></tr>
          </table>
          <div style="margin-top:16px;padding:16px;background:#111;border-radius:8px;color:#ccc;white-space:pre-wrap;">${message}</div>
          <p style="margin-top:24px;font-size:12px;color:#555;">Sent via the AEDI website contact form.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }
}
