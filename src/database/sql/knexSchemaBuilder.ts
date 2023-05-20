import { Knex, knex } from 'knex'

/**
 * Creates a new table called 'users' in the database using Knex schema builder.
 * The table has three columns: 'id', 'uuid', and 'name'.
 * The 'id' column is an auto-incrementing primary key.
 * The 'uuid' column is a unique string that cannot be null.
 * The 'name' column is a non-null string.
 *
 * @param {Knex} knex - The Knex instance to use for creating the table.
 * @returns {Promise<void>} A Promise that resolves when the table has been created.
 */
export const knexSchemaBuilder = async (knex: Knex): Promise<void> => {
    await createUsersTable(knex);
}

const createUsersTable = async (knex: Knex): Promise<void> => {
    const tableExists = await knex.schema.hasTable('users');

    if (!tableExists) {
        await knex.schema.createTable('users', (table) => {
            table.increments('id').primary();
            table.string('uuid').notNullable().unique();
            table.string('name').notNullable();
        });
    }
}