import type { Knex } from 'knex';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 5432,
      ssl: {
    rejectUnauthorized: false // Allow self-signed certs
  }
    },
    migrations: {
      directory: path.resolve(__dirname, 'migrations'),
      extension: 'ts',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: path.resolve(__dirname, 'seeds'),
      extension: 'ts'
    }
  }
};

export default config;