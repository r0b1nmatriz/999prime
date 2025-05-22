
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, message } = body

    const transporter = nodemailer.createTransport({
      host: 'smtp.protonmail.ch',
      port: 587,
      secure: false,
      auth: {
        user: '999pr1me@proton.me',
        pass: process.env.PROTONMAIL_PASSWORD
      }
    })

    await transporter.sendMail({
      from: '999pr1me@proton.me',
      to: '999pr1me@proton.me',
      subject: `New Contact Form Submission from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Message: ${message}
      `,
      html: `
<h3>New Contact Form Submission</h3>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Message:</strong> ${message}</p>
      `
    })

    return NextResponse.json({ message: 'Email sent successfully' })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
