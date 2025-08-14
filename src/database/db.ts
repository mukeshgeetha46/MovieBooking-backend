import knex from 'knex';
import config from '../config/pgadmin';

const db = knex(config.development);

export default db;
