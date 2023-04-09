export const constants = {
    frontend: {
        FRONTEND_URL: 'http://localhost:8080',
    },
    database: {
        DB_NAME: 'conversations.db',
        DB_PATH: './conversations.db',
        types: {
            SQLITE3: 'sqlite3',
        },
        TABLES: {
            CONVERSATIONS: 'conversations',
            MESSAGES: 'messages',
        },
        queries: {
            select_all_from_users: "get_all_users",
        }
    },
    http: {
        HTTP_STATUS: {
            OK: 200,
            CREATED: 201,
            NO_CONTENT: 204,
            BAD_REQUEST: 400,
            UNAUTHORIZED: 401,
            FORBIDDEN: 403,
            NOT_FOUND: 404,
            INTERNAL_SERVER_ERROR: 500,
        },
    },
    logging: {
        on: true,
    },
}

/*
    
*/