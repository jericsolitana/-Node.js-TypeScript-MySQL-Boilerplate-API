import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import accountModel from '../accounts/account.model';
import refreshTokenModel from '../accounts/refresh-token.model';

const db: any = {};
export default db;

async function initialize() {
    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;
    const database = process.env.DB_NAME;

    if (!host || !user || !password || !database) {
        throw new Error(
            'Missing required database environment variables: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME'
        );
    }

    // Read CA cert from environment variable directly (no file needed)
    const caCert = process.env.DB_CA_CERT;
    const sslOptions = caCert ? { ca: caCert } : {};

    const connection = await mysql.createConnection({ 
        host, port, user, password,
        ssl: sslOptions
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();

    const sequelize = new Sequelize(database, user, password, {
        host,
        port,
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
            ssl: sslOptions
        }
    });

    db.Account = accountModel(sequelize);
    db.RefreshToken = refreshTokenModel(sequelize);

    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    await sequelize.sync();
}

initialize();