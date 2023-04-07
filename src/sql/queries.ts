const USERS = "users";

const queries = {
    users: {
        select_all: `${USERS}/select_all`,
        upsert: `${USERS}/upsert`,
    }
}

export default queries;