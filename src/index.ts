import { app, ensureDatabaseConnection } from "./app";

const start = async () => {
    await ensureDatabaseConnection();

    const port =
        Number(process.env.PORT) || 3000;

    app.listen(port, () => {
        console.log(
            `Application listening on port ${port}`,
        );
    });
};

start().catch((error) => {
    console.error("Application startup failed", error);

    process.exit(1);
});
