import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import accountModel from '../accounts/account.model';
import refreshTokenModel from '../accounts/refresh-token.model';

const db: any = {};
export default db;

async function initialize() {
    // Read database configuration from environment variables
    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;
    const database = process.env.DB_NAME;

    // Validate required variables
    if (!host || !user || !password || !database) {
        throw new Error(
            'Missing required database environment variables: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME'
        );
    }

    // Create initial connection (without database selected)
    const connection = await mysql.createConnection({ host, port, user, password });

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();

    // Connect to the specific database using Sequelize
    const sequelize = new Sequelize(database, user, password, {
        host: host,
        port: port,
        dialect: 'mysql',
        logging: false // Disable logging in production (optional)
    });

    // Initialize models
    db.Account = accountModel(sequelize);
    db.RefreshToken = refreshTokenModel(sequelize);

    // Set up associations
    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    // Sync database schema
    await sequelize.sync();
}

// Run initialization
initialize();