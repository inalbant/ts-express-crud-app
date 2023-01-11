import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

export const createJWT = (user: { id: string; username: string }) => {
    const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET!
    );
    return token;
};

export const protect = (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;

    if (!bearer) {
        res.status(401);
        res.send('Not authorized');
        return;
    }

    const [, token] = bearer.split(' ');
    if (!token) {
        console.log('here');
        res.status(401);
        res.send('Not authorized');
        return;
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = payload;
        console.log(payload);
        next();
        return;
    } catch (e) {
        console.error(e);
        res.status(401);
        res.send('Not authorized');
        return;
    }
};

const scryptPromise = promisify(scrypt);

export async function hashPw(password: string) {
    const salt = randomBytes(8).toString('hex');
    const derivedKey = await scryptPromise(password, salt, 64);
    return salt + ':' + (derivedKey as Buffer).toString('hex');
}

export async function verifyPw(password: string, hash: string) {
    const [salt, key] = hash.split(':');
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = await scryptPromise(password, salt, 64);
    return timingSafeEqual(keyBuffer, derivedKey as Buffer);
}
