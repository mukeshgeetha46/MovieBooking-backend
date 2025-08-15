import { Request, Response, NextFunction } from 'express';
import httpstatus from '../utils/httpstatus';
import jwt, { JwtPayload as BaseJwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload extends BaseJwtPayload {
    id?: string;
    email?: string;
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: JwtPayload;
    }
}

function auth(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        httpstatus.errorResponse({ 
            code: 401, 
            message: 'Access denied, token missing!' 
        }, res);
        return;
    }

    const token = authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : authHeader;
   
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
            httpstatus.errorResponse({ 
                code: 401, 
                message: 'Invalid token!' 
            }, res);
            return;
        }

        req.user = decoded as JwtPayload;
        next();
    });
}

export { auth };