import { Knex } from 'knex'

/**
 * Builds the database schema using Knex.
 * @param {Knex} knex - The Knex instance to use.
 * @returns {Promise<void>} A Promise that resolves when the schema has been built.
 */
export const knexSchemaBuilder = async (knex: Knex): Promise<void> => {
    await createUsersTable(knex);
}

/**
 * Creates the users table in the database.
 * - id: The auto-increment primary key.
 * - uuid: The user's UUIDv4.
 * - name: The user's name.
 * 
 * @param {Knex} knex - The Knex instance to use.
 * @returns {Promise<void>} A Promise that resolves when the table has been created.
 */
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