
import { Sequelize } from 'sequelize';

export type DBType = 'mysql' | 'postgres' | 'mssql' | 'oracle';

interface DBConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: DBType;
}

function getRuntimeDbConfig(db: DBType): DBConfig {
  if (db === 'mysql') {
    return {
      username: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASS || '',
      database: process.env.MYSQL_DB || 'mecanixpro',
      host: process.env.MYSQL_HOST || 'localhost',
      port: Number(process.env.MYSQL_PORT) || 3306,
      dialect: 'mysql',
    };
  }
  if (db === 'postgres') {
    return {
      username: process.env.PG_USER || 'postgres',
      password: process.env.PG_PASS || '',
      database: process.env.PG_DB || 'mecanixpro',
      host: process.env.PG_HOST || 'localhost',
      port: Number(process.env.PG_PORT) || 5432,
      dialect: 'postgres',
    };
  }
  if (db === 'mssql') {
    return {
      username: process.env.MSSQL_USER || 'sa',
      password: process.env.MSSQL_PASS || '',
      database: process.env.MSSQL_DB || 'mecanixpro',
      host: process.env.MSSQL_HOST || 'localhost',
      port: Number(process.env.MSSQL_PORT) || 1433,
      dialect: 'mssql',
    };
  }
  // oracle
  return {
    username: process.env.ORACLE_USER || 'system',
    password: process.env.ORACLE_PASS || '',
    database: process.env.ORACLE_DB || 'XEPDB1',
    host: process.env.ORACLE_HOST || 'localhost',
    port: Number(process.env.ORACLE_PORT) || 1521,
    dialect: 'oracle',
  };
}

export function getSequelize(db?: DBType): Sequelize {
  const engine = (db || (process.env.DB_ENGINE as DBType) || (process.env.DB_TYPE as DBType) || 'mysql') as DBType;
  const cfg = getRuntimeDbConfig(engine);
  const common = {
    host: cfg.host,
    port: cfg.port,
    dialect: cfg.dialect as any,
    logging: false,
  } as any;
  if (engine === 'mssql') {
    const encrypt = (process.env.MSSQL_ENCRYPT || 'false').toLowerCase() === 'true';
    const trust = (process.env.MSSQL_TRUST_SERVER_CERT || 'false').toLowerCase() === 'true';
    common.dialectOptions = { options: { encrypt, trustServerCertificate: trust } };
  }
  return new Sequelize(cfg.database, cfg.username, cfg.password, common);
}
