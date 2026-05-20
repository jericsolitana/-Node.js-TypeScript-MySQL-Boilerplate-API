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
        throw new Error('Missing required database environment variables');
    }

    const caCert = process.env.DB_CA_CERT;
    const sslOptions = caCert ? { ca: caCert } : { rejectUnauthorized: false };

    console.log(`Connecting to DB at ${host}:${port}`);

    const sequelize = new Sequelize(database, user, password, {
        host,
        port,
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
            ssl: sslOptions,
            connectTimeout: 30000
        }
    });

    await sequelize.authenticate();
    console.log('DB connection established successfully.');

    db.Account = accountModel(sequelize);
    db.RefreshToken = refreshTokenModel(sequelize);

    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    await sequelize.sync();
    console.log('DB synced successfully.');
}

initialize().catch(err => {
    console.error('Failed to initialize database:', err.message);
    process.exit(1);
});