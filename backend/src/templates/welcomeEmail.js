export function renderWelcomeEmail(fullName) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Welcome to TalkToMe</title>
    <style>
      /* Reset and simple responsive styles */
      body { margin:0; padding:0; -webkit-text-size-adjust:none; -ms-text-size-adjust:none; font-family: "Helvetica Neue", Arial, sans-serif; background:#f5f7fa; color:#333; }
      .container { width:100%; max-width:600px; margin:24px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 8px 30px rgba(30,40,60,0.08); }
      .hero { background: linear-gradient(135deg,#6c5ce7 0%,#00b4d8 100%); color:#fff; padding:28px 24px; text-align:center; }
      .logo { font-weight:700; letter-spacing:0.6px; font-size:20px; }
      .title { font-size:22px; margin:12px 0 0; }
      .body { padding:24px; line-height:1.6; color:#444; }
      .greeting { font-weight:600; margin-bottom:8px; }
      .card { background:#f6f8fb; padding:16px; border-radius:8px; margin:16px 0; }
      .cta { display:inline-block; margin-top:12px; background:#6c5ce7; color:#fff; text-decoration:none; padding:12px 18px; border-radius:8px; font-weight:600; }
      .footer { font-size:12px; color:#9aa3b2; text-align:center; padding:18px 12px; }
      @media (max-width:420px){ .title{ font-size:18px } .hero{ padding:20px 16px } }
    </style>
  </head>
  <body>
    <center>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td align="center">
            <table role="presentation" class="container" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td class="hero">
                  <div class="logo">TalkToMe</div>
                  <div class="title">Welcome aboard, ${fullName}!</div>
                </td>
              </tr>

              <tr>
                <td class="body">
                  <div class="greeting">Hi ${fullName},</div>
                  <div>We're thrilled you joined TalkToMe — a place to share ideas, learn, and connect. Below are a few things to get you started.</div>

                  <div class="card" role="article">
                    <strong>What's next?</strong>
                    <ul style="margin:8px 0 0; padding-left:18px;">
                      <li>Complete your profile to help others find you.</li>
                      <li>Join conversations and create your first post.</li>
                      <li>Invite friends and grow your network.</li>
                    </ul>

                    <a href="https://talktome-16mp4.sevalla.app/" class="cta" target="_blank" rel="noopener">Get started</a>
                  </div>

                  <div>If you ever need help, reply to this email — we read every message.</div>
                  <div style="margin-top:12px; color:#6b7280; font-size:13px;">Happy chatting,<br>The TalkToMe Team</div>
                </td>
              </tr>

              <tr>
                <td class="footer">
                  TalkToMe • 123 Conversation Ave • If you didn't create an account, please ignore this email.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </center>
  </body>
</html>`;
}

export function renderWelcomeText(fullName) {
  return `Welcome ${fullName}!

Thanks for joining TalkToMe — a place to share ideas, learn, and connect.

Get started: https://talktome-16mp4.sevalla.app/

If you didn't create an account, ignore this message.

— The TalkToMe Team`;
}
