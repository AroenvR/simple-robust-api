# Database:
An in-memory **SQLite** database was chosen as the default database since it is created entirely in memory (RAM) and does not persist to the file system.  
This means that the database exists only for the duration of the process that created it and is automatically destroyed when the process ends.  
As a result, an in-memory SQLite database is not accessible via the file system, and there is no database to protect from local / network access.  
Only the application and possibly users with root access to the server's device can access the memory of a process.  
// TODO: Linux SELinux or AppArmor to limit access to the application's memory => https://phoenixnap.com/kb/apparmor-vs-selinux

If a persistent database is necessary, please add authenticated support for your database type of choice.  
F.ex.: PostgresSQL, MongoDB, SmartContract.

# CORS config:
The cors NPM package was chosen to handle CORS for the following reasion: // TODO

### Files:
```
src/serverConfig.ts  
src/middleware/configuredCors.ts  
```

originAllowList: [],  
methods: ['GET', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],  
allowedHeaders: ['Content-Type', 'Authorization'],  
exposedHeaders: [],  
preflightContinue: false,  
optionsSuccessStatus: 204

# HTTP Header config:
Helmet was chosen because of the following reason: // TODO

### Files:
```
src/serverConfig.ts  
src/middleware/configuredCors.ts  
```
referrerPolicy: { policy: 'no-referrer' }  
// TODO: Get default Helmet config from documentation

# Sanitization:
The sanitize-html and xss libraries are used to sanitize input and output data to prevent XSS attacks.

All incoming requests are sanitized before being processed.  
All outgoing responses are sanitized before being sent. 

### Files:
```
src/middleware/sanitize.ts  
```
All data to sanitize is funneled into the sanitizeValue function.

# Data validation:
validator is being used to validate data throughout the application.  
https://www.npmjs.com/package/validator

# Error Handler Middleware

The error handler middleware is designed to catch and handle errors that occur during the processing of API requests.  
It provides a centralized location for managing errors, ensuring a consistent response format and simplifying error handling throughout the application as well as ensuring no accidental stack traces are returned.

### Files:
```
src/middleware/errorHandler.ts
```

### Functionality:

The middleware takes an `ApiError` object as input, which contains information about the error, such as its type, status code, and message.  
Based on the error type, the middleware will generate an appropriate HTTP status code and error message to be returned to the client.

Supported error types include:

- AuthorizationError: Access denied due to insufficient permissions (401 status code)
- ValidationError: Input validation error (403 status code)
- NotFoundError: Resource not found (404 status code)

In case an error does not match any of the predefined error types, the middleware will return a generic 500 status code with an "An unknown error occurred" message.

The error handler middleware ensures that errors are logged and returned in a consistent format, simplifying debugging and maintenance.


# Rate limiting:
express-rate-limit was chosen for the following reason: // TODO

### Files:
```
src/middleware/configuredRateLimit.ts
```
```json
{  
    windowMs: 15 * 60 * 1000,  
    max: 100,  
    standardHeaders: true,  
    legacyHeaders: false,  
    message: 'Too many requests, please try again later.',  
    statusCode: 429,  
}
```

TODO: defaults...