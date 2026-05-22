import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from './_middleware/error-handler';
import accountsController from './accounts/accounts.controller';
import swaggerDocs from './_helpers/swagger';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const corsOptions = {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 

// root route
app.get('/', (req: any, res: any) => {
    res.json({ 
        message: 'IPT 2026 Backend API is running!',
        docs: 'https://ipt-2026-backend-jwmv.onrender.com/api-docs'
    });
});

// api routes
app.use('/accounts', accountsController);
app.use('/api-docs', swaggerDocs);
app.use(errorHandler);

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || '80') : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));