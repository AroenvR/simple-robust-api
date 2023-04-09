const USERS = "users";

const queries = {
    tables: {
        users: USERS,
    },
    users: {
        // Create
        insert: `INSERT INTO ${USERS} (uuid, name) VALUES`,
        onConflict: `ON CONFLICT (uuid) DO NOTHING`,
        placeholders: '(?, ?)',

        // Read
        select_all: `SELECT * FROM ${USERS}`,

        // Update

        // Delete

    }
}

export default queries;