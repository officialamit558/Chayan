import { Resend } from "resend"

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null
const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@chayanjobs.com"

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "")
}

export async function sendPasswordResetEmail(email: string, token: string) {
  if (!resend) {
    console.log(`[Email Mock] Password reset email to ${email}: ${getBaseUrl()}/reset-password?token=${token}`)
    return { success: true, mocked: true }
  }

  const resetUrl = `${getBaseUrl()}/reset-password?token=${token}`

  const { data, error } = await resend.emails.send({
    from: `Chayan <${fromEmail}>`,
    to: email,
    subject: "Reset Your Password - Chayan",
    html: `
      <div style="max-width:480px;margin:0 auto;padding:24px;font-family:Arial,sans-serif">
        <h2 style="color:#1e3a5f">Reset Your Password</h2>
        <p style="color:#555;line-height:1.6">You requested a password reset. Click the button below to set a new password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;margin:16px 0">Reset Password</a>
        <p style="color:#999;font-size:12px">If you didn't request this, ignore this email. Your password will remain unchanged.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="color:#999;font-size:12px">Chayan - select right. serve right.</p>
      </div>
    `,
  })

  if (error) {
    console.error("Failed to send email:", error)
    return { success: false, error: error.message }
  }

  return { success: true, id: data?.id }
}

export async function sendNewsletterWelcome(email: string) {
  if (!resend) {
    console.log(`[Email Mock] Newsletter welcome to ${email}`)
    return { success: true, mocked: true }
  }

  const { error } = await resend.emails.send({
    from: `Chayan <${fromEmail}>`,
    to: email,
    subject: "Welcome to Chayan Newsletter!",
    html: `
      <div style="max-width:480px;margin:0 auto;padding:24px;font-family:Arial,sans-serif">
        <h2 style="color:#1e3a5f">Welcome to Chayan!</h2>
        <p style="color:#555;line-height:1.6">You've subscribed to our newsletter. You'll now receive the latest government job alerts, exam notifications, and preparation tips directly in your inbox.</p>
        <p style="color:#555;line-height:1.6">Stay tuned for updates!</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="color:#999;font-size:12px">Chayan - select right. serve right.</p>
      </div>
    `,
  })

  if (error) {
    console.error("Failed to send welcome email:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
