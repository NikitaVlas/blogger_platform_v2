import nodemailer from "nodemailer";

function getRequiredEnv(
    name: string,
): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(
            `${name} is not configured`,
        );
    }

    return value;
}

function createTransporter() {
    const port = Number(
        getRequiredEnv("SMTP_PORT"),
    );

    if (Number.isNaN(port)) {
        throw new Error(
            "SMTP_PORT must be a number",
        );
    }

    return nodemailer.createTransport({
        host: getRequiredEnv(
            "SMTP_HOST",
        ),
        port,
        secure:
            getRequiredEnv(
                "SMTP_SECURE",
            ) === "true",
        auth: {
            user: getRequiredEnv(
                "SMTP_USER",
            ),
            pass: getRequiredEnv(
                "SMTP_PASSWORD",
            ),
        },
    });
}

export const emailAdapter = {
    async sendRegistrationEmail(
        email: string,
        code: string,
    ): Promise<void> {
        if (process.env.NODE_ENV === "test") {
            return;
        }

        const transporter =
            createTransporter();

        const confirmationUrl =
            process.env
                .FRONTEND_CONFIRMATION_URL ??
            "https://example.com/confirm-email";

        const url = new URL(
            confirmationUrl,
        );

        url.searchParams.set(
            "code",
            code,
        );

        await transporter.sendMail({
            from: getRequiredEnv(
                "EMAIL_FROM",
            ),
            to: email,
            subject:
                "Registration confirmation",
            html: `
                <h1>Thank for your registration</h1>
                <p>
                    To finish registration please follow the link below:
                    <a href="${url.toString()}">complete registration</a>
                </p>
            `,
        });
    },
};
