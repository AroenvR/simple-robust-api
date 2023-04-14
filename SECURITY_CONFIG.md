# CORS config:
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
### Files:
```
src/serverConfig.ts  
src/middleware/configuredCors.ts  
```
referrerPolicy: { policy: 'no-referrer' }  
// TODO: Get default config from documentation