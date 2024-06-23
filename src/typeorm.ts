import * as fs from 'fs';
import * as path from 'path';
import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenvConfig({ path: '.env' });
let sslCert = undefined;
try {
  const sslCertPath = path.join(
    __dirname,
    '..',
    'config',
    process.env.AWS_SSL_FILENAME,
  );
  sslCert = fs.readFileSync(sslCertPath).toString();
  console.log('env', process.env.ENV);
} catch (e) {
  console.error('SSL Certificate not found', e);
}

const config = {
  type: 'postgres',
  host: `${process.env.DB_HOST}`,
  port: `${process.env.DB_PORT}`,
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  ssl: sslCert && process.env.ENV != 'development' ? { ca: sslCert } : false,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  namingStrategy: new SnakeNamingStrategy(),
  autoLoadEntities: true,
  synchronize: false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
