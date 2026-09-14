# Blogger platform v2

## Development

- `npm run build` — compile TypeScript.
- `npm test` — build and run regression checks without MongoDB or sending email.
- `npm start` — connect to MongoDB and start the HTTP server.

## Classes and dependency injection

`src/composition-root/container.ts` is the application composition root. All 20
controller, service, repository and email-adapter providers are classes registered
as singletons in one Inversify container. Constructor arguments are resolved by
explicit factories; decorators are not required. Routes and middleware import
resolved instances from the composition root. Provider modules never import the
container or construct their own dependent providers.

Express receives methods bound to their controller instances. Passing a class
method directly loses `this` and breaks access to injected services.

`createBlogContainer(postsService)` is a separate educational example using the
handwritten `SimpleContainer`: it constructs the Blog repository, service and
controller through factories. It is not a second production module container.

## Regression findings

The class migration in `f09f40e` changed controller methods to access `this.service`
without updating route bindings. Earlier patches fixed Blogs and Users; this
revision also fixes Posts, Comments and the newly converted Auth controller.
The original composition root registered instances that routes did not consume;
all application providers are now assembled centrally.

Password recovery formerly used `normalizeEmail()` while user creation preserved
the submitted address. Gmail dots and plus tags could therefore change during
lookup, returning 204 without finding the user or sending a message. Recovery now
preserves the address (apart from surrounding whitespace), consistently with user
creation. The report does not expose the test email, so this is a reproduced bug,
not proof of the exact cause of that production run.

Regression checks use real Express routing, validation, controllers, services,
password hashing and email HTML generation. Database repositories and SMTP are
stubbed; they do not establish production MongoDB connectivity or email delivery.

## Email on Vercel

Required: SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASSWORD, EMAIL_FROM.
Gmail configuration in the local project uses smtp.gmail.com, 465 and true.
FRONTEND_RECOVERY_URL is optional; the generated link always contains recoveryCode.
NODE_ENV=test skips actual email delivery and now logs the reason. Successful SMTP
acceptance is logged without email addresses, credentials or recovery codes; it is
not proof of inbox delivery. Existing error handling retains the API's 204 response.
Environment changes require a new deployment. Local Gmail credentials returned
535/EAUTH during diagnosis; the values stored in Vercel have not been verified.
