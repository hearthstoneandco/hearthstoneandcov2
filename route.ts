import { NextResponse } from "next/server";

const gmailEmail = process.env.GOOGLE_MAIL_FROM_EMAIL;
const gmailAppPassword = process.env.GOOGLE_MAIL_APP_PASSWORD;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const role = String(body?.role ?? "").trim();
    const inviteLink = String(body?.inviteLink ?? "").trim();
    const siteName = String(body?.siteName ?? "").trim();
    const contactEmail = String(body?.contactEmail ?? "").trim();
    const subject = String(body?.subject ?? "Your invite").trim();

    if (!email || !role || !inviteLink) {
      return NextResponse.json({ error: "Missing invite details." }, { status: 400 });
    }

    if (!gmailEmail || !gmailAppPassword) {
      return NextResponse.json({ error: "Email settings are not configured." }, { status: 500 });
    }

    const message = [
      `To: ${email}`,
      `From: ${gmailEmail}`,
      `Subject: ${subject}`,
      "Content-Type: text/plain; charset=UTF-8",
      "",
      `You have been invited to ${siteName}.`,
      `Role: ${role}`,
      "",
      `Open your portal here: ${inviteLink}`,
      "",
      `If you need help, contact ${contactEmail}.`,
    ].join("\r\n");

    const auth = Buffer.from(`${gmailEmail}:${gmailAppPassword}`).toString("base64");
    const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: Buffer.from(message).toString("base64") }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Unable to send invite email." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to send invite email." }, { status: 500 });
  }
}
