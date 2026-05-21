import { expressjwt as jwt } from 'express-jwt';
import db from '../_helpers/db';

const secret = process.env.JWT_SECRET!;

export default function authorize(roles: any = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        jwt({ secret, algorithms: ['HS256'] }),
        async (req: any, res: any, next: any) => {
            // express-jwt v7+ uses req.auth instead of req.user
            const user = req.auth || req.user;
            
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const account = await db.Account.findByPk(user.id);

            if (!account || (roles.length && !roles.includes(account.role))) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            req.user = user;
            req.user.role = account.role;
            const refreshTokens = await account.getRefreshTokens();
            req.user.ownsToken = (token: any) => !!refreshTokens.find((x: any) => x.token === token);
            next();
        }
    ];
}