import nodemailer from 'nodemailer';

export interface MailerConfig {
  host: string;
  port: number;
  secure: boolean; // true for 465, false for other ports
  auth?: { user: string; pass: string };
  from: string;
}

function getConfig(): MailerConfig {
  const host = process.env.SMTP_HOST || '';
  const port = Number(process.env.SMTP_PORT || 0);
  const secure = (process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';
  const from = process.env.MAIL_FROM || process.env.SMTP_USER || 'no-reply@mecanixpro.local';

  const auth = user ? { user, pass } : undefined;
  return { host, port, secure, auth, from };
}

export class MailerService {
  private static transporter = (() => {
    const cfg = getConfig();
    // If SMTP not configured, create a stub transporter that logs
    if (!cfg.host || !cfg.port) {
      return null as any;
    }
    return nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      auth: cfg.auth,
    } as any);
  })();

  static async sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
    const cfg = getConfig();
    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,\n  Cantarell,Noto Sans,sans-serif;line-height:1.6;color:#0f172a">
        <h2 style="margin:0 0 12px">Restablecer contraseña</h2>
        <p>Has solicitado restablecer tu contraseña en MecanixPro.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;background:#0ea5e9;color:#fff;\n            padding:10px 14px;border-radius:10px;text-decoration:none">\n            Restablecer contraseña\n          </a>
        </p>
        <p>Si no has solicitado esto, ignora este mensaje.</p>
        <p style="color:#64748b;font-size:12px">Este enlace expira en 1 hora.</p>
      </div>
    `;

    const text = `Restablecer contraseña en MecanixPro\n${resetUrl}\nSi no solicitaste esto, ignora el mensaje.`;

    if (!this.transporter) {
      // Fallback: log to console
      console.log('[Mailer] SMTP no configurado. Email a %s con link: %s', to, resetUrl);
      return;
    }

    await this.transporter.sendMail({
      from: cfg.from,
      to,
      subject: 'MecanixPro - Restablecer contraseña',
      text,
      html,
    });
  }
}
