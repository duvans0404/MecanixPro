
import { Sequelize } from 'sequelize';

export type DBType = 'mysql' | 'postgres' | 'mssql' | 'oracle';

interface DBConfig {
  [key: string]: {
    username: string;
    password: string;
    database: string;
    host: string;
    port: number;
    dialect: DBType;
  };
}

const dbConfigs: DBConfig = {
  mysql: {
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASS || '',
    database: process.env.MYSQL_DB || 'mecanixpro',
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT) || 3306,
    dialect: 'mysql',
  },
  postgres: {
    username: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASS || '',
    database: process.env.PG_DB || 'mecanixpro',
    host: process.env.PG_HOST || 'localhost',
    port: Number(process.env.PG_PORT) || 5432,
    dialect: 'postgres',
  },
  mssql: {
    username: process.env.MSSQL_USER || 'sa',
    password: process.env.MSSQL_PASS || '',
    database: process.env.MSSQL_DB || 'mecanixpro',
    host: process.env.MSSQL_HOST || 'localhost',
    port: Number(process.env.MSSQL_PORT) || 1433,
    dialect: 'mssql',
  },
  oracle: {
    username: process.env.ORACLE_USER || 'system',
    password: process.env.ORACLE_PASS || '',
    database: process.env.ORACLE_DB || 'XEPDB1',
    host: process.env.ORACLE_HOST || 'localhost',
    port: Number(process.env.ORACLE_PORT) || 1521,
    dialect: 'oracle',
  },
};


// Obtiene el motor de base de datos desde la variable de entorno DB_ENGINE
const dbEngine = (process.env.DB_ENGINE as DBType) || 'mysql';

export function getSequelize(db: DBType = dbEngine): Sequelize {
  const config = dbConfigs[db];
  return new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: false,
  });
}
