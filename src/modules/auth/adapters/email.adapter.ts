import nodemailer from "nodemailer";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
}

function createTransporter() {
  const port = Number(getRequiredEnv("SMTP_PORT"));

  if (Number.isNaN(port)) {
    throw new Error("SMTP_PORT must be a number");
  }

  return nodemailer.createTransport({
    host: getRequiredEnv("SMTP_HOST"),
    port,
    secure: getRequiredEnv("SMTP_SECURE") === "true",
    auth: {
      user: getRequiredEnv("SMTP_USER"),
      pass: getRequiredEnv("SMTP_PASSWORD"),
    },
  });
}

export class EmailAdapter {
  async sendRegistrationEmail(email: string, code: string): Promise<void> {
    if (process.env.NODE_ENV === "test") {
      return;
    }

    const transporter = createTransporter();

    const confirmationUrl =
      process.env.FRONTEND_CONFIRMATION_URL ??
      "https://example.com/confirm-email";

    const url = new URL(confirmationUrl);

    url.searchParams.set("code", code);

    await transporter.sendMail({
      from: getRequiredEnv("EMAIL_FROM"),
      to: email,
      subject: "Registration confirmation",
      html: `
                <h1>Thank for your registration</h1>
                <p>
                    To finish registration please follow the link below:
                    <a href="${url.toString()}">complete registration</a>
                </p>
            `,
    });
  }
  async sendPasswordRecoveryEmail(
    email: string,
    recoveryCode: string,
  ): Promise<void> {
    if (process.env.NODE_ENV === "test") {
      console.info("Password recovery email skipped: NODE_ENV=test");
      return;
    }
    const url = new URL(
      process.env.FRONTEND_RECOVERY_URL ??
        "https://example.com/password-recovery",
    );
    url.searchParams.set("recoveryCode", recoveryCode);
    const result = await createTransporter().sendMail({
      from: getRequiredEnv("EMAIL_FROM"),
      to: email,
      subject: "Password recovery",
      html: `<h1>Password recovery</h1><p><a href="${url.toString()}">recovery password</a></p>`,
    });
    if (!result.accepted?.length) {
      throw new Error("SMTP server did not accept the recovery email");
    }
    console.info("Password recovery email accepted by SMTP server");
  }
}
