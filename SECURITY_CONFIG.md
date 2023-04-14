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
optionsSuccessStatus: 204,  

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
DOMPurify was chosen because of the following research
- Most weekly NPM downloads for the sanitizer keyword.
- NPM tends as of 04/23: https://npmtrends.com/dompurify-vs-sanitize-html-vs-xss
- measurethat benchmark of 2022: https://www.measurethat.net/Benchmarks/Show/22327/0/dompurify-vs-sanitize-html-2022

# Data validation:
TODO: Check out validator.js

# Rate limiting:
express-rate-limit was chosen for the following reason: // TODO