import knex from 'knex';
import config from '../config/pgadmin';

const environment = process.env.NODE_ENV || 'development';
const connection = knex(config[environment]);

export default connection;