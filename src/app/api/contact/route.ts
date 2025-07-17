import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { jmeno, email, telefon, zprava } = data;

    // Ověření povinných polí
    if (!jmeno || !email || !zprava) {
      return NextResponse.json({ error: 'Chybí povinné údaje.' }, { status: 400 });
    }

    // SMTP údaje z env
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpTo = process.env.SMTP_TO;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !smtpTo) {
      return NextResponse.json({ error: 'Chybí SMTP konfigurace.' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: Number(smtpPort) === 465, // true pro 465, jinak false
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: smtpUser,
      to: smtpTo,
      subject: 'Nová zpráva z kontaktního formuláře',
      text: `Jméno: ${jmeno}\nE-mail: ${email}\nTelefon: ${telefon || ''}\nZpráva: ${zprava}`,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Chyba při odesílání e-mailu:', error);
    return NextResponse.json({ error: 'Chyba při odesílání e-mailu.' }, { status: 500 });
  }
} 